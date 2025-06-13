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
 *     リクエスト: CompanyCreateRequest（企業詳細情報）
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
    const body = await req.json();
    
    // 必須フィールドのバリデーション
    const requiredFields = ['companyName', 'industry'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field}は必須項目です` }, 
          { status: 400 }
        );
      }
    }

    // 企業登録データの構造化
    const companyData = {
      companyName: body.companyName,
      securitiesCode: body.securitiesCode || null,
      establishedDate: body.establishedDate || null, // YYYY-MM形式
      listingDate: body.listingDate || null, // YYYY-MM-DD形式
      marketSegment: body.marketSegment || null, // 東証プライム、東証スタンダード等
      address: body.address || null,
      phone: body.phone || null,
      ceo: body.ceo || null,
      industry: body.industry, // 必須
      businessDescription: body.businessDescription || null,
      capital: body.capital || null, // 資本金
      employeeCount: body.employeeCount || null,
      websiteUrl: body.websiteUrl || null,
      contactEmail: body.contactEmail || null,
      logoUrl: body.logoUrl || null,
      // createdAt, updatedAtはバックエンドで自動設定
    };

    console.log('企業登録データ:', JSON.stringify(companyData, null, 2));
    
    const resp = await fetch(`${backendUrl}/admin/companies/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
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
