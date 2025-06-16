import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/companies
 *  └─ FastAPI /admin/user/companies へプロキシして企業一覧を返す
 *     バックエンド: app/routers/admin/user.py の get_companies
 *     期待レスポンス: [{ id: string, name: string }]
 */
export async function GET(_req: NextRequest) {
  const backendUrl = process.env.API_BASE_URL; 

  if (!backendUrl) {
    console.error('API_BASE_URL環境変数が設定されていません');
    return NextResponse.json(
      { error: 'API_BASE_URL環境変数が設定されていません' }, 
      { status: 500 }
    );
  }

  try {
    const resp = await fetch(`${backendUrl}/admin/users/companies`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
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
 * POST /api/admin/companies
 *  └─ FastAPI /admin/companies/register へプロキシして企業を登録
 *     バックエンド: app/routers/admin/company.py の register エンドポイント
 *     リクエスト: multipart/form-data（企業詳細情報 + ロゴファイル）
 *     レスポンス: CompanyCreateResponse（企業ID、メッセージ）
 */
export async function POST(req: NextRequest) {
  const backendUrl = process.env.API_BASE_URL;

  if (!backendUrl) {
    console.error('API_BASE_URL環境変数が設定されていません');
    return NextResponse.json(
      { error: 'API_BASE_URL環境変数が設定されていません' }, 
      { status: 500 }
    );
  }

  try {
    // FormDataとして受け取る
    const formData = await req.formData();
    
    // 必須フィールドのバリデーション
    const companyName = formData.get('companyName') as string;
    const industry = formData.get('industry') as string;
    
    if (!companyName) {
      return NextResponse.json(
        { error: 'companyNameは必須項目です' }, 
        { status: 400 }
      );
    }
    
    if (!industry) {
      return NextResponse.json(
        { error: 'industryは必須項目です' }, 
        { status: 400 }
      );
    }

    // バックエンドに送信するFormDataを作成
    const backendFormData = new FormData();
    
    // 各フィールドをFormDataに追加
    backendFormData.append('companyName', companyName);
    if (industry) backendFormData.append('industry', industry);
    
    const securitiesCode = formData.get('securitiesCode') as string;
    if (securitiesCode) backendFormData.append('securitiesCode', securitiesCode);
    
    const establishedDate = formData.get('establishedDate') as string;
    if (establishedDate) backendFormData.append('establishedDate', establishedDate);
    
    const marketSegment = formData.get('marketSegment') as string;
    if (marketSegment) backendFormData.append('marketSegment', marketSegment);
    
    const address = formData.get('address') as string;
    if (address) backendFormData.append('address', address);
    
    const phone = formData.get('phone') as string;
    if (phone) backendFormData.append('phone', phone);
    
    const ceo = formData.get('ceo') as string;
    if (ceo) backendFormData.append('ceo', ceo);
    
    const businessDescription = formData.get('businessDescription') as string;
    if (businessDescription) backendFormData.append('businessDescription', businessDescription);
    
    const capital = formData.get('capital') as string;
    if (capital) backendFormData.append('capital', capital);
    
    const employeeCount = formData.get('employeeCount') as string;
    if (employeeCount) backendFormData.append('employeeCount', employeeCount);
    
    const websiteUrl = formData.get('websiteUrl') as string;
    if (websiteUrl) backendFormData.append('websiteUrl', websiteUrl);
    
    const contactEmail = formData.get('contactEmail') as string;
    if (contactEmail) backendFormData.append('contactEmail', contactEmail);
    
    // ロゴファイルがある場合は追加
    const logoFile = formData.get('logo') as File;
    if (logoFile && logoFile.size > 0) {
      backendFormData.append('logo', logoFile);
    }

    console.log('企業登録データ送信:', {
      companyName,
      industry,
      hasLogo: !!(logoFile && logoFile.size > 0)
    });
    
    const resp = await fetch(`${backendUrl}/admin/companies/register`, {
      method: "POST",
      body: backendFormData, // FormDataとして送信（Content-Typeは自動設定）
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('企業登録エラー:', errorText);
      
      // エラーメッセージの詳細化
      let errorMessage = '企業登録に失敗しました';
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        // JSON解析に失敗した場合はそのままのテキストを使用
        errorMessage = errorText || errorMessage;
      }
      
      return NextResponse.json(
        { error: errorMessage }, 
        { status: resp.status }
      );
    }

    const data = await resp.json();
    console.log('企業登録成功:', data);
    
    return NextResponse.json({
      message: '企業が正常に登録されました',
      companyId: data.companyId || data.company_id || data.id,
      ...data
    }, { status: 201 });
    
  } catch (error) {
    console.error('企業登録エラー:', error);
    return NextResponse.json(
      { error: '企業登録処理中にエラーが発生しました' }, 
      { status: 500 }
    );
  }
}
