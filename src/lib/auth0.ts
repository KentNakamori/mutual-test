//src/libs/auth0.ts
import { Auth0Client } from "@auth0/nextjs-auth0/server";

// ビルド時には環境変数チェックをスキップ
const isBuildTime = typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !process.env.AUTH0_SECRET;

if (!isBuildTime) {
  // 実行時のみ環境変数をチェック
  const requiredEnvVars = {
      AUTH0_SECRET: process.env.AUTH0_SECRET,
      AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  };

  const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

  if (missingVars.length > 0) {
      console.error('Missing Auth0 environment variables:', missingVars);
  }

  if (!process.env.AUTH0_BASE_URL && process.env.NODE_ENV === 'production') {
      console.warn('AUTH0_BASE_URL is not set. This may cause issues in production.');
  }
}

// ビルド時は最小限の設定、実行時は正常な設定
export const auth0 = new Auth0Client(
    isBuildTime 
    ? {
        // ビルド時用の最小設定（イメージに埋め込まれない）
        domain: process.env.AUTH0_DOMAIN || 'placeholder.auth0.com',
        clientId: process.env.AUTH0_CLIENT_ID || 'placeholder',
        secret: process.env.AUTH0_SECRET || 'build-time-placeholder-32-chars-long',
        appBaseUrl: process.env.AUTH0_BASE_URL || 'http://localhost:3000'
    }
    : {
        // 実行時は通常の設定
        authorizationParameters: {
            audience: process.env.AUTH0_AUDIENCE || 'https://api.local.dev',
            scope: 'openid profile email'
        }
    }
);