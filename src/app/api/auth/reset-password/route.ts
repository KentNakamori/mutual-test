import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'メールアドレスが必要です。' },
        { status: 400 }
      );
    }

    // Auth0のパスワードリセットAPIを呼び出し
    const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');
    const clientId = process.env.AUTH0_CLIENT_ID;

    if (!auth0Domain || !clientId) {
      console.error('Auth0 configuration missing');
      return NextResponse.json(
        { message: 'サーバー設定エラーです。' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://${auth0Domain}/dbconnections/change_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        email: email,
        connection: 'Username-Password-Authentication', // デフォルトのDB接続名
      }),
    });

    if (response.ok) {
      return NextResponse.json({
        message: 'パスワードリセットメールを送信しました。',
        success: true,
      });
    } else {
      const errorText = await response.text();
      console.error('Auth0 password reset error:', errorText);
      
      // Auth0からのエラーレスポンスを解析
      let errorMessage = 'パスワードリセットの送信に失敗しました。';
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error_description) {
          errorMessage = errorData.error_description;
        }
      } catch (_e) {
        // JSON解析に失敗した場合はデフォルトメッセージを使用
      }

      return NextResponse.json(
        { message: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Password reset API error:', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました。' },
      { status: 500 }
    );
  }
} 