/**
src/libs/api.ts
 * @description フロントエンドからの HTTP 通信（fetch）を集約し、各エンドポイントを関数化
 * 
 * - 認証トークンの付与やリフレッシュトークンによる再認証処理はこのレイヤーで行う想定
 * - MSW との連携を見据え、最終的には fetch をモックに差し替えやすい形にしておく
 */

import {
    // 認証系
    AuthLoginRequest,
    AuthLoginResponse,
    AuthGuestRequest,
    AuthGuestResponse,
    AuthSignupRequest,
    AuthSignupResponse,
    AuthPasswordResetRequest,
    AuthPasswordResetResponse,
    // ユーザー管理系
    UserProfileResponse,
    UpdateUserProfileRequest,
    UpdateUserProfileResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
    NotificationSettingRequest,
    NotificationSettingResponse,
    DeleteAccountRequest,
    DeleteAccountResponse,
    // 企業系
    CompanyListRequest,
    CompanyListResponse,
    CompanyDetailResponse,
    FollowCompanyRequest,
    FollowCompanyResponse,
    // QA系
    QAListRequest,
    QAListResponse,
    LikeQARequest,
    LikeQAResponse,
    BookmarkQARequest,
    BookmarkQAResponse,
    SearchQARequest,
    SearchQAResponse,
    // チャット系
    ChatRequest,
    ChatResponse,
    ChatLogListRequest,
    ChatLogListResponse,
    DeleteChatLogRequest,
    DeleteChatLogResponse,
    ArchiveChatLogRequest,
    ArchiveChatLogResponse,
    ChatSessionDetailResponse,
  } from "@/types/api";
  
  import { API_BASE_URL, DEFAULT_HEADERS } from "@/config/api";
  
  //----------------------------------
  // 共通のフェッチラッパ
  //----------------------------------
  async function fetcher<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
  
    // 例: 認証トークンを取得（Cookie or LocalStorage 等）
    const token = getAuthToken(); // 実装はプロジェクトに合わせて
  
    // ヘッダー合体
    const headers = {
      ...DEFAULT_HEADERS,
      ...options.headers,
    };
  
    // 認証ヘッダを付与（必要な場合）
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  
    // fetch オプション
    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };
  
    // fetch 実行
    const response = await fetch(url, fetchOptions);
  
    // ステータス別のハンドリング
    if (!response.ok) {
      // 401 や 403 の場合にリフレッシュトークン処理等を行う例
      if (response.status === 401) {
        // もしトークンリフレッシュが必要ならここで実施したり、別関数に切り出して再試行するなど
        // 例:
        // await handleTokenRefresh();
        // return fetcher<T>(endpoint, options);
      }
      // 他エラー時：レスポンスメッセージを投げる
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        errorBody?.message || `Fetch error (${response.status}) at: ${endpoint}`
      );
    }
  
    // JSON パース
    const data = (await response.json().catch(() => null)) as T;
    return data;
  }
  
  //----------------------------------
  // 認証トークン取得サンプル（LocalStorageなど）
  //----------------------------------
  function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("accessToken") || null;
  }
  
  //----------------------------------
  // 認証 / Auth 系 API
  //----------------------------------
  
  /** ログイン */
  export async function login(
    payload: AuthLoginRequest
  ): Promise<AuthLoginResponse> {
    return fetcher<AuthLoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  
  /** ゲスト用ログイン */
  export async function guestLogin(
    payload: AuthGuestRequest
  ): Promise<AuthGuestResponse> {
    return fetcher<AuthGuestResponse>("/auth/guest", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  
  /** 新規ユーザー登録 */
  export async function signUp(
    payload: AuthSignupRequest
  ): Promise<AuthSignupResponse> {
    return fetcher<AuthSignupResponse>("/users/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  
  /** パスワードリセット(メール送信) */
  export async function resetPassword(
    payload: AuthPasswordResetRequest
  ): Promise<AuthPasswordResetResponse> {
    return fetcher<AuthPasswordResetResponse>("/auth/password-reset", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  
  /** ログアウト (バックエンドでトークン無効化) */
  export async function logout(refreshToken: string): Promise<{ message: string }> {
    return fetcher<{ message: string }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }
  
  //----------------------------------
  // ユーザー / Account 系 API
  //----------------------------------
  
  /** マイプロフィール取得 */
  export async function getMyProfile(): Promise<UserProfileResponse> {
    return fetcher<UserProfileResponse>("/users/me");
  }
  
  /** マイプロフィール更新 */
  export async function updateMyProfile(
    payload: UpdateUserProfileRequest
  ): Promise<UpdateUserProfileResponse> {
    return fetcher<UpdateUserProfileResponse>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }
  
  /** パスワード変更 */
  export async function changePassword(
    payload: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    return fetcher<ChangePasswordResponse>("/users/me/password", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }
  
  /** 通知設定取得 */
  export async function getNotificationSetting(): Promise<NotificationSettingResponse> {
    return fetcher<NotificationSettingResponse>("/users/me/notification-setting");
  }
  
  /** 通知設定更新 */
  export async function updateNotificationSetting(
    payload: NotificationSettingRequest
  ): Promise<NotificationSettingResponse> {
    return fetcher<NotificationSettingResponse>("/users/me/notification-setting", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
  
  /** アカウント削除(退会) */
  export async function deleteMyAccount(
    payload: DeleteAccountRequest
  ): Promise<DeleteAccountResponse> {
    return fetcher<DeleteAccountResponse>("/users/me", {
      method: "DELETE",
      body: JSON.stringify(payload),
    });
  }
  
  //----------------------------------
  // 企業 / Company 系 API
  //----------------------------------
  
  /** 企業一覧取得 */
  export async function fetchCompanies(
    params?: CompanyListRequest
  ): Promise<CompanyListResponse> {
    // クエリパラメータ組み立て
    const query = new URLSearchParams();
    if (params?.q) query.append("search", params.q);
    if (params?.industry) query.append("industry", params.industry);
    if (params?.followedOnly) query.append("followOnly", String(params.followedOnly));
    if (params?.sort) query.append("sort", params.sort);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
  
    return fetcher<CompanyListResponse>(`/companies?${query.toString()}`);
  }
  
  /** 企業詳細取得 */
  export async function fetchCompanyDetail(
    companyId: string
  ): Promise<CompanyDetailResponse> {
    return fetcher<CompanyDetailResponse>(`/companies/${companyId}`);
  }
  
  /** 企業フォロー or 解除 */
  export async function toggleFollowCompany(
    payload: FollowCompanyRequest
  ): Promise<FollowCompanyResponse> {
    // エンドポイント設計に応じて POST or DELETE 分けるなど適宜対応
    return fetcher<FollowCompanyResponse>(`/companies/${payload.companyId}/follow`, {
      method: "POST",
    });
  }
  
  //----------------------------------
  // QA / Q&A 系 API
  //----------------------------------
  
  /** QA一覧取得 */
  export async function fetchQAList(params?: QAListRequest): Promise<QAListResponse> {
    const query = new URLSearchParams();
    if (params?.companyId) query.append("companyId", params.companyId);
    if (params?.keyword) query.append("keyword", params.keyword);
    if (params?.sort) query.append("sort", params.sort);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
  
    return fetcher<QAListResponse>(`/qa?${query.toString()}`);
  }
  
  /** QA いいね登録/解除 */
  export async function likeQA(payload: LikeQARequest): Promise<LikeQAResponse> {
    // 例: POST /qas/:qaId/like
    return fetcher<LikeQAResponse>(`/qas/${payload.qaId}/like`, {
      method: "POST",
    });
  }
  
  /** QA ブックマーク登録/解除 */
  export async function bookmarkQA(
    payload: BookmarkQARequest
  ): Promise<BookmarkQAResponse> {
    // 例: POST /qas/:qaId/bookmark
    return fetcher<BookmarkQAResponse>(`/qas/${payload.qaId}/bookmark`, {
      method: "POST",
    });
  }
  
  /** QA 横断検索 */
  export async function searchQA(params?: SearchQARequest): Promise<SearchQAResponse> {
    const query = new URLSearchParams();
    if (params?.keyword) query.append("keyword", params.keyword);
    if (params?.company) query.append("company", params.company);
    if (params?.sort) query.append("sort", params.sort);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
  
    return fetcher<SearchQAResponse>(`/qa/search?${query.toString()}`);
  }
  
  //----------------------------------
  // Chat / チャット系 API
  //----------------------------------
  
  /** チャット送信 */
  export async function sendChat(payload: ChatRequest): Promise<ChatResponse> {
    return fetcher<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  
  /** チャット履歴一覧取得 */
  export async function fetchChatLogs(
    params?: ChatLogListRequest
  ): Promise<ChatLogListResponse> {
    const query = new URLSearchParams();
    if (params?.keyword) query.append("keyword", params.keyword);
    if (params?.archive) query.append("archive", String(params.archive));
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
  
    return fetcher<ChatLogListResponse>(`/chat-logs?${query.toString()}`);
  }
  
  /** チャット履歴削除 */
  export async function deleteChatLog(
    payload: DeleteChatLogRequest
  ): Promise<DeleteChatLogResponse> {
    return fetcher<DeleteChatLogResponse>(`/chat-logs/${payload.sessionId}`, {
      method: "DELETE",
    });
  }
  
  /** チャット履歴アーカイブ */
  export async function archiveChatLog(
    payload: ArchiveChatLogRequest
  ): Promise<ArchiveChatLogResponse> {
    return fetcher<ArchiveChatLogResponse>(`/chat-logs/${payload.sessionId}/archive`, {
      method: "POST",
    });
  }
  
  /** チャットセッション詳細取得 (メッセージ一覧) */
  export async function fetchChatSessionDetail(
    sessionId: string
  ): Promise<ChatSessionDetailResponse> {
    return fetcher<ChatSessionDetailResponse>(`/chats/${sessionId}/messages`);
  }
  
  /** 企業別チャット送信 (例: /companies/:companyId/chat) */
  export async function sendCompanyChat(
    companyId: string,
    message: string
  ): Promise<ChatResponse> {
    return fetcher<ChatResponse>(`/companies/${companyId}/chat`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }
  
  //----------------------------------
  // 例: リフレッシュトークン処理 (任意で実装)
  //----------------------------------
  /*
  async function handleTokenRefresh() {
    // ローカルに保存されているリフレッシュトークンを使い /auth/refresh を呼ぶ
    // 新しいトークンを受け取ったら localStorage に保存し直す
    // ...
  }
  */
  
  