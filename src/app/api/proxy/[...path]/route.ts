// app/api/proxy/[...path]/route.ts
import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

/**
 * すべての GET リクエストを FastAPI へそのままプロキシする
 *  - 取得した Access-Token を Authorization ヘッダーに付与
 *  - クエリストリングは透過
 */

export async function GET(
    req: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const targetPath = path.join('/');
    const search = req.url.split('?')[1] ?? '';
    const targetUrl = `${process.env.API_BASE_URL}/${targetPath}${search ? `?${search}` : ''}`;

    // 2. Auth0 から JWT を取得
    const { token: accessToken } = await auth0.getAccessToken();

    console.log('[PROXY GET] Target URL:', targetUrl);
    console.log('[PROXY GET] Access Token:', accessToken ? accessToken.substring(0, 20) + '...' : 'No Token');

    // 3. FastAPI へフォワード
    const res = await fetch(targetUrl, {
        method: req.method,
        headers: { Authorization: `Bearer ${accessToken}` },
        body: req.method === 'GET' ? undefined : req.body
    });

    // 4. 返却（Content-Type 等は FastAPI のヘッダーをそのまま流用）
    const responseBody = await res.json();
    console.log('[PROXY GET] Response Status:', res.status);
    console.log('[PROXY GET] Response Body:', JSON.stringify(responseBody).substring(0, 200) + '...');
    return NextResponse.json(responseBody, { status: res.status });
}
