import { ENDPOINTS } from "../../config/api";
import { apiFetch } from "./client";
import {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  LogoutRequest as AuthLogoutRequest,
  LogoutResponse as AuthLogoutResponse,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from "../../types";

/**
 * 認証関連API
 */

/**
 * ログインAPI
 * @param requestData - ログイン情報（メールアドレス、パスワード）
 * @returns ログイン成功時のレスポンス（トークン情報など）
 */
export async function login(requestData: LoginRequest): Promise<LoginResponse> {
  const endpoint = ENDPOINTS.investor.auth.login;
  return apiFetch<LoginResponse>(endpoint, "POST", requestData);
}

/**
 * トークンリフレッシュAPI
 * @param requestData - リフレッシュトークン情報
 * @returns 新しいアクセストークン情報
 */
export async function refreshToken(requestData: RefreshRequest): Promise<RefreshResponse> {
  return apiFetch<RefreshResponse>(ENDPOINTS.investor.auth.refresh, "POST", requestData);
}

/**
 * パスワードリセットAPI
 * @param requestData - リセット対象のメールアドレス
 * @returns リセット処理の結果メッセージ
 */
export async function passwordReset(requestData: { email: string }): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(ENDPOINTS.corporate.auth.passwordReset, "POST", requestData);
}

/**
 * ユーザー登録API
 * @param requestData - 登録情報（メールアドレス、パスワード、ユーザー名、ユーザータイプ）
 * @returns 登録成功時のユーザーIDとメッセージ
 */
export async function registerUser(requestData: {
  email: string;
  password: string;
  userName: string;
  userType: string;
}): Promise<{ userId: string; message: string }> {
  const endpoint = requestData.userType === 'corporate' 
    ? ENDPOINTS.admin.company.register
    : ENDPOINTS.investor.auth.register;
  return apiFetch<{ userId: string; message: string }>(endpoint, "POST", requestData);
}

/**
 * ユーザー情報取得API
 * @param token - 認証トークン
 * @returns ユーザー情報
 */
export async function getUser(token: string): Promise<GetUserResponse> {
  return apiFetch<GetUserResponse>(ENDPOINTS.investor.auth.me, "GET", undefined, token);
}

/**
 * ユーザー情報更新API
 * @param token - 認証トークン
 * @param updateData - 更新するユーザー情報
 * @returns 更新後のユーザー情報
 */
export async function updateUser(token: string, updateData: UpdateUserRequest): Promise<UpdateUserResponse> {
  return apiFetch<UpdateUserResponse>(ENDPOINTS.investor.profile.update, "PATCH", updateData, token);
}

/**
 * ログアウトAPI
 * @param requestData - ログアウトリクエスト情報
 * @param token - 認証トークン
 * @returns ログアウト処理の結果
 */
export async function logout(requestData: AuthLogoutRequest, token: string): Promise<AuthLogoutResponse> {
  return apiFetch<AuthLogoutResponse>(ENDPOINTS.investor.auth.logout, "POST", requestData, token);
}

/**
 * 投資家登録API
 * @param requestData - 投資家登録情報（メールアドレス、パスワード、ユーザー名、投資家タイプ、投資経験など）
 * @returns 登録成功時のユーザーIDとメッセージ
 */
export async function investorRegister(requestData: {
  email: string;
  password: string;
  userName: string;
  investorType: string;
  investmentExperience: string;
  companyName?: string;
  assetManagementScale?: string;
}): Promise<{ userId: string; message: string }> {
  return apiFetch<{ userId: string; message: string }>(ENDPOINTS.investor.auth.register, "POST", requestData);
}

/**
 * 投資家アカウント削除API
 * @param token - 認証トークン
 * @returns 削除処理の結果（成功/失敗とメッセージ）
 */
export async function deleteInvestorAccount(token: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(ENDPOINTS.investor.auth.me, "DELETE", undefined, token);
} 