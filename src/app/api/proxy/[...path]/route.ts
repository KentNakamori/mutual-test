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
    { params }: { params: { path: string[] } }
  ) {
    // 1) 呼び出し先パスを生成
    const targetPath = params.path.join('/');
    const search     = req.url.split('?')[1] ?? '';  // クエリ透過
    const url        = `${process.env.API_BASE_URL}/${targetPath}${search ? `?${search}` : ''}`;

  // 2. Auth0 から JWT を取得
  const { token: accessToken } = await auth0.getAccessToken();

  // 3. FastAPI へフォワード
  const res = await fetch(url, {
    method: req.method,
    headers: { Authorization: `Bearer ${accessToken}` },
    body:    req.method === 'GET' ? undefined : req.body,
    // 必要なら req.headers も継承
  });

  // 4. 返却（Content-Type 等は FastAPI のヘッダーをそのまま流用）
  // 4) レスポンスをそのままフロントへ
  return NextResponse.json(await res.json(), { status: res.status });
}
