//src/libs/auth0.ts
import { Auth0Client } from "@auth0/nextjs-auth0/server";

// 必要な環境変数の確認
const requiredEnvVars = {
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
};

// 環境変数の検証
const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

if (missingVars.length > 0) {
    console.error('Missing Auth0 environment variables:', missingVars);
}

// AUTH0_BASE_URLは開発環境では省略可能（SDKが自動推測）
if (!process.env.AUTH0_BASE_URL && process.env.NODE_ENV === 'production') {
    console.warn('AUTH0_BASE_URL is not set. This may cause issues in production.');
}

export const auth0 = new Auth0Client({
    authorizationParameters: {
        audience: process.env.AUTH0_AUDIENCE || 'https://api.local.dev',
        scope: 'openid profile email'
    }
});