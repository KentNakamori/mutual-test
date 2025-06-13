import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      console.log('[USER_EXISTS] No session or user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[USER_EXISTS] Session user:', {
      sub: session.user.sub,
      email: session.user.email,
      name: session.user.name
    });

    // アクセストークンを正しく取得
    let accessToken: string | undefined;
    try {
      const tokenResponse = await auth0.getAccessToken();
      if (tokenResponse && typeof tokenResponse.token === 'string') {
        accessToken = tokenResponse.token;
      }
    } catch (error) {
      console.error('[USER_EXISTS] Failed to get access token:', error);
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 401 });
    }

    if (!accessToken) {
      console.error('[USER_EXISTS] No access token available');
      return NextResponse.json({ error: 'No access token available' }, { status: 401 });
    }

    // プロキシ経由でバックエンドAPIを呼び出し（エンドポイント修正）
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:8000';
    const apiUrl = `${backendUrl}/investor/users/exists`;
    
    console.log('[USER_EXISTS] Calling backend API:', apiUrl);
    console.log('[USER_EXISTS] Access token length:', accessToken.length);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[USER_EXISTS] Backend response status:', response.status);
    console.log('[USER_EXISTS] Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[USER_EXISTS] Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[USER_EXISTS] Backend response data:', data);
    
    // バックエンドが返すパターンに対応
    // パターン1: {"exists": false, "message": "初回ログインです。ユーザー情報を登録してください"}
    // パターン2: {"exists": true, "message": "ユーザーが存在します"}
    if (data && typeof data.exists === 'boolean') {
      console.log('[USER_EXISTS] Backend returned exists:', data.exists, 'message:', data.message);
      return NextResponse.json({
        exists: data.exists,
        message: data.message,
        user: data.exists ? data.user || null : null
      });
    }
    
    // フォールバック: データが期待される形式でない場合
    console.log('[USER_EXISTS] Unexpected response format - returning exists: false');
    return NextResponse.json({ exists: false, message: 'Unexpected response format' });
    
  } catch (error) {
    console.error('[USER_EXISTS] User existence check failed:', error);
    // エラー時は存在しないものとして扱う（安全側に倒す）
    console.log('[USER_EXISTS] Error occurred - returning exists: false');
    return NextResponse.json({ exists: false });
  }
} 