/**
 * Auth0認証APIルート
 * - ログイン処理のハンドリング
 * - 認証パラメータの設定
 * - リダイレクト先の制御
 */
// src/app/api/auth/[...auth0]/route.ts
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const runtime = 'edge';

// GET／POST 両方とも同じハンドラーに委譲
export const GET = handleAuth({
  // login のオーバーライドにプロバイダー関数を渡す
  login: handleLogin(async (req, res) => {
    const { searchParams } = new URL(req.url);
    const conn     = searchParams.get('conn') || undefined;
    const returnTo = searchParams.get('returnTo') || '/';
    return {
      // ログイン後のリダイレクト先
      returnTo: `${process.env.AUTH0_BASE_URL}${returnTo}`,
      // 認証リクエストに含めるパラメータ
      authorizationParams: {
        audience:   process.env.AUTH0_AUDIENCE,
        connection: conn,
        scope:      'openid profile email'
      }
    };
  })
});
export const POST = GET;
