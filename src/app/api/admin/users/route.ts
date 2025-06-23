import { NextRequest, NextResponse } from 'next/server';

/**
 * ユーザー登録API（Auth0統合版）
 * POST /api/admin/users
 */
export async function POST(request: NextRequest) {
  try {
    const { companyId, email } = await request.json();
    console.log('🚀 ユーザー登録開始:', { companyId, email });

    // バリデーション
    if (!companyId || !email) {
      console.log('❌ バリデーション失敗: 必須フィールドが不足');
      return NextResponse.json(
        { error: '企業IDとメールアドレスは必須です' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.API_BASE_URL;

    // 環境変数チェック
    const requiredEnvVars = {
      API_BASE_URL: backendUrl,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      AUTH0_M2M_CLIENT_ID: process.env.AUTH0_M2M_CLIENT_ID,
      AUTH0_M2M_CLIENT_SECRET: process.env.AUTH0_M2M_CLIENT_SECRET,
      AUTH0_CONNECTION_NAME: process.env.AUTH0_DB_CONNECTION || 'Corporate-DB'
    };

    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        console.log(`❌ 環境変数不足: ${key}`);
        return NextResponse.json(
          { error: `${key}環境変数が設定されていません` },
          { status: 500 }
        );
      }
    }
    console.log('✅ 環境変数チェック完了');

    // 1. Auth0 Management APIアクセストークン取得
    console.log('🔑 Auth0 Management APIトークン取得開始');
    const managementToken = await getAuth0ManagementToken();
    console.log('✅ Auth0 Management APIトークン取得完了');

    // 2. 事前重複チェック（Auth0 & DB）
    console.log('🔍 ユーザー重複チェック開始');
    await checkUserExists(managementToken, email, backendUrl!);
    console.log('✅ ユーザー重複チェック完了');

    // 3. Auth0にユーザー作成
    console.log('👤 Auth0ユーザー作成開始');
    const auth0User = await createAuth0User(managementToken, email, requiredEnvVars.AUTH0_CONNECTION_NAME);
    console.log('✅ Auth0ユーザー作成完了:', { user_id: auth0User.user_id });

    // 4. DBにユーザー情報登録（Auth0UserIdを渡す）
    console.log('💾 DBユーザー作成開始');
    const dbUserData = {
      email,
      companyId: companyId,
      auth0_id: auth0User.user_id,
      isAdmin: false  // デフォルトで一般ユーザーとして登録
    };
    console.log('📤 DBに送信するデータ:', dbUserData);
    
    let dbUser;
    try {
      dbUser = await createDbUser(backendUrl!, dbUserData);
      console.log('✅ DBユーザー作成完了:', dbUser);
    } catch (dbError) {
      // DBユーザー作成失敗時はAuth0ユーザーを削除（ロールバック）
      console.error('❌ DBユーザー作成失敗、Auth0ユーザーを削除します:', dbError);
      try {
        await deleteAuth0User(managementToken, auth0User.user_id);
        console.log('✅ Auth0ユーザー削除完了（ロールバック）');
      } catch (deleteError) {
        console.error('❌ Auth0ユーザー削除失敗:', deleteError);
      }
      throw dbError;
    }

    // 5. Authentication APIでパスワードリセットメール送信
    console.log('📧 パスワードリセットメール送信開始');
    try {
      await sendPasswordResetEmail(email, requiredEnvVars.AUTH0_CONNECTION_NAME);
      console.log('✅ パスワードリセットメール送信完了');
    } catch (emailError) {
      console.warn('⚠️ パスワードリセットメール送信に失敗しました:', emailError);
      // メール送信失敗でもユーザー作成は成功とする
    }

    // 6. 成功レスポンス
    console.log('🎉 ユーザー登録処理完了');
    return NextResponse.json({
      message: 'ユーザーアカウントを作成し、パスワード設定メールを送信しました。ユーザーはメール内のリンクからパスワードを設定できます。'
    });

  } catch (error) {
    console.error('❌ ユーザー登録エラー:', error);
    
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
      { status: 400 }
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

  // DBでの重複チェック（FastAPIエンドポイント使用）
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
    } else {
      console.warn('DB重複チェックでエラーが発生しました:', dbResponse.statusText);
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
  console.log('📡 バックエンドURL:', backendUrl);
  console.log('📤 送信データ:', JSON.stringify(userData, null, 2));

  const response = await fetch(`${backendUrl}/admin/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  console.log('📡 バックエンドレスポンス状況:', {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ バックエンドエラー詳細:', error);
    throw new Error(`DBユーザー作成失敗: ${error}`);
  }

  const result = await response.json();
  console.log('✅ バックエンド成功レスポンス:', result);
  return result;
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