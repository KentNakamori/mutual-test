import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { corporateLogin, investorLogin, getCorporateCompanySettings } from "@/libs/api";

// types/next-auth.d.tsで型拡張を定義

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.userType) {
          return null;
        }
        
        try {
          let response;
          
          // ユーザータイプに応じた認証処理
          if (credentials.userType === "corporate") {
            response = await corporateLogin({
              email: credentials.email,
              password: credentials.password,
            });
          } else if (credentials.userType === "investor") {
            response = await investorLogin({
              email: credentials.email,
              password: credentials.password,
            });
          } else {
            throw new Error("Invalid user type");
          }
          
          if (response && response.accessToken) {
            return {
              id: response.userId,
              name: credentials.email,
              email: credentials.email,
              role: response.role,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            };
          }
          
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 初回サインイン時にユーザー情報をtokenに追加
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        
        // 企業ユーザーの場合は企業情報を取得
        if (user.role === 'corporate') {
          try {
            const companyInfo = await getCorporateCompanySettings(user.accessToken);
            token.companyInfo = companyInfo;
          } catch (error) {
            console.error('企業情報の取得に失敗しました:', error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにユーザー情報を追加
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.companyInfo = token.companyInfo;
      }
      return session;
    },
  },
  pages: {
    signIn: "/corporate/login",
    error: "/corporate/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24時間
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-value",
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 