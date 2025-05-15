
// app/api/auth/investor-login/route.ts
import { NextResponse } from 'next/server';

export const GET = () => {
  const qs = new URLSearchParams({
    connection: 'Investor-DB',
    audience: process.env.AUTH0_AUDIENCE ?? '',
    returnTo:  '/investor/companies',
  });
  // APP_BASE_URL は .env に必須
  return NextResponse.redirect(
    new URL(`/auth/login?${qs.toString()}`, process.env.APP_BASE_URL!)
  );
};
