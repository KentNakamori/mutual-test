// app/api/shows/route.ts
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export const GET = async () => {
  try {
    const session = await auth0.getSession();
   
    const { token: accessToken } = await auth0.getAccessToken();
    console.log('[debug] send token =>', accessToken);   // ★開発時だけ
    await fetch('http://localhost:8000/api/shows', {
        headers: { Authorization: `Bearer ${accessToken}` }
    }); //kokomade
    const base = process.env.API_BASE_URL ?? 'http://localhost:8000';
    // 絶対 URL を組み立てる
    const apiURL = `${base.replace(/\/$/, '')}/api/shows`;
    console.log('[shows] apiURL =', apiURL);
    const res = await fetch(apiURL, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log('[shows] upstream status =', res.status);
    
    if (!res.ok) {
    // FastAPI が 4xx/5xx を返した場合はそのまま転送
    return NextResponse.json(await res.json(), { status: res.status });
    }
     // ⑤ 正常レスポンスを返す
     return NextResponse.json(await res.json(), { status: res.status });
    } catch (e) {
      console.error('[shows] fetch threw >>>', e);
      throw e;   // 500
    }
  };
