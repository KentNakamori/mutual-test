import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export const GET = async () => {
  const session = await auth0.getSession();

  // ログイン済みで管理者ユーザーの場合は直接管理画面にリダイレクト
  if (session?.user) {
    const userType = session.user['https://your-domain/userType'];
    if (userType === 'admin') {
      return NextResponse.redirect(new URL('/admin', process.env.APP_BASE_URL || 'http://localhost:3000'));
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