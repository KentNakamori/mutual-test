import { NextRequest, NextResponse } from 'next/server';

/**
 * 企業一覧取得API
 * GET /api/admin/companies
 */
export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.API_BASE_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { error: 'API_BASE_URL環境変数が設定されていません' },
        { status: 500 }
      );
    }

    // バックエンドの /admin/users/companies エンドポイントを呼び出し
    const response = await fetch(`${backendUrl}/admin/users/companies`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('バックエンドエラー:', errorText);
      return NextResponse.json(
        { error: errorText || '企業一覧の取得に失敗しました' },
        { status: response.status }
      );
    }

    const companies = await response.json();
    
    // バックエンドのレスポンス形式 [{id, name}] を
    // フロントエンドが期待する形式 [{companyId, companyName}] に変換
    const formattedCompanies = companies.map((company: any) => ({
      companyId: company.id || company.companyId || '',
      companyName: company.name || company.companyName || ''
    }));

    return NextResponse.json(formattedCompanies);

  } catch (error) {
    console.error('企業一覧取得エラー:', error);
    return NextResponse.json(
      { error: '企業一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
} 