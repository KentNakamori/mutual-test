// app/api/proxy/[...path]/route.ts
import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

/**
 * すべての GET リクエストを FastAPI へそのままプロキシする
 *  - 取得した Access-Token を Authorization ヘッダーに付与
 *  - ゲストユーザーの場合は特別なヘッダーを追加
 *  - クエリストリングは透過
 *  - Server-Sent Events (SSE) のストリーミングに対応
 */

// ゲストアクセス可能なエンドポイント
const GUEST_ACCESSIBLE_ENDPOINTS = [
    'investor/companies',      // 企業一覧
    'investor/company',        // 企業詳細
    'investor/qa/search',      // Q&A検索
    'investor/qa/latest-by-company', // 最新Q&A
];

// 管理者認証が必要なエンドポイント
const ADMIN_REQUIRED_ENDPOINTS = [
    'admin/',                 // 管理者：すべてのadminエンドポイント
    'companies',              // 企業登録（管理者のみ）
];

async function handler(
    req: Request,
    { params }: { params: Promise<{ path: string[] }> } // paramsはPromiseに変更
) {
    const { path } = await params; // awaitを追加
    const targetPath = path.join('/');
    const search = req.url.split('?')[1] ?? '';
    // API_BASE_URL は process.env.API_BASE_URL または適切なものを使用
    const targetBaseUrl = process.env.API_BASE_URL || 'http://localhost:8000';
    const targetUrl = `${targetBaseUrl}/${targetPath}${search ? `?${search}` : ''}`;

    // ゲストアクセス可能かチェック
    const isGuestAccessible = GUEST_ACCESSIBLE_ENDPOINTS.some(endpoint => 
        targetPath.startsWith(endpoint)
    );

    // 管理者認証が必要かチェック
    const isAdminRequired = ADMIN_REQUIRED_ENDPOINTS.some(endpoint => 
        targetPath.startsWith(endpoint)
    );

    let accessToken: string | undefined;
    let isGuest = false;
    
    try {
        // アクセストークンの取得方法を元に戻す
        const tokenResponse = await auth0.getAccessToken();
        if (tokenResponse && typeof tokenResponse.token === 'string') {
            accessToken = tokenResponse.token;
        } else {
             console.warn('[PROXY] auth0.getAccessToken() did not return a valid token object or token string.');
        }
    } catch (error) {
        console.warn('[PROXY] Failed to get access token using auth0.getAccessToken():', error);
        
        // トークンがない場合、ゲストアクセス可能なエンドポイントならゲストとして扱う
        if (isGuestAccessible) {
            isGuest = true;
            console.log('[PROXY] Treating as guest user for accessible endpoint:', targetPath);
        }
    }
    
    // 管理者認証が必要なエンドポイントでトークンがない場合
    if (isAdminRequired && !accessToken) {
        console.log('[PROXY] Admin authentication required for endpoint:', targetPath);
        return NextResponse.json(
            { error: 'Admin authentication required', message: '管理者認証が必要です' }, 
            { status: 401 }
        );
    }
    
    // トークンもなく、ゲストアクセス不可能なエンドポイントの場合は認証エラー
    if (!accessToken && !isGuest) {
        console.log('[PROXY] Authentication required for endpoint:', targetPath);
        return NextResponse.json(
            { error: 'Authentication required', message: 'このエンドポイントにはログインが必要です' }, 
            { status: 401 }
        );
    }
    
    console.log(`[PROXY ${req.method}] Target URL:`, targetUrl);
    if (accessToken) {
        console.log(`[PROXY ${req.method}] Access Token:`, accessToken.substring(0, 20) + '...');
    } else if (isGuest) {
        console.log(`[PROXY ${req.method}] Guest user access`);
    }

    const headers: HeadersInit = {};
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    } else if (isGuest) {
        // ゲストユーザー識別用のヘッダーを追加
        headers['X-Guest-Access'] = 'true';
    }
    
    // クライアントからのContent-Typeを尊重する (FormDataなどのため)
    if (req.headers.has('Content-Type')) {
        headers['Content-Type'] = req.headers.get('Content-Type')!;
    }
    // SSEのためのAcceptヘッダーを転送
    if (req.headers.has('Accept')) {
        headers['Accept'] = req.headers.get('Accept')!;
    }

    let body: BodyInit | null | undefined = undefined;
    // GET や HEAD リクエストではボディを送信しない
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        // FormDataの場合、NextResponse.json()でパースしようとするとエラーになることがあるため、
        // req.blob() や req.formData() を使用して適切に扱う必要がある。
        // ここではシンプルに req.body を渡すが、Content-Type によっては調整が必要。
        // Content-Typeがapplication/jsonでない場合は、req.text()やreq.blob()などを試す。
        const contentType = req.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            try {
                const textBody = await req.text();
                body = textBody === "" ? undefined : textBody;
            } catch (e) {
                console.warn(`[PROXY ${req.method}] Could not parse JSON body, attempting to use raw body`, e);
                body = req.body; // パース失敗時は元のReadableStreamを試みる (限定的)
            }
        } else {
             // JSON以外（FormDataなど）の場合は、そのまま ReadableStream を渡す
             // 注意: Node.js の fetch では ReadableStream を直接 body に渡せるが、
             // 環境によっては blob() や formData() で変換が必要な場合がある。
             // Cloudflare Workersなどでは ReadableStream が使えるはず。
             // Next.js Edge Runtimeでも ReadableStream が使えるはず。
            body = req.body;
        }
    }
    
    try {
        const res = await fetch(targetUrl, {
            method: req.method,
            headers: headers, // 更新されたヘッダーを使用
            body: body,
            // duplex: 'half' を追加 (特にPOST/PUT/PATCHでリクエストボディがある場合)
            // Node.js v18.14.0以降またはEdge Runtimeで有効
            // @ts-ignore
            duplex: (req.method !== 'GET' && req.method !== 'HEAD') ? 'half' : undefined,
        });

        // レスポンスヘッダーも可能な限りプロキシする
        const responseHeaders = new Headers(res.headers);
        // セキュリティ上の理由や不要なヘッダーを削除または上書きすることも可能
        // responseHeaders.delete('x-powered-by');

        const responseContentType = res.headers.get('Content-Type');
        console.log(`[PROXY ${req.method}] Response Content-Type:`, responseContentType);

        // Server-Sent Events (text/event-stream) の場合は特別な処理
        if (responseContentType && responseContentType.includes('text/event-stream')) {
            console.log(`[PROXY ${req.method}] Handling SSE stream...`);
            
            // ストリーミングレスポンスを作成
            const stream = new ReadableStream({
                async start(controller) {
                    const reader = res.body?.getReader();
                    if (!reader) {
                        controller.close();
                        return;
                    }

                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            
                            // チャンクをそのまま転送
                            controller.enqueue(value);
                        }
                    } catch (error) {
                        console.error('[PROXY SSE] Streaming error:', error);
                        controller.error(error);
                    } finally {
                        controller.close();
                    }
                }
            });

            // 重要: text/event-stream のレスポンスヘッダーを設定
            responseHeaders.set('Content-Type', 'text/event-stream');
            responseHeaders.set('Cache-Control', 'no-cache');
            responseHeaders.set('Connection', 'keep-alive');
            responseHeaders.set('X-Accel-Buffering', 'no'); // Nginxなどでバッファリングを無効化

            return new Response(stream, {
                status: res.status,
                headers: responseHeaders,
            });
        }

        // 通常のレスポンス処理（既存のコード）
        if (res.status === 204) { // No Content の場合
            console.log(`[PROXY ${req.method}] Response Status: 204 No Content`);
            return new NextResponse(null, { status: res.status, headers: responseHeaders });
        }

        if (responseContentType && responseContentType.includes('application/json')) {
            const responseData = await res.json();
            console.log(`[PROXY ${req.method}] Response Status:`, res.status);
            console.log(`[PROXY ${req.method}] Response Body (JSON):`, JSON.stringify(responseData).substring(0, 200) + '...');
            return new NextResponse(JSON.stringify(responseData), { status: res.status, headers: responseHeaders });
        } else if (responseContentType && responseContentType.startsWith('text/')) {
            const responseData = await res.text();
            console.log(`[PROXY ${req.method}] Response Status:`, res.status);
            console.log(`[PROXY ${req.method}] Response Body (Text):`, responseData.substring(0, 200) + '...');
            return new NextResponse(responseData, { status: res.status, headers: responseHeaders });
        } else {
             // JSONでもテキストでもない場合 (例: 画像、ファイルダウンロード)
            console.log(`[PROXY ${req.method}] Response Status:`, res.status);
            console.log(`[PROXY ${req.method}] Response Content-Type:`, responseContentType);
            // res.body (ReadableStream) をそのまま返す
            return new NextResponse(res.body, { status: res.status, headers: responseHeaders });
        }

    } catch (error: any) {
        console.error(`[PROXY ${req.method}] Error forwarding request to ${targetUrl}:`, error);
        return NextResponse.json({ message: 'Proxy error', error: error.message }, { status: 502 }); // Bad Gateway
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
// 必要であれば OPTIONS, HEAD も追加
// export const OPTIONS = handler;
// export const HEAD = handler;
