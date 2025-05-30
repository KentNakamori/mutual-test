/**
 * 認証関連の型定義
 * Auth0認証システムで使用する型定義
 */

// ユーザータイプ
export type UserRole = 'corporate' | 'investor';

// Auth0設定
export interface Auth0Config {
  domain: string;
  clientId: string;
  audience: string;
  redirectUri: string;
}

// ユーザー情報
export interface UserInfo {
  userId: string;
  email: string;
  role: UserRole;
  userName: string;
}

// Auth0ユーザー拡張型
export interface ExtendedUser {
  sub: string;  // ユーザーID
  email?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  updated_at?: string;
  role?: UserRole;
}

// 認証クライアントインターフェース
export interface AuthClient {
  login(email: string, password: string, userType: UserRole): Promise<AuthResponse>;
  logout(): Promise<{ success: boolean }>;
  isTokenValid(): boolean;
}

// 認証応答
export interface AuthResponse {
  success: boolean;
  error?: string;
  requiresMFA?: boolean;
  mfaToken?: string;
  userId?: string;
  accessToken?: string;
  refreshToken?: string;
}

// ログイン要求
export interface LoginRequest {
  email: string;
  password: string;
}

// ログイン応答
export interface LoginResponse {
  success: boolean;
  userId?: string;
  role?: UserRole;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

// トークンリフレッシュ要求
export interface RefreshRequest {
  refreshToken: string;
}

// トークンリフレッシュ応答
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// ログアウト要求
export interface LogoutRequest {
  refreshToken: string;
}

// ログアウト応答
export interface LogoutResponse {
  success: boolean;
  message: string;
}

// ゲストアクセス要求
export interface GuestAccessRequest {
  companyId?: string;
}

// ゲストアクセス応答
export interface GuestAccessResponse {
  accessToken: string;
  expiresIn: number;
}

// 企業ユーザー登録データ
export interface CorporateUserRegistrationData {
  email: string;
  password: string;
  company_id: string;
  is_admin: boolean;
} 