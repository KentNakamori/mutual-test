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
      '/investor/onboarding',  // 投資家初回オンボーディングページ
      '/admin/login',  // 管理者ログインページは公開
      '/corporate/login', // 企業ログインページは公開
      '/unauthorized', // 権限エラーページは公開
    ];

    // 公開ルートかどうかをチェック（完全一致または特定のパスで始まる場合）
    const isPublicRoute = publicRoutes.some(route => {
      // 完全一致の場合
      if (req.nextUrl.pathname === route) {
        console.log('[MIDDLEWARE] Exact match for public route:', route);
        return true;
      }
      
      // ルートパス "/" の特別処理（完全一致のみ）
      if (route === '/') {
        return false; // 完全一致は上で処理済みなので、ここではfalse
      }
      
      // 特定のパスで始まる場合（ただし、/admin と /admin/login を区別）
      if (route === '/admin/login' || route === '/corporate/login') {
        const isMatch = req.nextUrl.pathname === route;
        console.log(`[MIDDLEWARE] Login route check: ${route} === ${req.nextUrl.pathname} = ${isMatch}`);
        return isMatch;
      }
      
      // その他のルートはstartsWithでチェック
      const startsWithMatch = req.nextUrl.pathname.startsWith(route);
      if (startsWithMatch) {
        console.log('[MIDDLEWARE] StartsWith match for public route:', route);
      }
      return startsWithMatch;
    });

    console.log('[MIDDLEWARE] Is public route:', isPublicRoute);

    if (isPublicRoute) {
      console.log('[MIDDLEWARE] Allowing access to public route');
      
      // 投資家関連の公開ルートで認証済みユーザーのDB確認を行う
      if (req.nextUrl.pathname.startsWith('/investor/') && 
          !req.nextUrl.pathname.startsWith('/investor/login') &&
          !req.nextUrl.pathname.startsWith('/investor/onboarding')) {
        console.log('[MIDDLEWARE] Public investor route - checking if user needs onboarding');
        return await handleInvestorOnboardingCheck(req, authRes);
      }
      
      return authRes;
    }

    // ③ 管理者ルートの認証チェック
    if (req.nextUrl.pathname.startsWith('/admin')) {
      return await handleAdminRouteAuth(req, authRes);
    }

    // ④ 企業ルートの認証チェック
    if (req.nextUrl.pathname.startsWith('/corporate')) {
      console.log('[MIDDLEWARE] Corporate route detected, checking auth');
      return await handleCorporateRouteAuth(req, authRes);
    }

    // ⑤ 投資家ルートの認証チェック
    if (req.nextUrl.pathname.startsWith('/investor')) {
      console.log('[MIDDLEWARE] Investor route detected, checking auth');
      return await handleInvestorRouteAuth(req, authRes);
    }

    // ⑥ その他の認証が必要なルート（ミドルウェアでの強制リダイレクトは削除）
    // ページ側でGuestRestrictedContentを表示するため、ここでは通過させる
    
    // ⑦ 正常ならページ/API へ続行
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

/**
 * 投資家ルートの認証チェック
 */
async function handleInvestorRouteAuth(req: NextRequest, authRes: NextResponse): Promise<NextResponse> {
  try {
    console.log('[MIDDLEWARE] Getting Auth0 session for investor route');
    // Auth0セッションを取得
    const session = await auth0.getSession();
    
    // セッションが存在しない場合は投資家ログインページにリダイレクト
    if (!session?.user) {
      console.log('[MIDDLEWARE] No session found for investor route, redirecting to investor login');
      return NextResponse.redirect(new URL('/investor/login', req.url));
    }

    console.log('[MIDDLEWARE] Session found, user:', session.user.email);

    // 投資家ユーザーのDB存在確認
    console.log('[MIDDLEWARE] Checking if investor exists in database');
    try {
      const baseUrl = req.nextUrl.origin;
      const checkResponse = await fetch(`${baseUrl}/api/investor/user/exists`, {
        method: 'GET',
        headers: {
          'Cookie': req.headers.get('cookie') || '',
        },
      });

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        console.log('[MIDDLEWARE] User exists check result:', checkData);
        
        if (!checkData.exists) {
          console.log('[MIDDLEWARE] Investor not found in database, redirecting to onboarding');
          // DBに存在しない場合は情報入力画面にリダイレクト
          return NextResponse.redirect(new URL('/investor/onboarding', req.url));
        }
        
        console.log('[MIDDLEWARE] Investor exists in database, allowing access');
      } else {
        console.warn('[MIDDLEWARE] Failed to check user existence, allowing access');
      }
    } catch (dbError) {
      console.error('[MIDDLEWARE] Error checking user existence:', dbError);
      // DB確認エラーの場合は通常のアクセスを許可（安全側に倒す）
    }

    // 投資家の場合は通常のレスポンスを返す
    console.log('[MIDDLEWARE] Investor access granted for:', req.nextUrl.pathname);
    return authRes;

  } catch (error) {
    console.error('[MIDDLEWARE] Error checking investor auth:', error);
    // エラーが発生した場合は投資家ログインページにリダイレクト
    return NextResponse.redirect(new URL('/investor/login', req.url));
  }
}

/**
 * 公開投資家ルートでの認証済みユーザーオンボーディング確認
 */
async function handleInvestorOnboardingCheck(req: NextRequest, authRes: NextResponse): Promise<NextResponse> {
  try {
    console.log('[MIDDLEWARE] Checking if authenticated user needs onboarding');
    // Auth0セッションを取得
    const session = await auth0.getSession();
    
    // セッションが存在しない場合はゲストとして通常のアクセスを許可
    if (!session?.user) {
      console.log('[MIDDLEWARE] No session found - allowing guest access');
      return authRes;
    }

    console.log('[MIDDLEWARE] Authenticated user found:', session.user.email);

    // 認証済みユーザーのDB存在確認
    console.log('[MIDDLEWARE] Checking if authenticated investor exists in database');
    try {
      const baseUrl = req.nextUrl.origin;
      const checkResponse = await fetch(`${baseUrl}/api/investor/user/exists`, {
        method: 'GET',
        headers: {
          'Cookie': req.headers.get('cookie') || '',
        },
      });

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        console.log('[MIDDLEWARE] Authenticated user exists check result:', checkData);
        
        if (!checkData.exists) {
          console.log('[MIDDLEWARE] Authenticated investor not found in database, redirecting to onboarding');
          // DBに存在しない場合は情報入力画面にリダイレクト
          return NextResponse.redirect(new URL('/investor/onboarding', req.url));
        }
        
        console.log('[MIDDLEWARE] Authenticated investor exists in database, allowing access');
      } else {
        console.warn('[MIDDLEWARE] Failed to check authenticated user existence, allowing access');
      }
    } catch (dbError) {
      console.error('[MIDDLEWARE] Error checking authenticated user existence:', dbError);
      // DB確認エラーの場合は通常のアクセスを許可（安全側に倒す）
    }

    // 認証済みユーザーで問題なければ通常のアクセスを許可
    console.log('[MIDDLEWARE] Authenticated investor access granted for:', req.nextUrl.pathname);
    return authRes;

  } catch (error) {
    console.error('[MIDDLEWARE] Error checking authenticated user onboarding:', error);
    // エラーが発生した場合は通常のアクセスを許可（安全側に倒す）
    return authRes;
  }
}

export const config = {
  matcher: [
    // 静的ファイル・画像・API などを除外
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)',
  ],
};