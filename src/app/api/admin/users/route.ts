import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/users
 *  └─ 企業一覧取得（ユーザー登録ページ用）
 *     バックエンド: app/routers/admin/user.py の get_companies
 *     FastAPI: GET /admin/user/companies
 */
export async function GET(req: NextRequest) {
  const backendUrl = process.env.API_BASE_URL;

  // 環境変数チェック
  if (!backendUrl) {
    console.error('API_BASE_URL環境変数が設定されていません');
    return NextResponse.json(
      { error: 'API_BASE_URL環境変数が設定されていません' }, 
      { status: 500 }
    );
  }

  try {
    // バックエンドの /admin/user/companies エンドポイントを呼び出し
    const resp = await fetch(`${backendUrl}/admin/user/companies`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        // 必要に応じて認証ヘッダーを追加
      },
      next: { revalidate: 30 },  // ISR: 30秒キャッシュ
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('バックエンドエラー:', errorText);
      return NextResponse.json(
        { error: errorText || '企業一覧の取得に失敗しました' }, 
        { status: resp.status }
      );
    }

    const companies = await resp.json();
    
    // バックエンドのレスポンス形式 [{id, name}] を
    // フロントエンドが期待する形式 [{companyId, companyName}] に変換
    const formattedCompanies = companies.map((company: any) => ({
      companyId: company.id || company.companyId || '',
      companyName: company.name || company.companyName || ''
    }));

    return NextResponse.json(formattedCompanies, { status: 200 });
  } catch (error) {
    console.error('企業一覧取得エラー:', error);
    return NextResponse.json(
      { error: '企業一覧の取得に失敗しました' }, 
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 *  └─ 管理者用：企業ユーザー登録（Auth0統合版）
 *     1. 事前重複チェック（Auth0 & DB）
 *     2. Auth0にユーザー作成
 *     3. DBにユーザー情報登録（Auth0UserIdを渡す）
 *     4. Authentication APIでパスワードリセットメール送信
 *     5. 招待メール送信（Auth0経由）
 */
export async function POST(req: NextRequest) {
  const backendUrl = process.env.API_BASE_URL;

  // 環境変数チェック
  const requiredEnvVars = {
    API_BASE_URL: backendUrl,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_M2M_CLIENT_ID: process.env.AUTH0_M2M_CLIENT_ID,
    AUTH0_M2M_CLIENT_SECRET: process.env.AUTH0_M2M_CLIENT_SECRET,
    AUTH0_CONNECTION_NAME: process.env.AUTH0_DB_CONNECTION || 'Username-Password-Authentication'
  };

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      console.error(`${key}環境変数が設定されていません`);
      return NextResponse.json(
        { error: `${key}環境変数が設定されていません` }, 
        { status: 500 }
      );
    }
  }

  try {
    const body = await req.json();
    const { companyId, email } = body;

    // バリデーション
    if (!companyId || !email) {
      return NextResponse.json(
        { error: '企業IDとメールアドレスは必須です' }, 
        { status: 400 }
      );
    }

    // 1. Auth0 Management APIアクセストークン取得
    const managementToken = await getAuth0ManagementToken();

    // 2. 事前重複チェック
    await checkUserExists(managementToken, email, backendUrl!);

    // 3. Auth0にユーザー作成
    const auth0User = await createAuth0User(managementToken, email, requiredEnvVars.AUTH0_CONNECTION_NAME);

    // 4. DBにユーザー情報登録（Auth0UserIdを渡す）
    let dbUser;
    try {
      dbUser = await createDbUser(backendUrl!, {
        email,
        companyId: companyId,
        auth0_id: auth0User.user_id,  // 既存のDBスキーマに合わせてauth0_idに変更
        isAdmin: false  // デフォルトで一般ユーザーとして登録
      });
    } catch (dbError) {
      // DBユーザー作成失敗時はAuth0ユーザーを削除（ロールバック）
      console.error('DBユーザー作成失敗、Auth0ユーザーを削除します:', dbError);
      try {
        await deleteAuth0User(managementToken, auth0User.user_id);
      } catch (deleteError) {
        console.error('Auth0ユーザー削除失敗:', deleteError);
      }
      throw dbError;
    }

    // 5. Authentication APIでパスワードリセットメール送信
    try {
      await sendPasswordResetEmail(email, requiredEnvVars.AUTH0_CONNECTION_NAME);
    } catch (emailError) {
      console.warn('パスワードリセットメール送信に失敗しました:', emailError);
      // メール送信失敗でもユーザー作成は成功とする
    }

    // 6. 成功レスポンス
    return NextResponse.json({
      message: 'ユーザーアカウントを作成し、パスワード設定メールを送信しました。ユーザーはメール内のリンクからパスワードを設定できます。',
      userId: auth0User.user_id,
      dbUserId: dbUser.user_id || dbUser._id,  // MongoDBの場合は_idを使用
      auth0_id: auth0User.user_id,  // 既存の形式に合わせる
      email: email
    }, { status: 201 });

  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    
    // エラーメッセージの詳細化
    let errorMessage = 'ユーザー登録に失敗しました';
    if (error instanceof Error) {
      if (error.message.includes('already exists') || error.message.includes('既に登録されています')) {
        errorMessage = 'このメールアドレスは既に登録されています';
      } else if (error.message.includes('invalid email')) {
        errorMessage = 'メールアドレスの形式が正しくありません';
      } else if (error.message.includes('企業が見つかりません')) {
        errorMessage = '指定された企業が見つかりません';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}

/**
 * Auth0 Management APIアクセストークン取得
 */
async function getAuth0ManagementToken(): Promise<string> {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  if (!auth0Domain) {
    throw new Error('AUTH0_DOMAIN環境変数が設定されていません');
  }

  const response = await fetch(`https://${auth0Domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_M2M_CLIENT_ID,
      client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
      audience: `https://${auth0Domain}/api/v2/`,
      grant_type: 'client_credentials'
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Auth0トークン取得失敗: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * ユーザー重複チェック（Auth0 & DB）
 */
async function checkUserExists(token: string, email: string, backendUrl: string): Promise<void> {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  if (!auth0Domain) {
    throw new Error('AUTH0_DOMAIN環境変数が設定されていません');
  }

  // Auth0での重複チェック
  const auth0Response = await fetch(`https://${auth0Domain}/api/v2/users-by-email?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!auth0Response.ok) {
    throw new Error(`Auth0ユーザー検索失敗: ${auth0Response.statusText}`);
  }

  const auth0Users = await auth0Response.json();
  if (auth0Users.length > 0) {
    throw new Error('このメールアドレスは既にAuth0に登録されています');
  }

  // DBでの重複チェック
  try {
    const dbResponse = await fetch(`${backendUrl}/admin/user/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (dbResponse.ok) {
      const dbResult = await dbResponse.json();
      if (dbResult.exists) {
        throw new Error('このメールアドレスは既にデータベースに登録されています');
      }
    }
  } catch (error) {
    console.warn('DB重複チェック中にエラーが発生しました:', error);
    // DBチェックエラーは警告のみ（Auth0チェックが通っていれば続行）
  }
}

/**
 * Auth0ユーザー作成
 */
async function createAuth0User(token: string, email: string, connection: string): Promise<any> {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  if (!auth0Domain) {
    throw new Error('AUTH0_DOMAIN環境変数が設定されていません');
  }

  // 一時的なパスワードを生成（ユーザーはPassword Change Ticketで設定）
  const tempPassword = generateTempPassword();

  const response = await fetch(`https://${auth0Domain}/api/v2/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password: tempPassword,
      connection,
      email_verified: false,
      verify_email: false
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Auth0ユーザー作成失敗: ${error}`);
  }

  return await response.json();
}

/**
 * 一時パスワード生成
 */
function generateTempPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * DBユーザー作成
 */
async function createDbUser(backendUrl: string, userData: any): Promise<any> {
  const response = await fetch(`${backendUrl}/admin/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DBユーザー作成失敗: ${error}`);
  }

  return await response.json();
}

/**
 * Authentication APIでパスワードリセットメール送信
 */
async function sendPasswordResetEmail(email: string, connection: string): Promise<void> {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_M2M_CLIENT_ID;
  
  if (!auth0Domain || !clientId) {
    throw new Error('AUTH0_DOMAIN または AUTH0_M2M_CLIENT_ID 環境変数が設定されていません');
  }

  const response = await fetch(`https://${auth0Domain}/dbconnections/change_password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      connection,
      client_id: clientId
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`パスワードリセットメール送信失敗: ${error}`);
  }
}

/**
 * Auth0ユーザー削除
 */
async function deleteAuth0User(token: string, userId: string): Promise<void> {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  if (!auth0Domain) {
    throw new Error('AUTH0_DOMAIN環境変数が設定されていません');
  }

  const response = await fetch(`https://${auth0Domain}/api/v2/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Auth0ユーザー削除失敗: ${error}`);
  }
} 