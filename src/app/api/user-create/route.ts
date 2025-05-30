import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.json(); // { companyId, email, fullName }

  const resp = await fetch(`${process.env.BACKEND_URL}/companies/${payload.companyId}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await resp.json();
  return NextResponse.json(data, { status: resp.status });
}
