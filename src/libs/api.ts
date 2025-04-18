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
  DeleteAccountResponse,
  QA,
  Company,
  ChatSession,
  ChatMessage,
  CompanyInfo, 
  DashboardData
} from "../types";

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

  // リクエスト情報のログ出力
  console.log(`API ${method} Request to ${endpoint}:`, {
    url: API_BASE_URL + endpoint,
    headers,
    body: data instanceof FormData ? "FormData" : data
  });

  try {
    const response = await fetch(API_BASE_URL + endpoint, config);
    let result;
    try {
      result = await response.json();
    } catch (e) {
      console.error("Failed to parse response JSON:", e);
      result = { message: "Response is not JSON" };
    }
    
    if (!response.ok) {
      console.error("API Error Response:", {
        endpoint,
        status: response.status,
        statusText: response.statusText,
        data: result
      });
      throw new Error(result.message || result.detail || `API Error: ${response.status} ${response.statusText}`);
    }
    
    // 成功時のレスポンスもログに出力
    console.log(`API ${method} Response from ${endpoint}:`, result);
    return result;
  } catch (error) {
    console.error(`API Fetch Error (${method} ${endpoint}):`, error);
    throw error;
  }
}

/* =======================
   共通認証・ユーザー管理 API
   ======================= */

export async function login(requestData: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(ENDPOINTS.login, "POST", requestData);
}

export async function refreshToken(requestData: RefreshRequest): Promise<RefreshResponse> {
  return apiFetch<RefreshResponse>(ENDPOINTS.refresh, "POST", requestData);
}

export async function passwordReset(requestData: { email: string }): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(ENDPOINTS.passwordReset, "POST", requestData);
}

export async function registerUser(requestData: {
  email: string;
  password: string;
  userName: string;
  userType: string;
}): Promise<{ userId: string; message: string }> {
  return apiFetch<{ userId: string; message: string }>(ENDPOINTS.register, "POST", requestData);
}

export async function getUser(token: string): Promise<GetUserResponse> {
  return apiFetch<GetUserResponse>(ENDPOINTS.getMe, "GET", undefined, token);
}

export async function updateUser(token: string, updateData: UpdateUserRequest): Promise<UpdateUserResponse> {
  return apiFetch<UpdateUserResponse>(ENDPOINTS.updateMe, "PATCH", updateData, token);
}

export async function logout(requestData: LogoutRequest, token: string): Promise<LogoutResponse> {
  return apiFetch<LogoutResponse>(ENDPOINTS.logout, "POST", requestData, token);
}

export async function search(query: { keyword: string; type: string }): Promise<{ results: any[]; totalCount: number }> {
  const queryString = new URLSearchParams(query as any).toString();
  return apiFetch<{ results: any[]; totalCount: number }>(`${ENDPOINTS.search}?${queryString}`, "GET");
}

/* =======================
   企業向け API
   ======================= */

export async function corporateLogin(requestData: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(ENDPOINTS.corporateLogin, "POST", requestData);
}

export async function corporateLogout(requestData: LogoutRequest, token: string): Promise<LogoutResponse> {
  return apiFetch<LogoutResponse>(ENDPOINTS.corporateLogout, "POST", requestData, token);
}

/**
 * ダッシュボード表示 API
 * GET /corporate/dashboard?period=...&type=...
 * ※ レスポンスは IR API の仕様に合わせ、DashboardData 型を返す
 */
export async function getCorporateDashboard(token: string, query: { period: string }): Promise<DashboardData> {
  const queryString = new URLSearchParams(query as any).toString();
  return apiFetch<DashboardData>(`${ENDPOINTS.corporateDashboard}?${queryString}`, "GET", undefined, token);
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

  const apiUrl = `${ENDPOINTS.corporateQaSearch}?${queryString.toString()}`;
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
  return apiFetch<{ qaId: string }>(ENDPOINTS.corporateQa, "POST", data, token);
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
    `${ENDPOINTS.corporateQa}/${qaId}`,
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
    `${ENDPOINTS.corporateQa}/${qaId}`,
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
  return apiFetch<UploadResponse>(ENDPOINTS.corporateQaUpload, "POST", formData, token);
}

export async function batchCreateCorporateQa(token: string, qas: CreateQARequest[]): Promise<{ createdCount: number; message: string }> {
  return apiFetch<{ createdCount: number; message: string }>(ENDPOINTS.corporateQaBatchCreate, "POST", { qas }, token);
}

export async function getCorporateDrafts(token: string, query?: Record<string, string>): Promise<{ drafts: any[] }> {
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
  return apiFetch<{ drafts: any[] }>(`${ENDPOINTS.corporateDrafts}${queryString}`, "GET", undefined, token);
}

export async function getCorporateDraftDetail(token: string, draftId: string): Promise<{ draftId: string; messages: ChatMessage[] }> {
  const endpoint = `${ENDPOINTS.corporateDrafts}/${draftId}`;
  return apiFetch<{ draftId: string; messages: ChatMessage[] }>(endpoint, "GET", undefined, token);
}

export async function postCorporateIrChat(token: string, requestData: ChatRequest & { draftId?: string; options?: { tone: string; maxLength: number } }): Promise<ChatResponse> {
  return apiFetch<ChatResponse>(ENDPOINTS.corporateIrChat, "POST", requestData, token);
}

export async function createCorporateMailDraft(token: string, requestData: MailDraftRequest): Promise<MailDraftResponse> {
  return apiFetch<MailDraftResponse>(ENDPOINTS.corporateMailDraft, "POST", requestData, token);
}

export async function getCorporateCompanySettings(token: string): Promise<CompanyInfo> {
  return apiFetch<CompanyInfo>(ENDPOINTS.corporateCompanySettings, "GET", undefined, token);
}

export async function updateCorporateCompanySettings(token: string, updateData: CompanyInfo): Promise<CompanyInfo & { message: string }> {
  return apiFetch<CompanyInfo & { message: string }>(ENDPOINTS.corporateCompanySettings, "PUT", updateData, token);
}

export async function updateCorporateAccountSettings(token: string, updateData: { currentPassword: string; newPassword: string; newEmail: string }): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(ENDPOINTS.corporateAccountSettings, "PUT", updateData, token);
}

/* =======================
   投資家向け API
   ======================= */

export async function investorLogin(requestData: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(ENDPOINTS.investorLogin, "POST", requestData);
}

export async function investorLogout(requestData: LogoutRequest, token: string): Promise<LogoutResponse> {
  return apiFetch<LogoutResponse>(ENDPOINTS.investorLogout, "POST", requestData, token);
}

export async function investorGuest(requestData: GuestLoginRequest): Promise<GuestLoginResponse> {
  return apiFetch<GuestLoginResponse>(ENDPOINTS.investorGuest, "POST", requestData);
}

export async function getInvestorCompanies(token: string, query: { keyword?: string; sort?: string; industry?: string }): Promise<{ companies: any[]; totalCount: number }> {
  const queryString = new URLSearchParams(query as any).toString();
  return apiFetch<{ companies: any[]; totalCount: number }>(`${ENDPOINTS.investorCompanies}?${queryString}`, "GET", undefined, token);
}

export async function getInvestorCompanyDetail(token: string, companyId: string): Promise<any> {
  const endpoint = `${ENDPOINTS.investorCompanies}/${companyId}`;
  return apiFetch<any>(endpoint, "GET", undefined, token);
}

export async function getInvestorCompanyQa(token: string, companyId: string, query?: Record<string, string>): Promise<{ qaList: any[]; totalCount: number }> {
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
  const endpoint = `${ENDPOINTS.investorCompanies}/${companyId}/qa${queryString}`;
  return apiFetch<{ qaList: any[]; totalCount: number }>(endpoint, "GET", undefined, token);
}

export async function searchInvestorQa(token: string, query: Record<string, string>): Promise<{ results: any[]; totalCount: number }> {
  const queryString = new URLSearchParams(query).toString();
  return apiFetch<{ results: any[]; totalCount: number }>(`${ENDPOINTS.investorQaSearch}?${queryString}`, "GET", undefined, token);
}

export async function likeInvestorQa(token: string, qaId: string, action: 'add' | 'remove'): Promise<LikeQAResponse> {
  const endpoint = `${ENDPOINTS.investorQa}/${qaId}/like`;
  return apiFetch<LikeQAResponse>(endpoint, "POST", { action }, token);
}

export async function bookmarkInvestorQa(token: string, qaId: string, action: 'add' | 'remove'): Promise<BookmarkQAResponse> {
  const endpoint = `${ENDPOINTS.investorQa}/${qaId}/bookmark`;
  return apiFetch<BookmarkQAResponse>(endpoint, "POST", { action }, token);
}

export async function getInvestorChatLogs(token: string, query?: Record<string, string>): Promise<{ chatLogs: any[]; totalCount: number }> {
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
  return apiFetch<{ chatLogs: any[]; totalCount: number }>(`${ENDPOINTS.investorChatLogs}${queryString}`, "GET", undefined, token);
}

export async function deleteInvestorChatLog(token: string, chatId: string): Promise<{ message: string }> {
  const endpoint = `${ENDPOINTS.investorChatLogs}/${chatId}`;
  return apiFetch<{ message: string }>(endpoint, "DELETE", undefined, token);
}

export async function archiveInvestorChatLog(token: string, chatId: string, action: 'archive' | 'unarchive'): Promise<ArchiveChatLogResponse> {
  const endpoint = `${ENDPOINTS.investorChatLogs}/${chatId}/archive`;
  return apiFetch<ArchiveChatLogResponse>(endpoint, "PATCH", { action }, token);
}

export async function getInvestorUser(token: string): Promise<GetUserResponse> {
  return apiFetch<GetUserResponse>(ENDPOINTS.investorUser, "GET", undefined, token);
}

export async function updateInvestorUser(token: string, updateData: UpdateUserRequest): Promise<UpdateUserResponse> {
  return apiFetch<UpdateUserResponse>(ENDPOINTS.investorUser, "PATCH", updateData, token);
}

export async function changeInvestorPassword(token: string, requestData: ChangePasswordRequest): Promise<ChangePasswordResponse> {
  const endpoint = `${ENDPOINTS.investorUser}/password`;
  return apiFetch<ChangePasswordResponse>(endpoint, "PATCH", requestData, token);
}

export async function updateInvestorNotification(token: string, requestData: UpdateNotificationSettingRequest): Promise<UpdateNotificationSettingResponse> {
  const endpoint = `${ENDPOINTS.investorUser}/notification`;
  return apiFetch<UpdateNotificationSettingResponse>(endpoint, "PATCH", requestData, token);
}

export async function deleteInvestorAccount(token: string, requestData: DeleteAccountRequest): Promise<DeleteAccountResponse> {
  return apiFetch<DeleteAccountResponse>(ENDPOINTS.investorUser, "DELETE", requestData, token);
}

// 管理者用 企業アカウント登録 API
export async function adminRegisterCompany(
  requestData: Omit<Company, "companyId" | "createdAt" | "updatedAt" | "adminUserIds">
): Promise<{ companyId: string; message: string }> {
  return apiFetch<{ companyId: string; message: string }>(
    ENDPOINTS.adminCompanyRegister,
    "POST",
    requestData
  );
}

// 管理者用 企業ユーザー（チームメンバー）登録 API
export async function adminRegisterCorporateUser(
  requestData: {
    email: string;
    password: string;
    company_id: string;
    is_admin: boolean;
  }
): Promise<{ userId: string; company_id: string; message: string }> {
  return apiFetch<{ userId: string; company_id: string; message: string }>(
    ENDPOINTS.adminCorporateRegister,
    "POST",
    requestData
  );
}

/**
 * 企業用チャット履歴取得API
 * @param token 認証トークン
 * @param page ページ番号
 * @param pageSize ページサイズ
 * @returns チャット履歴
 */
export async function getCorporateChatHistory(
  token: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{
  chatLogs: {
    chatId: string;
    userId: string;
    title: string;
    lastMessageSnippet: string;
    updatedAt: string;
    totalMessages: number;
  }[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const queryString = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString()
  }).toString();
  
  return apiFetch<{
    chatLogs: {
      chatId: string;
      userId: string;
      title: string;
      lastMessageSnippet: string;
      updatedAt: string;
      totalMessages: number;
    }[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>(`${ENDPOINTS.corporateIrChatHistory}?${queryString}`, "GET", undefined, token);
}

/**
 * 企業用チャット詳細取得API
 * @param token 認証トークン
 * @param chatId チャットID
 * @returns チャットの詳細情報
 */
export async function getCorporateChatDetail(
  token: string,
  chatId: string
): Promise<{
  chatId: string;
  messages: ChatMessage[];
}> {
  return apiFetch<{
    chatId: string;
    messages: ChatMessage[];
  }>(`${ENDPOINTS.corporateIrChat}/${chatId}`, "GET", undefined, token);
}

/**
 * 企業用新規チャット開始API
 * @param token 認証トークン
 * @param requestData チャット開始データ
 * @returns AIの応答とチャットID
 */
export async function startNewCorporateChat(
  token: string,
  requestData: {
    userId: string;
  }
): Promise<{
  chatId: string;
  reply: string;
}> {
  return apiFetch<{
    chatId: string;
    reply: string;
  }>(ENDPOINTS.corporateIrChatNew, "POST", requestData, token);
}

/**
 * 企業用チャットメッセージ送信API
 * @param token 認証トークン
 * @param chatId チャットID
 * @param message 送信するメッセージ
 * @returns AIの応答
 */
export async function sendCorporateChatMessage(
  token: string,
  chatId: string,
  message: string
): Promise<{
  chatId: string;
  reply: string;
}> {
  return apiFetch<{
    chatId: string;
    reply: string;
  }>(`${ENDPOINTS.corporateIrChat}/${chatId}/message`, "POST", { message }, token);
}

/**
 * 企業向けチャットメッセージ送信（ストリーミング）
 */
export async function sendCorporateChatMessageStream(
  token: string,
  chatId: string,
  message: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const config: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ message }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.corporateIrChat}/${chatId}/message`, config);
    
    if (!response.ok) {
      const error = await response.json();
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
