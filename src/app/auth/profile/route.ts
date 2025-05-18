import { NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/config/auth';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    // 認証モックモードかどうかを環境変数から確認
    const authMock = process.env.NEXT_PUBLIC_AUTH_MOCK === 'true';
    
    // 認証モックモードの場合は常にモックユーザーを返す
    if (authMock) {
      console.log('[MOCK AUTH] 認証モックモードが有効: モックユーザーデータを返します');
      return NextResponse.json({
        sub: 'mock-user-123',
        email: 'test@example.com',
        name: 'テストユーザー',
        picture: 'https://via.placeholder.com/150',
        userType: 'corporate', // または 'investor'
        isAuthenticated: true
      });
    }

    // 通常の認証モード（実際の認証処理を実行）
    console.log('[REAL AUTH] 実際の認証処理を実行します');
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ 
        isAuthenticated: false,
        error: 'Not authenticated' 
      }, { status: 401 });
    }

    return NextResponse.json({
      ...session.user,
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Profile API error:', error);
    // エラー時でも認証モックモードが有効ならモックデータを返す
    if (process.env.NEXT_PUBLIC_AUTH_MOCK === 'true') {
      console.warn('[MOCK AUTH] 認証エラーですが、モックユーザーデータを返します');
      return NextResponse.json({
        sub: 'mock-user-error',
        email: 'error@example.com',
        name: 'エラー時ユーザー',
        picture: 'https://via.placeholder.com/150',
        userType: 'corporate',
        isAuthenticated: true
      });
    }
    
    // 認証モックモードが無効ならエラーを返す
    return NextResponse.json({ 
      isAuthenticated: false,
      error: 'Failed to get profile' 
    }, { status: 500 });
  }
} 