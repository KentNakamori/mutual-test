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
      '/admin/login',  // 管理者ログインページは公開
      '/corporate/login', // 企業ログインページは公開
      '/unauthorized', // 権限エラーページは公開
    ];

    // 公開ルートかどうかをチェック
    const isPublicRoute = publicRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    );

    if (isPublicRoute) {
      return authRes;
    }

    // ③ 管理者ルートの認証チェック
    if (req.nextUrl.pathname.startsWith('/admin')) {
      return await handleAdminRouteAuth(req, authRes);
    }

    // ④ 企業ルートの認証チェック
    if (req.nextUrl.pathname.startsWith('/corporate')) {
      return await handleCorporateRouteAuth(req, authRes);
    }

    // ⑤ その他の認証が必要なルート（ミドルウェアでの強制リダイレクトは削除）
    // ページ側でGuestRestrictedContentを表示するため、ここでは通過させる
    
    // ⑥ 正常ならページ/API へ続行
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

/**
 * 管理者ルートの認証チェック
 */
async function handleAdminRouteAuth(req: NextRequest, authRes: NextResponse): Promise<NextResponse> {
  try {
    // Auth0セッションを取得
    const session = await auth0.getSession();
    
    // セッションが存在しない場合は管理者ログインページにリダイレクト
    if (!session?.user) {
      console.log('[MIDDLEWARE] No session found for admin route, redirecting to admin login');
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // カスタムクレームからroleを取得
    const userRole = session.user['https://salt2.dev/role'];
    
    // 管理者権限チェック
    if (userRole !== 'admin') {
      console.log('[MIDDLEWARE] User is not admin, redirecting to unauthorized');
      console.log('[MIDDLEWARE] User role:', userRole);
      console.log('[MIDDLEWARE] User email:', session.user.email);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // 管理者の場合は通常のレスポンスを返す
    console.log('[MIDDLEWARE] Admin access granted for:', req.nextUrl.pathname);
    console.log('[MIDDLEWARE] Admin user:', session.user.email);
    console.log('[MIDDLEWARE] User role:', userRole);
    return authRes;

  } catch (error) {
    console.error('[MIDDLEWARE] Error checking admin auth:', error);
    // エラーが発生した場合は管理者ログインページにリダイレクト
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}

/**
 * 企業ルートの認証チェック
 */
async function handleCorporateRouteAuth(req: NextRequest, authRes: NextResponse): Promise<NextResponse> {
  try {
    // Auth0セッションを取得
    const session = await auth0.getSession();
    
    // セッションが存在しない場合は企業ログインページにリダイレクト
    if (!session?.user) {
      console.log('[MIDDLEWARE] No session found for corporate route, redirecting to corporate login');
      return NextResponse.redirect(new URL('/corporate/login', req.url));
    }

    // カスタムクレームからroleを取得
    const userRole = session.user['https://salt2.dev/role'];
    
    // 企業権限チェック
    if (userRole !== 'corporate') {
      console.log('[MIDDLEWARE] User is not corporate, redirecting to corporate login');
      console.log('[MIDDLEWARE] User role:', userRole);
      console.log('[MIDDLEWARE] User email:', session.user.email);
      return NextResponse.redirect(new URL('/corporate/login', req.url));
    }

    // 企業ユーザーの場合は通常のレスポンスを返す
    console.log('[MIDDLEWARE] Corporate access granted for:', req.nextUrl.pathname);
    console.log('[MIDDLEWARE] Corporate user:', session.user.email);
    console.log('[MIDDLEWARE] User role:', userRole);
    return authRes;

  } catch (error) {
    console.error('[MIDDLEWARE] Error checking corporate auth:', error);
    // エラーが発生した場合は企業ログインページにリダイレクト
    return NextResponse.redirect(new URL('/corporate/login', req.url));
  }
}

export const config = {
  matcher: [
    // 静的ファイル・画像・API などを除外
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)',
  ],
};
