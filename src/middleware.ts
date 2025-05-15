// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function middleware(req: NextRequest) {
  // ① Auth0 Edge ミドルウェアを先に実行（Cookie → req.auth）
  const authRes = await auth0.middleware(req);

  // ② 公開または認証ルートはそのまま返す
  if (req.nextUrl.pathname.startsWith('/auth') ||
      req.nextUrl.pathname === '/') {
    return authRes;
  }

  // ③ それ以外はセッションを必須に
  const session = await auth0.getSession();
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // ④ 正常ならページ/API へ続行
  return authRes;
}

export const config = {
  matcher: [
    // 静的ファイル・画像・API などを除外
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)',
  ],
};
