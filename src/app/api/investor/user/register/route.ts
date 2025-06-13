import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import { InvestorRegistrationData } from '@/types';

export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData: InvestorRegistrationData = await request.json();
    
    // バリデーション
    if (!userData.investor_type) {
      return NextResponse.json({ error: '投資家種別は必須です' }, { status: 400 });
    }

    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      return NextResponse.json({ error: '有効なメールアドレスを入力してください' }, { status: 400 });
    }

    // 投資家種別を日本語に変換
    const investorTypeMap: Record<string, string> = {
      'institutional': '機関投資家',
      'individual': '個人投資家',
      'analyst': 'アナリスト',
      'other': 'その他',
    };

    // 資産規模を日本語に変換
    const assetScaleMap: Record<string, string> = {
      'under_5m': '500万円未満',
      '5m_to_10m': '500万～1000万円',
      '10m_to_30m': '1000万～3000万円',
      'over_30m': '3000万円以上',
      'other': 'その他',
    };

    // バックエンドAPIに送信するデータを準備
    const registrationData = {
      email: userData.email, // フロントエンドから送られてきたemailをそのまま使用
      display_name: userData.display_name || null,
      investor_type: investorTypeMap[userData.investor_type] || userData.investor_type,
      asset_scale: userData.asset_scale ? assetScaleMap[userData.asset_scale] : 'その他',
      bio: userData.bio || null,
    };

    // アクセストークンを正しく取得
    let accessToken: string | undefined;
    try {
      const tokenResponse = await auth0.getAccessToken();
      if (tokenResponse && typeof tokenResponse.token === 'string') {
        accessToken = tokenResponse.token;
      }
    } catch (error) {
      console.error('[API] Failed to get access token:', error);
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 401 });
    }

    if (!accessToken) {
      console.error('[API] No access token available');
      return NextResponse.json({ error: 'No access token available' }, { status: 401 });
    }

    // プロキシ経由でバックエンドAPIを呼び出し（エンドポイント修正）
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:8000';
    const apiUrl = `${backendUrl}/investor/users/register`;
    
    console.log('[USER_REGISTER] Calling backend API:', apiUrl);
    console.log('[USER_REGISTER] Registration data:', registrationData);
    console.log('[USER_REGISTER] Access token length:', accessToken.length);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    console.log('[USER_REGISTER] Backend response status:', response.status);
    console.log('[USER_REGISTER] Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[USER_REGISTER] Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      const errorData = JSON.parse(errorText || '{}').catch(() => ({}));
      throw new Error(errorData.message || `Backend API error: ${response.status} - ${errorText}`);
    }

    const newUser = await response.json();
    console.log('[USER_REGISTER] Registration successful:', newUser);
    return NextResponse.json({ user: newUser });
    
  } catch (error) {
    console.error('User registration failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ユーザー登録に失敗しました' },
      { status: 500 }
    );
  }
} 