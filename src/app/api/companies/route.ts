import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/companies
 *  └─ FastAPI /companies へプロキシして会社一覧を返す
 *     期待レスポンス: [{ id: number, name: string }]
 */
export async function GET(_req: NextRequest) {
  const backendUrl = process.env.BACKEND_URL; // 例: https://api.example.com

  const resp = await fetch(`${backendUrl}/companies`, {
    // FastAPI が同一オリジンなら認証 Cookie も forward したい場合 credentials を付与
    // credentials: 'include',
    next: { revalidate: 30 },  // ISR: 30 秒まではキャッシュ
  });

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json({ error: text }, { status: resp.status });
  }

  const data = await resp.json(); // [{ id, name, ... }]
  // 必要最小限だけ返すなら map で name と id に絞る
  const slim = data.map((c: any) => ({ id: c.id, name: c.name }));

  return NextResponse.json(slim, { status: 200 });
}
