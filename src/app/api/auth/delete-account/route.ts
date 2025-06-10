import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    // Cookieからセッション情報を取得
    const cookies = request.cookies;
    const sessionCookie = cookies.get('appSession');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'ログインが必要です。' },
        { status: 401 }
      );
    }

    // Auth0のユーザー情報APIを呼び出してユーザーIDを取得
    const userInfoResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
      headers: {
        'Authorization': request.headers.get('authorization') || '',
      },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.json(
        { message: 'ユーザー認証に失敗しました。' },
        { status: 401 }
      );
    }

    const userInfo = await userInfoResponse.json();
    const userId = userInfo.sub;

    if (!userId) {
      return NextResponse.json(
        { message: 'ユーザーIDが取得できません。' },
        { status: 400 }
      );
    }

    // Auth0のManagement APIアクセストークンを取得
    const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');
    const clientId = process.env.AUTH0_M2M_CLIENT_ID;
    const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;

    if (!auth0Domain || !clientId || !clientSecret) {
      console.error('Auth0 configuration missing');
      return NextResponse.json(
        { message: 'サーバー設定エラーです。' },
        { status: 500 }
      );
    }

    // Management APIアクセストークンを取得
    const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: `https://${auth0Domain}/api/v2/`,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to get Management API token');
      return NextResponse.json(
        { message: 'アクセストークンの取得に失敗しました。' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // ユーザーを削除
    const deleteResponse = await fetch(`https://${auth0Domain}/api/v2/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (deleteResponse.ok) {
      return NextResponse.json({
        message: 'アカウントが正常に削除されました。',
        success: true,
      });
    } else {
      const errorText = await deleteResponse.text();
      console.error('Auth0 user deletion error:', errorText);
      
      let errorMessage = 'アカウント削除に失敗しました。';
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (_e) {
        // JSON解析に失敗した場合はデフォルトメッセージを使用
      }

      return NextResponse.json(
        { message: errorMessage },
        { status: 400 }
      );
    }
  } catch (_e) {
    console.error('Account deletion API error:', _e);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました。' },
      { status: 500 }
    );
  }
} 