// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useEffect, useState, useCallback } from "react";
import { getMyProfile, login, logout, guestLogin } from "@/libs/api";
import { UserProfileResponse } from "@/types/api";
import { Nullable } from "@/types/utilities";

interface AuthContextValue {
  user: Nullable<UserProfileResponse>;    // ログイン中のユーザー情報
  token: string | null;                  // アクセストークン (JWT等)
  isLoading: boolean;                    // ユーザー情報取得中フラグ
  isAuthenticated: boolean;              // ログインしているかどうか
  handleLogin: (email: string, password: string) => Promise<void>;
  handleGuestLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>; // 再取得など
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  handleLogin: async () => {},
  handleGuestLogin: async () => {},
  handleLogout: async () => {},
  fetchUserProfile: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Nullable<UserProfileResponse>>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // -----------------------
  // アプリ起動時 or ページリロード時にLocalStorageからトークン復元
  // -----------------------
  useEffect(() => {
    const savedToken = window.localStorage.getItem("accessToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // -----------------------
  // トークンが設定されたら user情報取得
  // -----------------------
  useEffect(() => {
    if (token) {
      fetchUserProfile().catch((err) => {
        console.error("Failed to fetch user profile:", err);
        // トークン無効などでエラー → ログアウト処理など
      });
    } else {
      setUser(null);
    }
  }, [token]);

  // -----------------------
  // ユーザー情報取得 API
  // -----------------------
  const fetchUserProfile = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const profile = await getMyProfile();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // -----------------------
  // ログイン処理
  // -----------------------
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const res = await login({ email, password });
        // tokenをステートとLocalStorageへ保存
        setToken(res.token);
        window.localStorage.setItem("accessToken", res.token);

        // ログイン後にユーザープロフィール取得
        await fetchUserProfile();
      } catch (error) {
        console.error("Login error:", error);
        throw error; // 呼び出し元でエラーハンドリング
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserProfile]
  );

  // -----------------------
  // ゲストログイン処理 (例)
  // -----------------------
  const handleGuestLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await guestLogin({ agreeTerms: true });
      setToken(res.guestToken);
      window.localStorage.setItem("accessToken", res.guestToken);

      // ゲストの場合、プロフィールが無いケースがあるが、必要ならfetchUserProfile()を呼ぶ
    } catch (error) {
      console.error("Guest login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // -----------------------
  // ログアウト処理
  // -----------------------
  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      // リフレッシュトークンを持っているなら送るなど
      await logout("dummyRefreshToken"); // API仕様に合わせる
    } catch (error) {
      // 失敗してもフロント側は強制的にクリアする場合あり
      console.warn("Logout API error, but clearing local states anyway");
    }
    // キャッシュやLocalStorageをクリア
    window.localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);

    setIsLoading(false);
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    handleLogin,
    handleGuestLogin,
    handleLogout,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
