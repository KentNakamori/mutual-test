
// src/app/api/auth/corporate-login/route.ts
import { handleLogin } from '@auth0/nextjs-auth0';
export const GET = handleLogin({
  returnTo: `${process.env.AUTH0_BASE_URL}/corporate/dashboard`,
  authorizationParams: {
    audience: process.env.AUTH0_AUDIENCE,
    connection: 'Corporate-DB',
    scope: 'openid profile email'
  }
});