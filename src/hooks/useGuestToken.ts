import { useState, useEffect } from 'react';

interface GuestToken {
  accessToken: string;
  expiresAt: number;
}

/**
 * ゲストトークン管理フック
 * - ゲストユーザーの認証トークン管理
 * - ローカルストレージを使用したトークン永続化
 * - トークンの有効期限管理
 */
export const useGuestToken = () => {
  const [token, setToken] = useState<GuestToken | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('guestToken');
    const storedExpiry = localStorage.getItem('guestTokenExpiry');
    
    if (storedToken && storedExpiry) {
      setToken({
        accessToken: storedToken,
        expiresAt: parseInt(storedExpiry, 10)
      });
    }
  }, []);

  const login = async (agreeToTerms: boolean) => {
    try {
      const response = await fetch('/api/auth/guest-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agreeToTerms }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const guestToken: GuestToken = {
          accessToken: data.token.accessToken,
          expiresAt: data.token.expiresAt
        };
        
        localStorage.setItem('guestToken', guestToken.accessToken);
        localStorage.setItem('guestTokenExpiry', guestToken.expiresAt.toString());
        setToken(guestToken);
        
        return { success: true };
      }
      
      return { success: false, error: data.error || 'ゲストログインに失敗しました' };
    } catch (error) {
      console.error('Guest login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'ゲストログインエラーが発生しました' };
    }
  };

  const logout = () => {
    localStorage.removeItem('guestToken');
    localStorage.removeItem('guestTokenExpiry');
    setToken(null);
    return { success: true };
  };

  const isTokenValid = () => {
    if (!token) return false;
    const now = Math.floor(Date.now() / 1000);
    return token.expiresAt > now;
  };

  return {
    token,
    login,
    logout,
    isTokenValid
  };
}; 