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
 *  └─ FastAPI /admin/company/register へプロキシして企業を登録
 *     バックエンド: app/routers/admin/company.py の register エンドポイント
 *     リクエスト: CompanyCreateRequest（企業名、業界、ロゴURL、証券コード等）
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
    
    const resp = await fetch(`${backendUrl}/admin/companies/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('企業登録エラー:', errorText);
      return NextResponse.json(
        { error: errorText || '企業登録に失敗しました' }, 
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('企業登録エラー:', error);
    return NextResponse.json(
      { error: '企業登録に失敗しました' }, 
      { status: 500 }
    );
  }
}
