declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH0_SECRET: string;
      AUTH0_BASE_URL: string;
      AUTH0_ISSUER_BASE_URL: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      AUTH0_SCOPE: string;
      
      // Auth0 Machine to Machine 設定
      AUTH0_M2M_CLIENT_ID: string;
      AUTH0_M2M_CLIENT_SECRET: string;
      AUTH0_CONNECTION_NAME: string;
      
      // その他の環境変数
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_ENVIRONMENT: string;
      POSTGRES_URL: string;
      POSTGRES_PRISMA_URL: string;
      POSTGRES_URL_NO_SSL: string;
      POSTGRES_URL_NON_POOLING: string;
      POSTGRES_USER: string;
      POSTGRES_HOST: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DATABASE: string;
      DATABASE_URL: string;
      
      // AWS環境変数
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
      AWS_REGION?: string;
    }
  }
}

declare module '@auth0/nextjs-auth0' {
  interface UserProfile {
    // 標準のUserProfileプロパティ
    nickname?: string;
    name?: string;
    picture?: string;
    updated_at?: string;
    email?: string;
    email_verified?: boolean;
    sub: string;
    
    // カスタムプロパティ
    'mutual-test/role'?: string;
    'mutual-test/company_id'?: string;
    'mutual-test/permissions'?: string[];
  }
  
  interface Session {
    user: UserProfile;
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
  }
}

export {}; 