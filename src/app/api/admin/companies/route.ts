import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/companies
 *  └─ FastAPI /admin/companies へプロキシして会社一覧を返す
 *     バックエンド: app/routers/admin/company.py
 *     期待レスポンス: [{ companyId: string, companyName: string }]
 */
export async function GET(_req: NextRequest) {
  const backendUrl = process.env.API_BASE_URL; 

  try {
    const resp = await fetch(`${backendUrl}/admin/companies`, {
      // FastAPI が同一オリジンなら認証 Cookie も forward したい場合 credentials を付与
      // credentials: 'include',
      next: { revalidate: 30 },  // ISR: 30 秒まではキャッシュ
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: text }, { status: resp.status });
    }

    const data = await resp.json(); // バックエンドからの企業データ
    
    // 管理者用の企業ユーザー招待で必要な形式に変換
    const companies = data.map((company: any) => ({
      companyId: company.companyId || company.id?.toString() || '',
      companyName: company.companyName || company.name || '',
    }));

    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error('企業一覧取得エラー:', error);
    return NextResponse.json(
      { error: '企業一覧の取得に失敗しました' }, 
      { status: 500 }
    );
  }
}

/**
 * POST /api/companies
 *  └─ FastAPI /admin/company/register へプロキシして企業を登録
 *     バックエンド: app/routers/admin/company.py の /register エンドポイント
 */
export async function POST(req: NextRequest) {
  const backendUrl = process.env.API_BASE_URL;

  try {
    const body = await req.json();
    
    const resp = await fetch(`${backendUrl}/admin/company/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
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
