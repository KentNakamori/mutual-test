import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export const GET = async () => {
  const session = await auth0.getSession();

  // ログイン済みで管理者ユーザーの場合は直接管理画面にリダイレクト
  if (session?.user) {
    // IDトークンからカスタムクレームを取得
    let userRoles = session.user['https://salt2.dev/roles'];
    
    // IDトークンが存在する場合、デコードしてカスタムクレームを取得
    if (session.tokenSet?.idToken) {
      try {
        // IDトークンをデコード（Base64デコード）
        const tokenParts = session.tokenSet.idToken.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('[ADMIN-LOGIN] ID Token payload:', payload);
        
        // カスタムクレームを取得
        userRoles = payload['https://salt2.dev/roles'];
        console.log('[ADMIN-LOGIN] Custom claim roles from ID token:', userRoles);
      } catch (decodeError) {
        console.error('[ADMIN-LOGIN] Failed to decode ID token:', decodeError);
      }
    }
    
    console.log('[ADMIN-LOGIN] Final user roles:', userRoles);
    console.log('[ADMIN-LOGIN] User email:', session.user.email);
    console.log('[ADMIN-LOGIN] User sub:', session.user.sub);
    
    // 管理者権限チェック（配列の場合は最初の要素をチェック）
    const finalRole = Array.isArray(userRoles) ? userRoles[0] : userRoles;
    if (finalRole === 'admin') {
      console.log('[ADMIN-LOGIN] Admin role confirmed, redirecting to admin dashboard');
      return NextResponse.redirect(new URL('/admin', process.env.APP_BASE_URL || 'http://localhost:3000'));
    } else {
      console.log('[ADMIN-LOGIN] User role is not admin:', finalRole);
    }
  }

  // 未ログインまたは管理者ユーザー以外の場合は通常のログインフロー
  const qs = new URLSearchParams({
    connection: 'Admin-DB',
    audience: process.env.AUTH0_AUDIENCE ?? '',
    returnTo: '/admin',
  });

  return NextResponse.redirect(
    new URL(`/auth/login?${qs.toString()}`, process.env.APP_BASE_URL || 'http://localhost:3000')
  );
}; 