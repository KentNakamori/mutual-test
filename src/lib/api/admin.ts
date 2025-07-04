/**
 * 管理者向けAPI
 */

/**
 * 企業登録API（APIルーター経由版）
 * APIルーター経由でバックエンドのPOST /admin/companies/registerを呼び出し
 * 
 * 入力:
 * - formData: FormData containing company information and logo file
 * 
 * 出力:
 * - companyId: 登録された企業のID
 * - message: 登録完了メッセージ
 */
export async function registerCompany(formData: FormData): Promise<{
  companyId: string;
  message: string;
}> {
  console.log('🔄 registerCompany関数呼び出し');
  console.log('📍 APIルーター呼び出し予定: /api/admin/companies');

  try {
    const response = await fetch('/api/admin/companies', {
      method: 'POST',
      body: formData
    });

    console.log('📡 APIルーターレスポンス:', {
      status: response.status,
      ok: response.ok,
      url: response.url
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ APIルーターエラー:', errorData);
      throw new Error(errorData.error || '企業登録に失敗しました');
    }

    const result = await response.json();
    console.log('✅ APIルーター成功:', result);
    return result;
  } catch (error) {
    console.error('❌ registerCompany関数エラー:', error);
    throw error;
  }
}

/**
 * 企業一覧取得API
 * APIルーター経由でバックエンドから取得
 * 
 * 出力:
 * - 企業一覧の配列（{companyId, companyName}形式）
 */
export async function getCompanies(): Promise<Array<{
  companyId: string;
  companyName: string;
}>> {
  try {
    const response = await fetch('/api/admin/companies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '企業一覧の取得に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('企業一覧取得エラー:', error);
    throw error;
  }
}

/**
 * 企業ユーザー登録API（Auth0統合版）
 * APIルーター経由でAuth0統合処理を実行
 * 
 * 入力:
 * - companyId: 企業ID
 * - email: ユーザーのメールアドレス
 * 
 * 出力:
 * - message: 登録完了メッセージ
 */
export async function registerUser(companyId: string, email: string): Promise<{
  message: string;
}> {
  // バリデーション
  if (!companyId || !email) {
    throw new Error('企業IDとメールアドレスは必須です');
  }

  console.log('🔄 registerUser関数呼び出し:', { companyId, email });
  console.log('📍 APIルーター呼び出し予定: /api/admin/users');

  try {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyId,
        email
      })
    });

    console.log('📡 APIルーターレスポンス:', {
      status: response.status,
      ok: response.ok,
      url: response.url
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ APIルーターエラー:', errorData);
      throw new Error(errorData.error || 'ユーザー登録に失敗しました');
    }

    const result = await response.json();
    console.log('✅ APIルーター成功:', result);
    return result;
  } catch (error) {
    console.error('❌ registerUser関数エラー:', error);
    throw error;
  }
} 