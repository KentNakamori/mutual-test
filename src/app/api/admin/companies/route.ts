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

/**
 * 企業登録API
 * POST /api/admin/companies
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 企業登録開始');

    const backendUrl = process.env.API_BASE_URL;
    if (!backendUrl) {
      console.log('❌ 環境変数不足: API_BASE_URL');
      return NextResponse.json(
        { error: 'API_BASE_URL環境変数が設定されていません' },
        { status: 500 }
      );
    }
    console.log('✅ 環境変数チェック完了');
    console.log('📡 バックエンドURL:', backendUrl);

    // FormDataを取得
    const formData = await request.formData();
    console.log('📤 受信したFormDataのキー:', Array.from(formData.keys()));

    // バックエンドにFormDataをそのまま転送
    const response = await fetch(`${backendUrl}/admin/companies/register`, {
      method: 'POST',
      body: formData
    });

    console.log('📡 バックエンドレスポンス状況:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ バックエンドエラー詳細:', error);
      throw new Error(`企業登録失敗: ${error}`);
    }

    const result = await response.json();
    console.log('✅ バックエンド成功レスポンス:', result);
    console.log('🎉 企業登録処理完了');

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ 企業登録エラー:', error);
    
    // エラーメッセージの詳細化
    let errorMessage = '企業登録に失敗しました';
    if (error instanceof Error) {
      if (error.message.includes('already exists') || error.message.includes('既に登録されています')) {
        errorMessage = 'この企業は既に登録されています';
      } else if (error.message.includes('invalid') || error.message.includes('不正')) {
        errorMessage = '入力内容に不正な値が含まれています';
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