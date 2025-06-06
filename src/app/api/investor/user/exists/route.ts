import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/investor/users/exists`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // ユーザーが存在しない場合
        return NextResponse.json({ exists: false });
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ exists: true, user: data });
    
  } catch (error) {
    console.error('User existence check failed:', error);
    // エラー時は存在しないものとして扱う（安全側に倒す）
    return NextResponse.json({ exists: false });
  }
} 