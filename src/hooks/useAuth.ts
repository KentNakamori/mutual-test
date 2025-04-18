// hooks/useAuth.ts
import { signIn, signOut, useSession } from 'next-auth/react';
import { CompanyInfo } from '@/types';

/**
 * NextAuthのセッション情報を使いやすい形で提供するカスタムフック
 * 既存のuseAuthフックの代替として、NextAuth統合版
 */
export const useAuth = () => {
  const { data: session, status } = useSession();

  // ログイン処理
  const login = async (email: string, password: string, userType: 'investor' | 'corporate') => {
    const result = await signIn('credentials', {
      email,
      password,
      userType,
      redirect: false,
    });
    
    return result?.ok || false;
  };

  // ログアウト処理
  const logout = async () => {
    await signOut({ redirect: false });
  };

  // 企業情報を更新する処理
  // 注: NextAuthでは企業情報の更新はセッションの更新が必要
  const updateCompanyInfo = (companyInfo: CompanyInfo) => {
    console.warn('NextAuth使用時はセッション更新が必要です。この関数は互換性のために残されています。');
  };

  // トークンの有効性確認
  const isTokenValid = () => {
    return !!session?.user?.accessToken;
  };

  // 既存コードとの互換性のために状態を作成
  const state = {
    isAuthenticated: status === 'authenticated',
    token: session?.user?.accessToken || null,
    userType: session?.user?.role as 'investor' | 'corporate' | null,
    userId: session?.user?.id || null,
    companyInfo: session?.user?.companyInfo || null,
    tokenExpiry: null, // NextAuthではJWT有効期限を自動管理
  };

  return {
    ...state,
    login,
    logout,
    updateCompanyInfo,
    isTokenValid,
    sessionStatus: status,
  };
};
