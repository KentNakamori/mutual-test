
// src/app/api/auth/investor-login/route.ts
import { handleLogin } from '@auth0/nextjs-auth0';
export const GET = handleLogin({
  returnTo: `${process.env.AUTH0_BASE_URL}/investor/companies`,
  authorizationParams: {
    audience: process.env.AUTH0_AUDIENCE,
    connection: 'Investor-DB',
    scope: 'openid profile email'
  }
});

