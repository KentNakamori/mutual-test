// app/api/auth/corporate-login/route.ts
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export const GET = async () => {
  const session = await auth0.getSession();

  // ログイン済みで企業ユーザーの場合は直接ダッシュボードにリダイレクト
  if (session?.user) {
    const userRole = session.user['https://salt2.dev/role'];
    if (userRole === 'corporate') {
      return NextResponse.redirect(new URL('/corporate/dashboard', process.env.APP_BASE_URL || 'http://localhost:3000'));
    }
  }

  // 未ログインまたは企業ユーザー以外の場合は通常のログインフロー
  const qs = new URLSearchParams({
    connection: 'Corporate-DB',
    audience: process.env.AUTH0_AUDIENCE ?? '',
    returnTo: '/corporate/dashboard',
  });

  return NextResponse.redirect(
    new URL(`/auth/login?${qs.toString()}`, process.env.APP_BASE_URL || 'http://localhost:3000')
  );
};
