// app/api/auth/investor-login/route.ts
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export const GET = async () => {
  const session = await auth0.getSession();

  // ログイン済みで投資家ユーザーの場合は直接企業一覧にリダイレクト
  if (session?.user) {
    const userRole = session.user['https://salt2.dev/role'];
    if (userRole === 'investor') {
      return NextResponse.redirect(new URL('/investor/companies', process.env.APP_BASE_URL || 'http://localhost:3000'));
    }
  }

  // 未ログインまたは投資家ユーザー以外の場合は通常のログインフロー
  const qs = new URLSearchParams({
    connection: 'Investor-DB',
    audience: process.env.AUTH0_AUDIENCE ?? '',
    returnTo: '/investor/companies',
  });

  return NextResponse.redirect(
    new URL(`/auth/login?${qs.toString()}`, process.env.APP_BASE_URL || 'http://localhost:3000')
  );
};
