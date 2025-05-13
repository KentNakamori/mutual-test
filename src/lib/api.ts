import { API_BASE_URL } from "../config/auth";
import { ENDPOINTS } from "../config/api";
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
  DeleteAccountResponse,
  QA,
  Company,
  ChatSession,
  ChatMessage,
  CompanyInfo, 
  DashboardData
} from "../types";
import axios from 'axios';

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
  // エンドポイントの末尾のスラッシュを削除
  const normalizedEndpoint = endpoint.replace(/\/+$/, '');
  
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

  // リクエスト情報のログ出力
  console.log(`API ${method} Request to ${normalizedEndpoint}:`, {
    url: API_BASE_URL + normalizedEndpoint,
    headers,
    body: data instanceof FormData ? "FormData" : data
  });

  try {
    const response = await fetch(API_BASE_URL + normalizedEndpoint, config);
    let result;
    try {
      result = await response.json();
    } catch (e) {
      console.error("Failed to parse response JSON:", e);
      result = { message: "Response is not JSON" };
    }
    
    if (!response.ok) {
      console.error("API Error Response:", {
        endpoint: normalizedEndpoint,
        status: response.status,
        statusText: response.statusText,
        data: result
      });
      throw new Error(result.message || result.detail || `API Error: ${response.status} ${response.statusText}`);
    }
    
    // 成功時のレスポンスもログに出力
    console.log(`API ${method} Response from ${normalizedEndpoint}:`, result);
    return result;
  } catch (error) {
    console.error(`API Fetch Error (${method} ${normalizedEndpoint}):`, error);
    throw error;
  }
}

/* =======================
   共通認証・ユーザー管理 API
   ======================= */

// 旧APIとの互換性のためのラッパー関数
export async function login(requestData: LoginRequest): Promise<LoginResponse> {
  // ユーザータイプによって呼び出し先を変更（デフォルトは投資家）
  const endpoint = ENDPOINTS.investor.auth.login;
  return apiFetch<LoginResponse>(endpoint, "POST", requestData);
}

export async function refreshToken(requestData: RefreshRequest): Promise<RefreshResponse> {
  return apiFetch<RefreshResponse>(ENDPOINTS.investor.auth.refresh, "POST", requestData);
}

export async function passwordReset(requestData: { email: string }): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(ENDPOINTS.corporate.auth.passwordReset, "POST", requestData);
}

export async function registerUser(requestData: {
  email: string;
  password: string;
  userName: string;
  userType: string;
}): Promise<{ userId: string; message: string }> {
  const endpoint = requestData.userType === 'corporate' 
    ? ENDPOINTS.admin.company.register  // 企業登録は管理者API
    : ENDPOINTS.investor.auth.register; // 投資家登録
  return apiFetch<{ userId: string; message: string }>(endpoint, "POST", requestData);
}

export async function getUser(token: string): Promise<GetUserResponse> {
  // ここでは投資家APIを使うと仮定
  return apiFetch<GetUserResponse>(ENDPOINTS.investor.auth.me, "GET", undefined, token);
}

export async function updateUser(token: string, updateData: UpdateUserRequest): Promise<UpdateUserResponse> {
  // ここでは投資家APIを使うと仮定
  return apiFetch<UpdateUserResponse>(ENDPOINTS.investor.profile.update, "PATCH", updateData, token);
}

// LogoutRequestとの衝突を避けるためにAuthLogoutRequestを使用
export async function logout(requestData: AuthLogoutRequest, token: string): Promise<AuthLogoutResponse> {
  // ここでは投資家APIを使うと仮定
  return apiFetch<AuthLogoutResponse>(ENDPOINTS.investor.auth.logout, "POST", requestData, token);
}

export async function search(query: { keyword: string; type: string }): Promise<{ results: any[]; totalCount: number }> {
  const queryString = new URLSearchParams(query as any).toString();
  // 企業検索か投資家検索か判断
  const endpoint = query.type === 'corporate' 
    ? `${ENDPOINTS.corporate.qa.search}?${queryString}`
    : `${ENDPOINTS.investor.qa.search}?${queryString}`;
  return apiFetch<{ results: any[]; totalCount: number }>(endpoint, "GET");
}

/* =======================
   企業向け API
   ======================= */

/**
 * ダッシュボード表示 API
 * GET /corporate/dashboard?period=...&type=...
 * ※ レスポンスは IR API の仕様に合わせ、DashboardData 型を返す
 */
export async function getCorporateDashboard(token: string, query: { period: string }): Promise<DashboardData> {
  const queryString = new URLSearchParams(query as any).toString();
  return apiFetch<DashboardData>(`${ENDPOINTS.corporate.dashboard}?${queryString}`, "GET", undefined, token);
}

/**
 * 企業向けQA検索API
 * @param token 認証トークン
 * @param query 検索クエリ
 * @returns QAの検索結果
 */
export async function searchCorporateQa(
  token: string,
  query: {
    keyword?: string;
    review_status?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
    tag?: string;
    genre?: string[];
    fiscalPeriod?: string[];
    sort?: 'createdAt' | 'likeCount';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }
): Promise<{
  results: QA[];
  totalCount: number;
  totalPages: number;
}> {
  console.log('searchCorporateQa called with query:', query);
  
  const queryString = new URLSearchParams();
  
  // クエリパラメータの設定
  if (query.keyword) queryString.append('keyword', query.keyword);
  if (query.review_status) queryString.append('review_status', query.review_status);
  
  // タグの処理 - バックエンドは単一値のみ受け付ける
  if (query.tag) {
    console.log('Setting tag parameter:', query.tag);
    queryString.append('tag', query.tag);
  }
  
  // ジャンルの処理
  if (query.genre && Array.isArray(query.genre) && query.genre.length > 0) {
    console.log('Setting genre parameters:', query.genre);
    // 空の要素をフィルタリング
    const validGenres = query.genre.filter(g => g && g.trim() !== '');
    validGenres.forEach(g => queryString.append('genre', g));
  }
  
  // 決算期の処理
  if (query.fiscalPeriod && Array.isArray(query.fiscalPeriod) && query.fiscalPeriod.length > 0) {
    console.log('Setting fiscalPeriod parameters:', query.fiscalPeriod);
    // 空の要素をフィルタリング
    const validPeriods = query.fiscalPeriod.filter(fp => fp && fp.trim() !== '');
    validPeriods.forEach(fp => queryString.append('fiscalPeriod', fp));
  }
  
  // ソートパラメータの処理 - バックエンドの仕様に合わせる
  const validSortFields = ['createdAt', 'likeCount'];
  
  // sortが有効な値かチェック
  if (query.sort && validSortFields.includes(query.sort)) {
    queryString.append('sort', query.sort);
  } else {
    // デフォルト値
    queryString.append('sort', 'createdAt');
  }
  
  // orderの処理
  if (query.order && ['asc', 'desc'].includes(query.order)) {
    queryString.append('order', query.order);
  } else {
    // デフォルト値
    queryString.append('order', 'desc');
  }
  
  // ページネーションパラメータ
  if (query.page) queryString.append('page', query.page.toString());
  if (query.limit) queryString.append('limit', query.limit.toString());

  const apiUrl = `${ENDPOINTS.corporate.qa.search}?${queryString.toString()}`;
  console.log('Search API Full URL:', apiUrl);

  return apiFetch<{
    results: QA[];
    totalCount: number;
    totalPages: number;
  }>(apiUrl, "GET", undefined, token);
}

/**
 * 企業向けQA作成API
 * @param token 認証トークン
 * @param data QA作成データ
 * @returns 作成されたQAのID
 */
export async function createCorporateQa(
  token: string,
  data: {
    title: string;
    question: string;
    answer: string;
    tag: string;
    source?: string[];
    genre?: string[];
    fiscalPeriod?: string;
    reviewStatus: QA['reviewStatus'];
  }
): Promise<{ qaId: string }> {
  return apiFetch<{ qaId: string }>(ENDPOINTS.corporate.qa.create, "POST", data, token);
}

/**
 * 企業向けQA更新API
 * @param token 認証トークン
 * @param qaId QAのID
 * @param data 更新データ
 * @returns 更新結果
 */
export async function updateCorporateQa(
  token: string,
  qaId: string,
  data: {
    title?: string;
    question?: string;
    answer?: string;
    tag?: string;
    source?: string[];
    genre?: string[];
    fiscalPeriod?: string;
    reviewStatus?: QA['reviewStatus'];
  }
): Promise<{ qaId: string; updatedFields: Record<string, any> }> {
  return apiFetch<{ qaId: string; updatedFields: Record<string, any> }>(
    ENDPOINTS.corporate.qa.update(qaId),
    "PATCH",
    data,
    token
  );
}

/**
 * 企業向けQA削除API
 * @param token 認証トークン
 * @param qaId QAのID
 * @returns 削除結果
 */
export async function deleteCorporateQa(
  token: string,
  qaId: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    ENDPOINTS.corporate.qa.delete(qaId),
    "DELETE",
    undefined,
    token
  );
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
  return apiFetch<UploadResponse>(ENDPOINTS.corporate.qa.upload, "POST", formData, token);
}

export async function batchCreateCorporateQa(token: string, qas: CreateQARequest[]): Promise<{ createdCount: number; message: string }> {
  return apiFetch<{ createdCount: number; message: string }>(ENDPOINTS.corporate.qa.batchCreate, "POST", { qas }, token);
}

export async function getCorporateDrafts(token: string, query?: Record<string, string>): Promise<{ drafts: any[] }> {
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
  return apiFetch<{ drafts: any[] }>(`${ENDPOINTS.corporate.ir.drafts}${queryString}`, "GET", undefined, token);
}

export async function getCorporateDraftDetail(token: string, draftId: string): Promise<{ draftId: string; messages: ChatMessage[] }> {
  const endpoint = ENDPOINTS.corporate.ir.draft(draftId);
  return apiFetch<{ draftId: string; messages: ChatMessage[] }>(endpoint, "GET", undefined, token);
}

export async function postCorporateIrChat(token: string, requestData: ChatRequest & { draftId?: string; options?: { tone: string; maxLength: number } }): Promise<ChatResponse> {
  return apiFetch<ChatResponse>(ENDPOINTS.corporate.ir.chat, "POST", requestData, token);
}

export async function createCorporateMailDraft(token: string, requestData: MailDraftRequest): Promise<MailDraftResponse> {
  return apiFetch<MailDraftResponse>(ENDPOINTS.corporate.ir.mailDraft, "POST", requestData, token);
}

export async function getCorporateCompanySettings(token: string): Promise<CompanyInfo> {
  return apiFetch<CompanyInfo>(ENDPOINTS.corporate.settings.company, "GET", undefined, token);
}

export async function updateCorporateCompanySettings(token: string, updateData: CompanyInfo): Promise<CompanyInfo & { message: string }> {
  return apiFetch<CompanyInfo & { message: string }>(ENDPOINTS.corporate.settings.company, "PUT", updateData, token);
}

export async function updateCorporateAccountSettings(token: string, updateData: { currentPassword: string; newPassword: string; newEmail: string }): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(ENDPOINTS.corporate.settings.account, "PUT", updateData, token);
}

/* =======================
   投資家向け API
   ======================= */

/**
 * 投資家ユーザー登録API
 * POST /investor/auth/register
 * @param requestData ユーザー登録情報
 * @returns 登録結果レスポンス
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
 * DELETE /investor/auth/me
 * @param token 認証トークン
 * @returns 削除結果レスポンス
 */
export async function deleteInvestorAccount(token: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(ENDPOINTS.investor.auth.me, "DELETE", undefined, token);
}

/**
 * 企業一覧取得API
 * GET /investor/companies
 * @param token 認証トークン（オプション）
 * @param query 検索条件
 * @returns 企業リスト
 */
export async function getInvestorCompanies(
  token?: string, 
  query?: { 
    keyword?: string; 
    industry?: string;
  }
): Promise<{ 
  companies: Array<{
    companyId: string;
    companyName: string;
    industry: string;
    logoUrl?: string;
    isFollowed: boolean;
    createdAt: string;
    updatedAt: string;
  }>; 
  totalCount: number;
  totalPages: number;
}> {
  // デバッグログ：入力パラメータの確認
  console.log('getInvestorCompanies input:', { token, query });

  // undefinedの値を除外したクエリパラメータを作成
  const validQuery = query ? Object.fromEntries(
    Object.entries(query).filter(([_, value]) => value !== undefined && value !== '')
  ) : {};

  // デバッグログ：有効なクエリパラメータの確認
  console.log('Valid query params:', validQuery);

  const queryString = Object.keys(validQuery).length > 0 
    ? new URLSearchParams(validQuery as any).toString()
    : '';
    
  const endpoint = queryString 
    ? `${ENDPOINTS.investor.companies.list}?${queryString}`
    : ENDPOINTS.investor.companies.list;

  // デバッグログ：最終的なエンドポイントの確認
  console.log('Final endpoint:', endpoint);
    
  return apiFetch<any>(endpoint, "GET", undefined, token);
}

/**
 * 企業詳細取得API
 * GET /investor/companies/{companyId}
 * @param companyId 企業ID
 * @param token 認証トークン（オプション）
 * @returns 企業詳細情報
 */
export async function getInvestorCompanyDetail(
  companyId: string,
  token?: string
): Promise<{
  companyId: string;
  companyName: string;
  industry: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  adminUserIds: string[];
  companyInfo: {
    address: string;
    email: string;
    tel: string;
  };
  isFollowed: boolean;
}> {
  const endpoint = ENDPOINTS.investor.companies.detail(companyId);
  return apiFetch<any>(endpoint, "GET", undefined, token);
}

/**
 * 企業FAQ取得API
 * GET /investor/companies/{companyId}/faq
 * @param companyId 企業ID
 * @param token 認証トークン
 * @returns FAQリスト
 */
export async function getInvestorCompanyFAQ(
  companyId: string,
  token: string
): Promise<{
  faqs: Array<{
    qaId: string;
    question: string;
    answer: string;
  }>;
}> {
  const endpoint = ENDPOINTS.investor.companies.qa(companyId);
  return apiFetch<any>(endpoint, "GET", undefined, token);
}

/**
 * 企業フォロー/解除API
 * POST /investor/companies/{companyId}/follow
 * @param companyId 企業ID
 * @param action フォロー操作（'follow'または'unfollow'）
 * @param token 認証トークン
 * @returns フォロー状態
 */
export async function followInvestorCompany(
  companyId: string,
  action: 'follow' | 'unfollow',
  token: string
): Promise<{
  companyId: string;
  isFollowed: boolean;
  message: string;
}> {
  const endpoint = ENDPOINTS.investor.companies.follow(companyId);
  return apiFetch<any>(endpoint, "POST", { action }, token);
}

/**
 * QA全体検索API
 * GET /investor/qa/search
 * @param query 検索条件
 * @param token 認証トークン（オプション）
 * @returns QA検索結果
 */
export async function searchInvestorQa(
  query: {
    keyword?: string;
    tag?: string;
    genre?: string[];
    fiscalPeriod?: string[];
    companyId?: string;
    companyName?: string;
    sort?: 'createdAt' | 'likeCount';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }, 
  token?: string
): Promise<{
  results: Array<any>;
  totalCount: number;
  totalPages: number;
}> {
  // URLSearchParamsを使って配列パラメータを正しく渡す
  const queryString = new URLSearchParams();
  
  if (query.keyword) queryString.append('keyword', query.keyword);
  if (query.tag) queryString.append('tag', query.tag);
  if (query.companyId) queryString.append('companyId', query.companyId);
  if (query.companyName) queryString.append('companyName', query.companyName);
  
  // ジャンルの処理（配列）
  if (query.genre && Array.isArray(query.genre)) {
    query.genre.forEach(g => {
      if (g && g.trim()) queryString.append('genre', g);
    });
  }
  
  // 決算期の処理（配列）
  if (query.fiscalPeriod && Array.isArray(query.fiscalPeriod)) {
    query.fiscalPeriod.forEach(fp => {
      if (fp && fp.trim()) queryString.append('fiscalPeriod', fp);
    });
  }
  
  // ソートとページネーション
  if (query.sort) queryString.append('sort', query.sort);
  if (query.order) queryString.append('order', query.order);
  if (query.page) queryString.append('page', query.page.toString());
  if (query.limit) queryString.append('limit', query.limit.toString());
  
  const endpoint = `${ENDPOINTS.investor.qa.search}?${queryString.toString()}`;
  return apiFetch<any>(endpoint, "GET", undefined, token);
}

/**
 * 特定企業のQA検索API
 * GET /investor/qa/search/company/{company_id}
 * @param companyId 企業ID
 * @param query 検索条件
 * @param token 認証トークン
 * @returns QA検索結果
 */
export async function searchInvestorCompanyQa(
  companyId: string,
  query: {
    keyword?: string;
    tags?: string[];
    genre?: string[];
    fiscalPeriod?: string;
    is_faq?: boolean;
    sort?: 'createdAt' | 'likeCount';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  },
  token: string
): Promise<{
  results: Array<any>;
  totalCount: number;
  totalPages: number;
}> {
  const queryString = new URLSearchParams();
  
  if (query.keyword) queryString.append('keyword', query.keyword);
  if (query.fiscalPeriod) queryString.append('fiscalPeriod', query.fiscalPeriod);
  if (query.is_faq !== undefined) queryString.append('is_faq', query.is_faq.toString());
  
  // タグの処理（配列）
  if (query.tags && Array.isArray(query.tags)) {
    query.tags.forEach(tag => {
      if (tag && tag.trim()) queryString.append('tags', tag);
    });
  }
  
  // ジャンルの処理（配列）
  if (query.genre && Array.isArray(query.genre)) {
    query.genre.forEach(g => {
      if (g && g.trim()) queryString.append('genre', g);
    });
  }
  
  // ソートとページネーション
  if (query.sort) queryString.append('sort', query.sort);
  if (query.order) queryString.append('order', query.order);
  if (query.page) queryString.append('page', query.page.toString());
  if (query.limit) queryString.append('limit', query.limit.toString());
  
  // エンドポイント構造を修正
  const endpoint = `${ENDPOINTS.investor.qa.search}/company/${companyId}?${queryString.toString()}`;
  return apiFetch<any>(endpoint, "GET", undefined, token);
}

/**
 * QA関連企業取得API
 * GET /investor/qa/companies
 * @param token 認証トークン
 * @returns 企業情報リスト
 */
export async function getInvestorQaCompanies(
  token: string
): Promise<Array<{ 
  companyId: string;
  companyName: string;
}>>{
  return apiFetch<any>(ENDPOINTS.investor.qa.companies, "GET", undefined, token);
}

/**
 * QAいいね/解除API
 * POST /investor/qa/{qa_id}/like
 * @param qaId QA ID
 * @param action いいね操作（'ADD'または'REMOVE'）
 * @param token 認証トークン（オプション）
 * @returns いいね状態
 */
export async function likeInvestorQa(
  qaId: string,
  action: 'ADD' | 'REMOVE',
  token?: string
): Promise<{
  qaId: string;
  likeCount: number;
  isLiked: boolean;
  status: string;
}> {
  const endpoint = ENDPOINTS.investor.qa.like(qaId);
  return apiFetch<any>(endpoint, "POST", { action }, token);
}

/**
 * チャットログ一覧取得API
 * GET /investor/chat/logs
 * @param query クエリパラメータ
 * @param token 認証トークン
 * @returns チャットログリスト
 */
export async function getInvestorChatLogs(
  query: {
    companyId?: string;
    page?: number;
    limit?: number;
  }, 
  token: string
): Promise<{
  chatLogs: Array<{
    chatId: string;
    companyId: string;
    companyName: string;
    title: string;
    lastMessageSnippet: string;
    updatedAt: string;
    totalMessages: number;
  }>;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const queryString = new URLSearchParams();
  
  if (query.companyId) queryString.append('companyId', query.companyId);
  if (query.page) queryString.append('page', query.page.toString());
  if (query.limit) queryString.append('limit', query.limit.toString());
  
  const endpoint = queryString.toString() 
    ? `${ENDPOINTS.investor.chat.history}?${queryString.toString()}`
    : ENDPOINTS.investor.chat.history;
    
  return apiFetch<any>(endpoint, "GET", undefined, token);
}

/**
 * 新規チャット作成API
 * POST /investor/chat/{companyId}
 * @param companyId 企業ID
 * @param message 初期メッセージ
 * @param token 認証トークン
 * @returns チャット作成結果
 */
export async function createInvestorChat(
  companyId: string,
  message: string,
  token: string
): Promise<{
  chatId: string;
  reply: string;
}> {
  const endpoint = ENDPOINTS.investor.chat.new(companyId);
  return apiFetch<any>(endpoint, "POST", { message }, token);
}

/**
 * チャットメッセージ送信API
 * POST /investor/chat/message
 * @param chatId チャットID
 * @param message メッセージ内容
 * @param token 認証トークン
 * @returns ストリーミングレスポンス（特殊処理が必要）
 */
export async function sendInvestorChatMessage(
  chatId: string,
  message: string,
  token: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const config: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      chatId,
      message
    }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.investor.chat.message}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "API Error" }));
      throw new Error(error.message || error.detail || `API Error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          onChunk(data);
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  }
}

/**
 * チャット詳細取得API
 * GET /investor/chat/{chatId}
 * @param chatId チャットID
 * @param token 認証トークン
 * @returns チャット詳細情報
 */
export async function getInvestorChatDetail(
  chatId: string,
  token: string
): Promise<{
  chatId: string;
  companyId: string;
  messages: Array<{
    messageId: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: string;
  }>;
  updatedAt: string;
}> {
  const endpoint = ENDPOINTS.investor.chat.detail(chatId);
  return apiFetch<any>(endpoint, "GET", undefined, token);
}

/**
 * チャット削除API
 * DELETE /investor/chat/{chatId}
 * @param chatId チャットID
 * @param token 認証トークン
 * @returns 削除結果
 */
export async function deleteInvestorChat(
  chatId: string,
  token: string
): Promise<{
  message: string;
}> {
  const endpoint = ENDPOINTS.investor.chat.detail(chatId);
  return apiFetch<any>(endpoint, "DELETE", undefined, token);
}

/**
 * 投資家プロフィール取得API
 * GET /investor/users/me
 * @param token 認証トークン
 * @returns プロフィール情報
 */
export async function getInvestorUser(token: string): Promise<{
  userId: string;
  displayName: string;
  email: string;
  investorType: string;
  investmentExperience: string;
  companyName?: string;
  assetManagementScale?: string;
  bio?: string;
}> {
  return apiFetch<any>(ENDPOINTS.investor.profile.get, "GET", undefined, token);
}

/**
 * 投資家プロフィール更新API
 * PATCH /investor/users/me
 * @param token 認証トークン
 * @param updateData 更新データ
 * @returns 更新結果
 */
export async function updateInvestorUser(
  token: string, 
  updateData: {
    displayName?: string;
    investorType?: string;
    investmentExperience?: string;
    companyName?: string;
    assetManagementScale?: string;
    bio?: string;
  }
): Promise<{
  success: boolean;
  updatedProfile: {
    userId: string;
    displayName: string;
    email: string;
    investorType: string;
    investmentExperience: string;
    companyName?: string;
    assetManagementScale?: string;
    bio?: string;
  };
}> {
  return apiFetch<any>(ENDPOINTS.investor.profile.update, "PATCH", updateData, token);
}

/**
 * トラッキングAPI
 * POST /investor/track
 * @param data トラッキングデータ
 * @param token 認証トークン（オプション）
 * @returns 処理結果
 */
export async function trackInvestorAction(
  data: {
    companyId: string;
    pathname: string;
    action?: string;
  },
  token?: string
): Promise<{
  status: string;
}> {
  return apiFetch<any>(ENDPOINTS.investor.track, "POST", data, token);
}
