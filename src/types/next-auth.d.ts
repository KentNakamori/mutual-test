import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';
import { CompanyInfo } from './index';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      accessToken: string;
      companyInfo?: CompanyInfo;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
    accessToken: string;
    refreshToken: string;
    companyInfo?: CompanyInfo;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    companyInfo?: CompanyInfo;
  }
} 