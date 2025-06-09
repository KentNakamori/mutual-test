import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function DELETE(request: NextRequest) {
  try {
    // Auth0セッションからユーザー情報を取得
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'ログインが必要です。' },
        { status: 401 }
      );
    }

    const user = session.user;
    const userId = user.sub;

    if (!userId) {
      return NextResponse.json(
        { message: 'ユーザーIDが取得できません。' },
        { status: 400 }
      );
    }

    // Auth0のアクセストークンを取得
    let accessToken: string | undefined;
    try {
      const tokenResponse = await auth0.getAccessToken();
      if (tokenResponse && typeof tokenResponse.token === 'string') {
        accessToken = tokenResponse.token;
        console.log('Access token obtained successfully');
      }
    } catch (tokenError) {
      console.error('Failed to get access token:', tokenError);
      // アクセストークンが取得できない場合でも処理を続行
    }

    // バックエンドURL設定
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:8000';
    console.log('Backend URL:', backendUrl);

    // まず、バックエンドから投資家ユーザーデータを削除
    if (accessToken) {
      try {
        const backendResponse = await fetch(`${backendUrl}/investor/users/me`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!backendResponse.ok) {
          const errorText = await backendResponse.text();
          console.error('Backend user deletion failed:', errorText);
          // バックエンドでの削除に失敗してもAuth0の削除は続行
        } else {
          console.log('Backend user deletion successful');
        }
      } catch (backendError) {
        console.error('Backend deletion error:', backendError);
        // バックエンドでの削除に失敗してもAuth0の削除は続行
      }
    } else {
      console.warn('No access token available for backend deletion');
    }

    // Auth0のManagement APIアクセストークンを取得
    const auth0IssuerUrl = process.env.AUTH0_ISSUER_BASE_URL;
    const auth0Domain = auth0IssuerUrl?.replace('https://', '').replace(/\/$/, '');
    const clientId = process.env.AUTH0_M2M_CLIENT_ID;
    const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;

    console.log('Auth0 Issuer URL:', auth0IssuerUrl);
    console.log('Auth0 Domain:', auth0Domain);
    console.log('M2M Client ID:', clientId ? 'Set' : 'Not set');
    console.log('M2M Client Secret:', clientSecret ? 'Set' : 'Not set');

    if (!auth0Domain || !clientId || !clientSecret) {
      console.error('Auth0 configuration missing');
      return NextResponse.json(
        { message: 'サーバー設定エラーです。Auth0の設定を確認してください。' },
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
      const errorText = await tokenResponse.text();
      console.error('Failed to get Management API token:', errorText);
      return NextResponse.json(
        { message: 'Auth0 Management APIトークンの取得に失敗しました。' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const managementAccessToken = tokenData.access_token;

    // Auth0からユーザーを削除
    const deleteResponse = await fetch(`https://${auth0Domain}/api/v2/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${managementAccessToken}`,
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
      } catch (e) {
        // JSON解析に失敗した場合はデフォルトメッセージを使用
      }

      return NextResponse.json(
        { message: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Account deletion API error:', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました。' },
      { status: 500 }
    );
  }
} 