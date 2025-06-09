import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'メールアドレスが必要です' },
        { status: 400 }
      );
    }

    // 必要な環境変数の確認
    const auth0Domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    // 投資家用のConnectionをハードコード
    const connection = 'Investor-DB';

    if (!auth0Domain || !clientId) {
      console.error('Missing Auth0 environment variables');
      return NextResponse.json(
        { message: 'サーバー設定エラーです' },
        { status: 500 }
      );
    }

    console.log(`Attempting password reset for email: ${email} using connection: ${connection}`);

    // Auth0のAuthentication APIを使用してパスワードリセットメールを送信
    // Management APIではなく、Authentication APIを使用する方が簡単
    const resetResponse = await fetch(`https://${auth0Domain}/dbconnections/change_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        connection: connection,
        client_id: clientId,
      }),
    });

    if (!resetResponse.ok) {
      const errorText = await resetResponse.text();
      console.error('Auth0 password reset error:', errorText);
      
      // Auth0のエラーレスポンスを解析
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error === 'user_not_found') {
          return NextResponse.json(
            { message: 'このメールアドレスは投資家として登録されていません' },
            { status: 404 }
          );
        }
      } catch (e) {
        // JSON解析に失敗した場合は一般的なエラーメッセージ
      }
      
      return NextResponse.json(
        { message: 'パスワードリセットの送信に失敗しました' },
        { status: 500 }
      );
    }

    console.log('Password reset email sent successfully for:', email);

    return NextResponse.json({
      message: 'パスワードリセットメールを送信しました',
      success: true,
    });

  } catch (error) {
    console.error('Password reset API error:', error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 