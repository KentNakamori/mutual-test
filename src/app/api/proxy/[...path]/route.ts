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

async function handler(
    req: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const targetPath = path.join('/');
    const search = req.url.split('?')[1] ?? '';
    const targetBaseUrl = process.env.API_BASE_URL || 'http://localhost:8000';
    const targetUrl = `${targetBaseUrl}/${targetPath}${search ? `?${search}` : ''}`;

    // ゲストアクセス可能かチェック
    const isGuestAccessible = GUEST_ACCESSIBLE_ENDPOINTS.some(endpoint => 
        targetPath.startsWith(endpoint)
    );

    let accessToken: string | undefined;
    let isGuest = false;
    
    try {
        const tokenResponse = await auth0.getAccessToken();
        if (tokenResponse && typeof tokenResponse.token === 'string') {
            accessToken = tokenResponse.token;
        }
    } catch (error) {
        if (isGuestAccessible) {
            isGuest = true;
        }
    }
    
    // トークンもなく、ゲストアクセス不可能なエンドポイントの場合は認証エラー
    if (!accessToken && !isGuest) {
        return NextResponse.json(
            { error: 'Authentication required', message: 'このエンドポイントにはログインが必要です' }, 
            { status: 401 }
        );
    }

    const headers: HeadersInit = {};
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    } else if (isGuest) {
        headers['X-Guest-Access'] = 'true';
    }
    
    const contentType = req.headers.get('Content-Type');
    if (contentType && !contentType.includes('multipart/form-data')) {
        headers['Content-Type'] = contentType;
    }
    if (req.headers.has('Accept')) {
        headers['Accept'] = req.headers.get('Accept')!;
    }

    let body: BodyInit | null | undefined = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        const contentType = req.headers.get('Content-Type');
        
        if (contentType && contentType.includes('application/json')) {
            try {
                const textBody = await req.text();
                body = textBody === "" ? undefined : textBody;
            } catch (e) {
                body = req.body;
            }
        } else if (contentType && contentType.includes('multipart/form-data')) {
            try {
                const formData = await req.formData();
                body = formData;
            } catch (e) {
                body = req.body;
            }
        } else {
            body = req.body;
        }
    }
    
    try {
        const res = await fetch(targetUrl, {
            method: req.method,
            headers: headers,
            body: body,
            // @ts-expect-error - duplex property is not typed in RequestInit but supported in Node.js
            duplex: (req.method !== 'GET' && req.method !== 'HEAD') ? 'half' : undefined,
        });

        const responseHeaders = new Headers(res.headers);
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('transfer-encoding');
        responseHeaders.delete('content-length');

        const responseContentType = res.headers.get('Content-Type');

        // Server-Sent Events の処理
        if (responseContentType && responseContentType.includes('text/event-stream')) {
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
                            controller.enqueue(value);
                        }
                    } catch (error) {
                        controller.error(error);
                    } finally {
                        controller.close();
                    }
                }
            });

            responseHeaders.set('Content-Type', 'text/event-stream');
            responseHeaders.set('Cache-Control', 'no-cache');
            responseHeaders.set('Connection', 'keep-alive');
            responseHeaders.set('X-Accel-Buffering', 'no');

            return new Response(stream, {
                status: res.status,
                headers: responseHeaders,
            });
        }

        if (res.status === 204) {
            return new NextResponse(null, { status: res.status, headers: responseHeaders });
        }

        if (responseContentType && responseContentType.includes('application/json')) {
            const responseData = await res.json();
            return new NextResponse(JSON.stringify(responseData), { status: res.status, headers: responseHeaders });
        } else if (responseContentType && responseContentType.startsWith('text/')) {
            const responseData = await res.text();
            return new NextResponse(responseData, { status: res.status, headers: responseHeaders });
        } else {
            return new NextResponse(res.body, { status: res.status, headers: responseHeaders });
        }

    } catch (error: any) {
        return NextResponse.json({ message: 'Proxy error', error: error.message }, { status: 502 });
    }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;