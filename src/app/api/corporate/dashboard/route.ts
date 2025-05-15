// app/api/corporate/dashboard/route.ts
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export const GET = async (req: Request) => {
  const { token: accessToken } = await auth0.getAccessToken(); // ← 修正
  // あるいは const accessToken = await auth0.getAccessToken();

  const url = `${process.env.API_BASE_URL}/api/corporate/dashboard?${req.url.split('?')[1] ?? ''}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  return NextResponse.json(await res.json(), { status: res.status });
};
