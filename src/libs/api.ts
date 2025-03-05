// libs/api.ts

import { API_BASE_URL, ENDPOINTS } from "../config/api";
import {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  LogoutRequest,
  LogoutResponse,
  GuestLoginRequest,
  GuestLoginResponse,
  GetUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  CreateQARequest,
  CreateQAResponse,
  LikeQARequest,
  LikeQAResponse,
  BookmarkQARequest,
  BookmarkQAResponse,
  ChatRequest,
  ChatResponse,
  DeleteChatLogRequest,
  DeleteChatLogResponse,
  ArchiveChatLogRequest,
  ArchiveChatLogResponse,
  UploadRequest,
  UploadResponse,
  MailDraftRequest,
  MailDraftResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateNotificationSettingRequest,
  UpdateNotificationSettingResponse,
  DeleteAccountRequest,
  DeleteAccountResponse
} from "../types";
// 型定義済みの ChatMessage と CompanyInfo を利用
import { ChatMessage, CompanyInfo } from "../types";

/**
 * 共通の HTTP クライアント関数
 * data が FormData の場合は JSON 化せずそのまま送信
 */
async function apiFetch<T>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  data?: any,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    // FormData の場合は自動で Content-Type が設定されるため除外
    ...(data instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config: RequestInit = {
    method,
    headers,
    ...(data ? { body: data instanceof FormData ? data : JSON.stringify(data) } : {}),
  };

  try {
    const response = await fetch(API_BASE_URL + endpoint, config);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "API Error");
    }
    return result;
  } catch (error) {
    // 必要に応じてログ出力やエラートラッキング処理を追加
    throw error;
  }
}

/* =======================
   共通認証・ユーザー管理 API
   ======================= */

/**
 * ユーザー認証 API (ログイン)
 * POST /auth/login
 */
export async function login(requestData: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(ENDPOINTS.login, "POST", requestData);
}

/**
 * トークン更新 API
 * POST /auth/refresh
 */
export async function refreshToken(requestData: RefreshRequest): Promise<RefreshResponse> {
  return apiFetch<RefreshResponse>(ENDPOINTS.refresh, "POST", requestData);
}

/**
 * パスワードリセット API
 * POST /auth/password/reset
 */
export async function passwordReset(requestData: { email: string }): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(ENDPOINTS.passwordReset, "POST", requestData);
}

/**
 * 新規アカウント登録 API
 * POST /auth/register
 */
export async function registerUser(requestData: {
  email: string;
  password: string;
  userName: string;
  userType: string;
}): Promise<{ userId: string; message: string }> {
  return apiFetch<{ userId: string; message: string }>(ENDPOINTS.register, "POST", requestData);
}

/**
 * ログインユーザー情報取得 API
 * GET /users/me
 */
export async function getUser(token: string): Promise<GetUserResponse> {
  return apiFetch<GetUserResponse>(ENDPOINTS.getMe, "GET", undefined, token);
}

/**
 * ログインユーザー情報更新 API
 * PATCH /users/me
 */
export async function updateUser(token: string, updateData: UpdateUserRequest): Promise<UpdateUserResponse> {
  return apiFetch<UpdateUserResponse>(ENDPOINTS.updateMe, "PATCH", updateData, token);
}

/**
 * 共通ログアウト API
 * POST /auth/logout
 */
export async function logout(requestData: LogoutRequest, token: string): Promise<LogoutResponse> {
  return apiFetch<LogoutResponse>(ENDPOINTS.logout, "POST", requestData, token);
}

/**
 * 共通横断検索 API
 * GET /search?keyword=...&type=...
 */
export async function search(query: { keyword: string; type: string }): Promise<{ results: any[]; totalCount: number }> {
  const queryString = new URLSearchParams(query as any).toString();
  return apiFetch<{ results: any[]; totalCount: number }>(`${ENDPOINTS.search}?${queryString}`, "GET");
}

/* =======================
   企業向け API
   ======================= */

/**
 * 企業向けログイン API
 * POST /corporate/auth/login
 */
export async function corporateLogin(requestData: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(ENDPOINTS.corporateLogin, "POST", requestData);
}

/**
 * 企業向けログアウト API
 * POST /corporate/auth/logout
 */
export async function corporateLogout(requestData: LogoutRequest, token: string): Promise<LogoutResponse> {
  return apiFetch<LogoutResponse>(ENDPOINTS.corporateLogout, "POST", requestData, token);
}

/**
 * ダッシュボード表示 API
 * GET /corporate/dashboard?period=...&type=...
 */
export async function getCorporateDashboard(token: string, query: { period: string; type: string }): Promise<any> {
  const queryString = new URLSearchParams(query as any).toString();
  return apiFetch<any>(`${ENDPOINTS.corporateDashboard}?${queryString}`, "GET", undefined, token);
}

/**
 * 企業向け QA 検索 API
 * GET /corporate/qa/search?keyword=...&theme=...
 */
export async function searchCorporateQa(token: string, query: { keyword: string; theme: string }): Promise<{ results: any[]; totalCount: number }> {
  const queryString = new URLSearchParams(query as any).toString();
  return apiFetch<{ results: any[]; totalCount: number }>(`${ENDPOINTS.corporateQaSearch}?${queryString}`, "GET", undefined, token);
}

/**
 * 企業向け QA 編集 API
 * PUT /corporate/qa/:id
 */
export async function editCorporateQa(token: string, qaId: string, updateData: {
  questionText: string;
  answerText: string;
  theme: string;
  tags: string[];
  relatedFiles?: any[];
}): Promise<{ id: string; message: string }> {
  const endpoint = `${ENDPOINTS.corporateQa}/${qaId}`;
  return apiFetch<{ id: string; message: string }>(endpoint, "PUT", updateData, token);
}

/**
 * 企業向け QA 削除 API
 * DELETE /corporate/qa/:id
 */
export async function deleteCorporateQa(token: string, qaId: string): Promise<{ message: string }> {
  const endpoint = `${ENDPOINTS.corporateQa}/${qaId}`;
  return apiFetch<{ message: string }>(endpoint, "DELETE", undefined, token);
}

/**
 * 企業向け 資料アップロード API
 * POST /corporate/qa/upload
 * ※ ファイルアップロードのため、FormData を利用
 */
export async function uploadCorporateQa(token: string, uploadData: UploadRequest): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", uploadData.file);
  if (uploadData.meta) {
    formData.append("metadata", JSON.stringify(uploadData.meta));
  }
  return apiFetch<UploadResponse>(ENDPOINTS.corporateQaUpload, "POST", formData, token);
}

/**
 * 企業向け QA 一括作成 API
 * POST /corporate/qa/batchCreate
 */
export async function batchCreateCorporateQa(token: string, qas: CreateQARequest[]): Promise<{ createdCount: number; message: string }> {
  return apiFetch<{ createdCount: number; message: string }>(ENDPOINTS.corporateQaBatchCreate, "POST", { qas }, token);
}

/**
 * 企業向け ドラフト一覧取得 API
 * GET /corporate/irchat/drafts
 */
export async function getCorporateDrafts(token: string, query?: Record<string, string>): Promise<{ drafts: any[] }> {
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
  return apiFetch<{ drafts: any[] }>(`${ENDPOINTS.corporateDrafts}${queryString}`, "GET", undefined, token);
}

/**
 * 企業向け ドラフト詳細取得 API
 * GET /corporate/irchat/drafts/:draftId
 */
export async function getCorporateDraftDetail(token: string, draftId: string): Promise<{ draftId: string; messages: ChatMessage[] }> {
  const endpoint = `${ENDPOINTS.corporateDrafts}/${draftId}`;
  return apiFetch<{ draftId: string; messages: ChatMessage[] }>(endpoint, "GET", undefined, token);
}

/**
 * 企業向け チャットAI呼び出し API
 * POST /corporate/irchat
 */
export async function postCorporateIrChat(token: string, requestData: ChatRequest & { draftId?: string; options?: { tone: string; maxLength: number } }): Promise<ChatResponse> {
  return apiFetch<ChatResponse>(ENDPOINTS.corporateIrChat, "POST", requestData, token);
}

/**
 * 企業向け メールドラフト生成 API
 * POST /corporate/maildraft
 */
export async function createCorporateMailDraft(token: string, requestData: MailDraftRequest): Promise<MailDraftResponse> {
  return apiFetch<MailDraftResponse>(ENDPOINTS.corporateMailDraft, "POST", requestData, token);
}

/**
 * 企業基本情報取得 API
 * GET /corporate/settings/company
 */
export async function getCorporateCompanySettings(token: string): Promise<CompanyInfo> {
  return apiFetch<CompanyInfo>(ENDPOINTS.corporateCompanySettings, "GET", undefined, token);
}

/**
 * 企業基本情報更新 API
 * PUT /corporate/settings/company
 */
export async function updateCorporateCompanySettings(token: string, updateData: CompanyInfo): Promise<CompanyInfo & { message: string }> {
  return apiFetch<CompanyInfo & { message: string }>(ENDPOINTS.corporateCompanySettings, "PUT", updateData, token);
}

/**
 * 企業アカウント情報更新 API
 * PUT /corporate/settings/account
 */
export async function updateCorporateAccountSettings(token: string, updateData: { currentPassword: string; newPassword: string; newEmail: string }): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(ENDPOINTS.corporateAccountSettings, "PUT", updateData, token);
}

/* =======================
   投資家向け API
   ======================= */

/**
 * 投資家向けログイン API
 * POST /investor/auth/login
 */
export async function investorLogin(requestData: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(ENDPOINTS.investorLogin, "POST", requestData);
}

/**
 * 投資家向けログアウト API
 * POST /investor/auth/logout
 */
export async function investorLogout(requestData: LogoutRequest, token: string): Promise<LogoutResponse> {
  return apiFetch<LogoutResponse>(ENDPOINTS.investorLogout, "POST", requestData, token);
}

/**
 * 投資家向けゲスト利用 API
 * POST /investor/auth/guest
 */
export async function investorGuest(requestData: GuestLoginRequest): Promise<GuestLoginResponse> {
  return apiFetch<GuestLoginResponse>(ENDPOINTS.investorGuest, "POST", requestData);
}

/**
 * 投資家向け 企業一覧 API
 * GET /investor/companies?keyword=...&sort=...&industry=...
 */
export async function getInvestorCompanies(token: string, query: { keyword?: string; sort?: string; industry?: string }): Promise<{ companies: any[]; totalCount: number }> {
  const queryString = new URLSearchParams(query as any).toString();
  return apiFetch<{ companies: any[]; totalCount: number }>(`${ENDPOINTS.investorCompanies}?${queryString}`, "GET", undefined, token);
}

/**
 * 投資家向け 企業詳細 API
 * GET /investor/companies/:companyId
 */
export async function getInvestorCompanyDetail(token: string, companyId: string): Promise<any> {
  const endpoint = `${ENDPOINTS.investorCompanies}/${companyId}`;
  return apiFetch<any>(endpoint, "GET", undefined, token);
}

/**
 * 投資家向け 企業 QA 一覧 API
 * GET /investor/companies/:companyId/qa
 */
export async function getInvestorCompanyQa(token: string, companyId: string, query?: Record<string, string>): Promise<{ qaList: any[]; totalCount: number }> {
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
  const endpoint = `${ENDPOINTS.investorCompanies}/${companyId}/qa${queryString}`;
  return apiFetch<{ qaList: any[]; totalCount: number }>(endpoint, "GET", undefined, token);
}

/**
 * 投資家向け 横断 QA 検索 API
 * GET /investor/qa/search?keyword=...&likeMin=...&dateFrom=...
 */
export async function searchInvestorQa(token: string, query: Record<string, string>): Promise<{ results: any[]; totalCount: number }> {
  const queryString = new URLSearchParams(query).toString();
  return apiFetch<{ results: any[]; totalCount: number }>(`${ENDPOINTS.investorQaSearch}?${queryString}`, "GET", undefined, token);
}

/**
 * 投資家向け QA いいね API
 * POST /investor/qa/:qaId/like
 */
export async function likeInvestorQa(token: string, qaId: string, action: 'add' | 'remove'): Promise<LikeQAResponse> {
  const endpoint = `${ENDPOINTS.investorQa}/${qaId}/like`;
  return apiFetch<LikeQAResponse>(endpoint, "POST", { action }, token);
}

/**
 * 投資家向け QA ブックマーク API
 * POST /investor/qa/:qaId/bookmark
 */
export async function bookmarkInvestorQa(token: string, qaId: string, action: 'add' | 'remove'): Promise<BookmarkQAResponse> {
  const endpoint = `${ENDPOINTS.investorQa}/${qaId}/bookmark`;
  return apiFetch<BookmarkQAResponse>(endpoint, "POST", { action }, token);
}

/**
 * 投資家向け チャットログ一覧 API
 * GET /investor/chat/logs?keyword=...&sort=...
 */
export async function getInvestorChatLogs(token: string, query?: Record<string, string>): Promise<{ chatLogs: any[]; totalCount: number }> {
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
  return apiFetch<{ chatLogs: any[]; totalCount: number }>(`${ENDPOINTS.investorChatLogs}${queryString}`, "GET", undefined, token);
}

/**
 * 投資家向け チャットログ削除 API
 * DELETE /investor/chat/logs/:chatId
 */
export async function deleteInvestorChatLog(token: string, chatId: string): Promise<{ message: string }> {
  const endpoint = `${ENDPOINTS.investorChatLogs}/${chatId}`;
  return apiFetch<{ message: string }>(endpoint, "DELETE", undefined, token);
}

/**
 * 投資家向け チャットログアーカイブ API
 * PATCH /investor/chat/logs/:chatId/archive
 */
export async function archiveInvestorChatLog(token: string, chatId: string, action: 'archive' | 'unarchive'): Promise<ArchiveChatLogResponse> {
  const endpoint = `${ENDPOINTS.investorChatLogs}/${chatId}/archive`;
  return apiFetch<ArchiveChatLogResponse>(endpoint, "PATCH", { action }, token);
}

/**
 * 投資家向け ユーザー情報取得 API
 * GET /investor/users/me
 */
export async function getInvestorUser(token: string): Promise<GetUserResponse> {
  return apiFetch<GetUserResponse>(ENDPOINTS.investorUser, "GET", undefined, token);
}

/**
 * 投資家向け ユーザー情報更新 API
 * PATCH /investor/users/me
 */
export async function updateInvestorUser(token: string, updateData: UpdateUserRequest): Promise<UpdateUserResponse> {
  return apiFetch<UpdateUserResponse>(ENDPOINTS.investorUser, "PATCH", updateData, token);
}

/**
 * 投資家向け パスワード変更 API
 * PATCH /investor/users/me/password
 */
export async function changeInvestorPassword(token: string, requestData: ChangePasswordRequest): Promise<ChangePasswordResponse> {
  const endpoint = `${ENDPOINTS.investorUser}/password`;
  return apiFetch<ChangePasswordResponse>(endpoint, "PATCH", requestData, token);
}

/**
 * 投資家向け 通知設定 API
 * PATCH /investor/users/me/notification
 */
export async function updateInvestorNotification(token: string, requestData: UpdateNotificationSettingRequest): Promise<UpdateNotificationSettingResponse> {
  const endpoint = `${ENDPOINTS.investorUser}/notification`;
  return apiFetch<UpdateNotificationSettingResponse>(endpoint, "PATCH", requestData, token);
}

/**
 * 投資家向け アカウント退会 API
 * DELETE /investor/users/me
 */
export async function deleteInvestorAccount(token: string, requestData: DeleteAccountRequest): Promise<DeleteAccountResponse> {
  return apiFetch<DeleteAccountResponse>(ENDPOINTS.investorUser, "DELETE", requestData, token);
}
