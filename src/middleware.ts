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
      '/investor/chat-logs',
      '/investor/mypage',
      '/investor/login',
      '/investor/onboarding',  // 投資家初回オンボーディングページ
      '/admin/login',  // 管理者ログインページは公開
      '/corporate/login',
      '/corporate/dashboard', // 企業ログインページは公開
      '/unauthorized', // 権限エラーページは公開
    ];

    // 公開ルートかどうかをチェック（完全一致または特定のパスで始まる場合）
    const isPublicRoute = publicRoutes.some(route => {
      // 完全一致の場合
      if (req.nextUrl.pathname === route) {
        return true;
      }
      
      // ルートパス "/" の特別処理（完全一致のみ）
      if (route === '/') {
        return false; // 完全一致は上で処理済みなので、ここではfalse
      }
      
      // 特定のパスで始まる場合（ただし、/admin と /admin/login を区別）
      if (route === '/admin/login' || route === '/corporate/login') {
        const isMatch = req.nextUrl.pathname === route;
        return isMatch;
      }
      
      // その他のルートはstartsWithでチェック
      const startsWithMatch = req.nextUrl.pathname.startsWith(route);
      if (startsWithMatch) {
      }
      return startsWithMatch;
    });

    if (isPublicRoute) {
      
      // 投資家関連の公開ルートで認証済みユーザーのDB確認を行う
      if (req.nextUrl.pathname.startsWith('/investor/') && 
          !req.nextUrl.pathname.startsWith('/investor/login') &&
          !req.nextUrl.pathname.startsWith('/investor/onboarding')) {
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
      return await handleCorporateRouteAuth(req, authRes);
    }

    // ⑤ 投資家ルートの認証チェック
    if (req.nextUrl.pathname.startsWith('/investor')) {
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
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // IDトークンからカスタムクレームを取得
    let userRoles = session.user['https://salt2.dev/roles'];
    
    // IDトークンが存在する場合、デコードしてカスタムクレームを取得
    if (session.tokenSet?.idToken) {
      try {
        // IDトークンをデコード（Base64デコード）
        const tokenParts = session.tokenSet.idToken.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('[MIDDLEWARE] Admin ID Token payload:', payload);
        
        // カスタムクレームを取得
        userRoles = payload['https://salt2.dev/roles'];
        console.log('[MIDDLEWARE] Admin custom claim roles from ID token:', userRoles);
      } catch (decodeError) {
        console.error('[MIDDLEWARE] Failed to decode admin ID token:', decodeError);
      }
    }
    
    console.log('[MIDDLEWARE] Final admin user roles:', userRoles);
    
    // 管理者権限チェック（配列の場合は最初の要素をチェック）
    const finalRole = Array.isArray(userRoles) ? userRoles[0] : userRoles;
    if (finalRole !== 'admin') {
      console.log('[MIDDLEWARE] User role is not admin:', finalRole);
      console.log('[MIDDLEWARE] User email:', session.user.email);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // 管理者の場合は通常のレスポンスを返す
    console.log('[MIDDLEWARE] Admin user confirmed, role:', finalRole);
    return authRes;

  } catch (error) {
    // エラーが発生した場合は管理者ログインページにリダイレクト
    console.error('[MIDDLEWARE] Error in admin route auth:', error);
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

    // IDトークンからカスタムクレームを取得
    let userRoles = session.user['https://salt2.dev/roles'];
    
    // IDトークンが存在する場合、デコードしてカスタムクレームを取得
    if (session.tokenSet?.idToken) {
      try {
        // IDトークンをデコード（Base64デコード）
        const tokenParts = session.tokenSet.idToken.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('[MIDDLEWARE] ID Token payload:', payload);
        
        // カスタムクレームを取得
        userRoles = payload['https://salt2.dev/roles'];
        console.log('[MIDDLEWARE] Custom claim roles from ID token:', userRoles);
      } catch (decodeError) {
        console.error('[MIDDLEWARE] Failed to decode ID token:', decodeError);
      }
    }
    
    console.log('[MIDDLEWARE] Final user roles:', userRoles);
    
    // 企業権限チェック（配列の場合は最初の要素をチェック）
    const finalRole = Array.isArray(userRoles) ? userRoles[0] : userRoles;
    if (finalRole !== 'corporate') {
      console.log('[MIDDLEWARE] User role is not corporate:', finalRole);
      return NextResponse.redirect(new URL('/corporate/login', req.url));
    }

    // 企業ユーザーの場合は通常のレスポンスを返す
    console.log('[MIDDLEWARE] Corporate user confirmed, role:', finalRole);
    return authRes;

  } catch (error) {
    // エラーが発生した場合は企業ログインページにリダイレクト
    console.error('[MIDDLEWARE] Error in corporate route auth:', error);
    return NextResponse.redirect(new URL('/corporate/login', req.url));
  }
}

/**
 * 投資家ルートの認証チェック
 */
async function handleInvestorRouteAuth(req: NextRequest, authRes: NextResponse): Promise<NextResponse> {
  try {
    // Auth0セッションを取得
    const session = await auth0.getSession();
    
    // セッションが存在しない場合は投資家ログインページにリダイレクト
    if (!session?.user) {
      return NextResponse.redirect(new URL('/investor/login', req.url));
    }

    // 投資家ユーザーのDB存在確認
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
        
        if (!checkData.exists) {
          // DBに存在しない場合は情報入力画面にリダイレクト
          return NextResponse.redirect(new URL('/investor/onboarding', req.url));
        }
        
      }
    } catch (dbError) {
      // DB確認エラーの場合は通常のアクセスを許可（安全側に倒す）
    }

    // 投資家の場合は通常のレスポンスを返す
    return authRes;

  } catch (error) {
    // エラーが発生した場合は投資家ログインページにリダイレクト
    return NextResponse.redirect(new URL('/investor/login', req.url));
  }
}

/**
 * 公開投資家ルートでの認証済みユーザーオンボーディング確認
 */
async function handleInvestorOnboardingCheck(req: NextRequest, authRes: NextResponse): Promise<NextResponse> {
  try {
    console.log('[MIDDLEWARE] handleInvestorOnboardingCheck called for:', req.nextUrl.pathname);
    
    // Auth0セッションを取得
    const session = await auth0.getSession();
    
    // セッションが存在しない場合はゲストとして通常のアクセスを許可
    if (!session?.user) {
      console.log('[MIDDLEWARE] No session found - allowing guest access');
      return authRes;
    }

    console.log('[MIDDLEWARE] Session found for user:', {
      sub: session.user.sub,
      email: session.user.email,
      name: session.user.name
    });

    // 認証済みユーザーのDB存在確認
    try {
      const baseUrl = req.nextUrl.origin;
      const checkUrl = `${baseUrl}/api/investor/user/exists`;
      
      console.log('[MIDDLEWARE] Checking user existence at:', checkUrl);
      
      const checkResponse = await fetch(checkUrl, {
        method: 'GET',
        headers: {
          'Cookie': req.headers.get('cookie') || '',
        },
      });

      console.log('[MIDDLEWARE] User exists check response status:', checkResponse.status);

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        console.log('[MIDDLEWARE] User exists check response data:', checkData);
        
        if (!checkData.exists) {
          // DBに存在しない場合は情報入力画面にリダイレクト
          console.log('[MIDDLEWARE] User does not exist in DB - redirecting to onboarding');
          return NextResponse.redirect(new URL('/investor/onboarding', req.url));
        }
        
        console.log('[MIDDLEWARE] User exists in DB - allowing access');
      } else {
        console.log('[MIDDLEWARE] User exists check failed with status:', checkResponse.status);
      }
    } catch (dbError) {
      // DB確認エラーの場合は通常のアクセスを許可（安全側に倒す）
      console.error('[MIDDLEWARE] DB check error:', dbError);
      console.log('[MIDDLEWARE] DB check error - allowing access (fail-safe)');
    }

    // 認証済みユーザーで問題なければ通常のアクセスを許可
    console.log('[MIDDLEWARE] Allowing access to authenticated user');
    return authRes;

  } catch (error) {
    // エラーが発生した場合は通常のアクセスを許可（安全側に倒す）
    console.error('[MIDDLEWARE] Error in investor onboarding check:', error);
    console.log('[MIDDLEWARE] Error occurred - allowing access (fail-safe)');
    return authRes;
  }
}

export const config = {
  matcher: [
    // 静的ファイル・画像・API などを除外
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api).*)',
  ],
};