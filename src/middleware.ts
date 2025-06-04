// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function middleware(req: NextRequest) {
  try {
    // ① Auth0 Edge ミドルウェアを先に実行（Cookie → req.auth）
    const authRes = await auth0.middleware(req);

    // ② 公開ルート（ゲストアクセス可能）
    const publicRoutes = [
      '/auth',
      '/',
      '/about',
      '/investor/companies',
      '/investor/company',
      '/investor/qa',
      '/investor/login',
    ];

    // 公開ルートかどうかをチェック
    const isPublicRoute = publicRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    );

    if (isPublicRoute) {
      return authRes;
    }

    // ③ 認証が必要なルート（ミドルウェアでの強制リダイレクトは削除）
    // ページ側でGuestRestrictedContentを表示するため、ここでは通過させる
    
    // ④ 正常ならページ/API へ続行
    return authRes;
  } catch (error) {
    // JWE復号化エラーなどAuth0関連エラーのハンドリング
    console.error('Auth0 middleware error:', error);
    
    // 既存のセッションクッキーを削除してリセット
    const response = NextResponse.redirect(new URL('/auth/login', req.url));
    response.cookies.delete('appSession');
    response.cookies.delete('appSession.0');
    response.cookies.delete('appSession.1');
    
    return response;
  }
}

export const config = {
  matcher: [
    // 静的ファイル・画像・API などを除外
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)',
  ],
};
