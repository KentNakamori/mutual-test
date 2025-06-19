// app/api/auth/corporate-login/route.ts
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export const GET = async () => {
  const session = await auth0.getSession();

  // ログイン済みで企業ユーザーの場合は直接ダッシュボードにリダイレクト
  if (session?.user) {
    // IDトークンからカスタムクレームを取得
    let userRoles = session.user['https://salt2.dev/roles'];
    
    // IDトークンが存在する場合、デコードしてカスタムクレームを取得
    if (session.tokenSet?.idToken) {
      try {
        // IDトークンをデコード（Base64デコード）
        const tokenParts = session.tokenSet.idToken.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('[CORPORATE-LOGIN] ID Token payload:', payload);
        
        // カスタムクレームを取得
        userRoles = payload['https://salt2.dev/roles'];
        console.log('[CORPORATE-LOGIN] Custom claim roles from ID token:', userRoles);
      } catch (decodeError) {
        console.error('[CORPORATE-LOGIN] Failed to decode ID token:', decodeError);
      }
    }
    
    console.log('[CORPORATE-LOGIN] Final user roles:', userRoles);
    console.log('[CORPORATE-LOGIN] User email:', session.user.email);
    console.log('[CORPORATE-LOGIN] User sub:', session.user.sub);
    
    // 企業権限チェック（配列の場合は最初の要素をチェック）
    const finalRole = Array.isArray(userRoles) ? userRoles[0] : userRoles;
    if (finalRole === 'corporate') {
      console.log('[CORPORATE-LOGIN] Corporate role confirmed, redirecting to dashboard');
      return NextResponse.redirect(new URL('/corporate/dashboard', process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL || 'http://localhost:3000'));
    } else {
      console.log('[CORPORATE-LOGIN] User role is not corporate:', finalRole);
    }
  }

  // 未ログインまたは企業ユーザー以外の場合は通常のログインフロー
  const qs = new URLSearchParams({
    connection: 'Corporate-DB',
    audience: process.env.AUTH0_AUDIENCE ?? '',
    returnTo: '/corporate/dashboard',
  });

  return NextResponse.redirect(
    new URL(`/auth/login?${qs.toString()}`, process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL || 'http://localhost:3000')
  );
};
