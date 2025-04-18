// contexts/AuthContext.tsx
"use client"
import React, { createContext, useReducer, ReactNode, useContext, useEffect } from 'react';
import CryptoJS from 'crypto-js';

// 暗号化キー（環境変数から取得することを推奨）
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secure-key';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userType: 'investor' | 'corporate' | null;
  userId: string | null;
  companyInfo: {
    companyName: string;
    address: string;
    email: string;
    tel: string;
  } | null;
  tokenExpiry: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  userType: null,
  userId: null,
  companyInfo: null,
  tokenExpiry: null,
};

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; userType: 'investor' | 'corporate'; userId: string; companyInfo?: AuthState['companyInfo']; expiry: number } }
  | { type: 'GUEST_LOGIN'; payload: { userId: string } }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: { token: string; expiry: number } }
  | { type: 'UPDATE_COMPANY_INFO'; payload: { companyInfo: AuthState['companyInfo'] } };

// セキュアなストレージ操作
const secureStorage = {
  setItem: (key: string, value: string) => {
    const encrypted = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
    localStorage.setItem(key, encrypted);
  },
  getItem: (key: string) => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.error('復号化エラー:', error);
      return null;
    }
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // トークンをセキュアに保存
      secureStorage.setItem('auth_token', action.payload.token);
      secureStorage.setItem('user_type', action.payload.userType);
      secureStorage.setItem('user_id', action.payload.userId);
      secureStorage.setItem('token_expiry', action.payload.expiry.toString());
      if (action.payload.companyInfo) {
        secureStorage.setItem('company_info', JSON.stringify(action.payload.companyInfo));
      }
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        userType: action.payload.userType,
        userId: action.payload.userId,
        companyInfo: action.payload.companyInfo || null,
        tokenExpiry: action.payload.expiry,
      };
    case 'GUEST_LOGIN':
      secureStorage.setItem('user_id', action.payload.userId);
      return {
        ...state,
        userId: action.payload.userId,
      };
    case 'LOGOUT':
      // 認証情報を完全に削除
      secureStorage.removeItem('auth_token');
      secureStorage.removeItem('user_type');
      secureStorage.removeItem('user_id');
      secureStorage.removeItem('company_info');
      secureStorage.removeItem('token_expiry');
      return initialState;
    case 'REFRESH_TOKEN':
      secureStorage.setItem('auth_token', action.payload.token);
      secureStorage.setItem('token_expiry', action.payload.expiry.toString());
      return {
        ...state,
        token: action.payload.token,
        tokenExpiry: action.payload.expiry,
      };
    case 'UPDATE_COMPANY_INFO':
      secureStorage.setItem('company_info', JSON.stringify(action.payload.companyInfo));
      return {
        ...state,
        companyInfo: action.payload.companyInfo,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // トークンの有効期限チェック
  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiry = secureStorage.getItem('token_expiry');
      if (expiry && parseInt(expiry) < Date.now()) {
        dispatch({ type: 'LOGOUT' });
      }
    };

    // 初期チェック
    checkTokenExpiry();

    // 定期的なチェック（5分ごと）
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // 初期化時にlocalStorageから認証情報を復元
  useEffect(() => {
    const token = secureStorage.getItem('auth_token');
    const userType = secureStorage.getItem('user_type') as 'investor' | 'corporate' | null;
    const userId = secureStorage.getItem('user_id');
    const companyInfoStr = secureStorage.getItem('company_info');
    const expiry = secureStorage.getItem('token_expiry');

    if (token && userType && userId && expiry && parseInt(expiry) > Date.now()) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token,
          userType,
          userId,
          companyInfo: companyInfoStr ? JSON.parse(companyInfoStr) : null,
          expiry: parseInt(expiry),
        },
      });
    } else {
      // トークンが無効な場合はログアウト
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
