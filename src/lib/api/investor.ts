import { ENDPOINTS } from "../../config/api";
import { apiFetch, streamingFetch } from "./client";
import { Industry } from '@/types/industry';

/**
 * 投資家向けAPI
 */

/**
 * 投資家企業一覧取得API
 * 
 * 入力:
 * - token: 認証トークン
 * - query: クエリパラメータ
 *   - keyword: 検索キーワード
 *   - industry: 業界
 *   - followed: フォロー状態
 * 
 * 出力:
 * - companies: 企業一覧
 *   - companyId: 企業ID
 *   - companyName: 企業名
 *   - industry: 業界
 *   - logoUrl: ロゴURL
 *   - isFollowed: フォロー状態
 *   - createdAt: 作成日時
 *   - updatedAt: 更新日時
 *   - securitiesCode: 証券コード
 *   - majorStockExchange: 上場市場
 *   - websiteUrl: ウェブサイトURL
 *   - businessDescription: 事業概要
 * - totalCount: 総件数
 * - totalPages: 総ページ数
 */
export async function getInvestorCompanies(
  token?: string,   
  query?: { 
    keyword?: string; 
    industry?: Industry;
    followed?: string;
  }
): Promise<{ 
  companies: Array<{
    companyId: string;
    companyName: string;
    industry: Industry;
    logoUrl?: string;
    isFollowed: boolean;
    createdAt: string;
    updatedAt: string;
    securitiesCode?: string;
    majorStockExchange?: string;
    websiteUrl?: string;
    businessDescription?: string;
  }>; 
  totalCount: number;
  totalPages: number;
}> {
  const validQuery = query ? Object.fromEntries(
    Object.entries(query).filter(([_, value]) => value !== undefined && value !== '')
  ) : {};

  console.log('Valid query params:', validQuery);

  const queryString = Object.keys(validQuery).length > 0 
    ? new URLSearchParams(validQuery as any).toString()
    : '';
    
  const endpoint = queryString 
    ? `${ENDPOINTS.investor.companies.list}?${queryString}`
    : ENDPOINTS.investor.companies.list;

  console.log('Final endpoint:', endpoint);
    
  return apiFetch<any>(endpoint, "GET", undefined, token, true);
}

/**
 * 投資家企業詳細取得API
 * 
 * 入力:
 * - companyId: 企業ID
 * - token: 認証トークン
 * 
 * 出力:
 * - companyId: 企業ID
 * - companyName: 企業名
 * - industry: 業界
 * - logoUrl: ロゴURL
 * - createdAt: 作成日時
 * - updatedAt: 更新日時
 * - adminUserIds: 管理者ユーザーID配列
 * - companyInfo: 企業情報
 *   - address: 住所
 *   - email: メールアドレス
 *   - tel: 電話番号
 * - isFollowed: フォロー状態
 * - securitiesCode: 証券コード
 * - majorStockExchange: 上場市場
 * - websiteUrl: ウェブサイトURL
 */
export async function getInvestorCompanyDetail(
  companyId: string,
  token?: string
): Promise<{
  companyId: string;
  companyName: string;
  industry: Industry;
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
  securitiesCode?: string;
  majorStockExchange?: string;
  websiteUrl?: string;
}> {
  const endpoint = ENDPOINTS.investor.companies.detail(companyId);
  return apiFetch<any>(endpoint, "GET", undefined, token, true);
}

/**
 * 投資家企業FAQ取得API
 * 
 * 入力:
 * - companyId: 企業ID
 * - token: 認証トークン
 * 
 * 出力:
 * - faqs: FAQ一覧
 *   - qaId: QA ID
 *   - question: 質問
 *   - answer: 回答
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
 * 投資家企業フォロー/アンフォローAPI
 * 
 * 入力:
 * - companyId: 企業ID
 * - action: アクション（follow/unfollow）
 * - token: 認証トークン
 * 
 * 出力:
 * - companyId: 企業ID
 * - isFollowed: フォロー状態
 * - message: メッセージ
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
  return apiFetch<any>(endpoint, "POST", { action }, token, true);
}

/**
 * 投資家QA検索API
 * 
 * 入力:
 * - query: 検索クエリ
 *   - keyword: 検索キーワード
 *   - question_route: 質問ルート
 *   - category: カテゴリ配列
 *   - fiscalPeriod: 会計期間配列
 *   - companyId: 企業ID
 *   - companyName: 企業名
 *   - sort: ソート項目（createdAt/likeCount）
 *   - order: ソート順（asc/desc）
 *   - page: ページ番号
 *   - limit: 1ページあたりの件数
 * - token: 認証トークン
 * 
 * 出力:
 * - results: 検索結果配列
 * - totalCount: 総件数
 * - totalPages: 総ページ数
 */
export async function searchInvestorQa(
  query: {
    keyword?: string;
    question_route?: string;
    category?: string[];
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
  const queryString = new URLSearchParams();
  
  if (query.keyword) queryString.append('keyword', query.keyword);
  if (query.companyId) queryString.append('companyId', query.companyId);
  if (query.companyName) queryString.append('companyName', query.companyName);
  
  if (query.question_route && query.question_route.trim() !== '') {
    queryString.append('question_route', query.question_route);
  }
  
  if (query.category && Array.isArray(query.category)) {
    query.category.forEach(g => {
      if (g && g.trim()) queryString.append('category', g);
    });
  }
  
  if (query.fiscalPeriod && Array.isArray(query.fiscalPeriod)) {
    query.fiscalPeriod.forEach(fp => {
      if (fp && fp.trim()) queryString.append('fiscalPeriod', fp);
    });
  }
  
  if (query.sort) queryString.append('sort', query.sort);
  if (query.order) queryString.append('order', query.order);
  if (query.page) queryString.append('page', query.page.toString());
  if (query.limit) queryString.append('limit', query.limit.toString());
  
  const endpoint = `${ENDPOINTS.investor.qa.search}?${queryString.toString()}`;
  return apiFetch<any>(endpoint, "GET", undefined, token, true);
}

/**
 * 投資家企業QA検索API
 * 
 * 入力:
 * - companyId: 企業ID
 * - query: 検索クエリ
 *   - keyword: 検索キーワード
 *   - question_route: 質問ルート
 *   - category: カテゴリ配列
 *   - fiscalPeriod: 会計期間
 *   - is_faq: FAQフラグ
 *   - sort: ソート項目（createdAt/likeCount）
 *   - order: ソート順（asc/desc）
 *   - page: ページ番号
 *   - limit: 1ページあたりの件数
 * - token: 認証トークン
 * 
 * 出力:
 * - results: QA一覧
 * - totalCount: 総件数
 * - totalPages: 総ページ数
 */
export async function searchInvestorCompanyQa(
  companyId: string,
  query: {
    keyword?: string;
    question_route?: string;
    category?: string[];
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
  
  if (query.question_route && query.question_route.trim() !== '') {
    queryString.append('question_route', query.question_route);
  }
  
  if (query.category && Array.isArray(query.category)) {
    query.category.forEach(g => {
      if (g && g.trim()) queryString.append('category', g);
    });
  }
  
  if (query.sort) queryString.append('sort', query.sort);
  if (query.order) queryString.append('order', query.order);
  if (query.page) queryString.append('page', query.page.toString());
  if (query.limit) queryString.append('limit', query.limit.toString());
  
  const endpoint = `${ENDPOINTS.investor.qa.search}/company/${companyId}?${queryString.toString()}`;
  return apiFetch<any>(endpoint, "GET", undefined, token);
}

/**
 * 投資家QA企業一覧取得API
 * 
 * 入力:
 * - token: 認証トークン
 * 
 * 出力:
 * - 企業一覧（companyId, companyName）
 */
export async function getInvestorQaCompanies(
  token: string
): Promise<Array<{ 
  companyId: string;
  companyName: string;
}>>{
  return apiFetch<any>(ENDPOINTS.investor.qa.companies, "GET", undefined, token, true);
}

/**
 * 投資家QAいいねAPI
 * 
 * 入力:
 * - qaId: QAのID
 * - action: アクション（ADD/REMOVE）
 * - token: 認証トークン
 * 
 * 出力:
 * - qaId: QAのID
 * - likeCount: いいね数
 * - isLiked: いいね状態
 * - status: ステータス
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
  const normalizedAction = action.toLowerCase() as 'add' | 'remove';
  return apiFetch<any>(endpoint, "POST", { action: normalizedAction }, token, true);
}

/**
 * 投資家チャット履歴取得API
 * 
 * 入力:
 * - query: 検索クエリ
 *   - companyId: 企業ID
 *   - page: ページ番号
 *   - limit: 1ページあたりの件数
 * - token: 認証トークン
 * 
 * 出力:
 * - chatLogs: チャット履歴一覧
 * - totalCount: 総件数
 * - currentPage: 現在のページ
 * - totalPages: 総ページ数
 */
export async function getInvestorChatLogs(
  query: {
    companyId?: string;
    page?: number;
    limit?: number;
  }, 
  token?: string
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
    
  return apiFetch<any>(endpoint, "GET", undefined, token, true);
}

/**
 * 投資家新規チャット作成API（空のチャット作成）
 * 
 * 入力:
 * - companyId: 企業ID
 * - token: 認証トークン
 * 
 * 出力:
 * - chatId: チャットID
 */
export async function startNewInvestorChat(
  companyId: string,
  token?: string
): Promise<{
  chatId: string;
}> {
  console.log('startNewInvestorChat関数呼び出し:', {
    companyId,
    token: token ? 'provided' : 'empty'
  });
  
  const endpoint = ENDPOINTS.investor.chat.new(companyId);
  console.log('startNewInvestorChat構築されたエンドポイント:', endpoint);
  
  // 空のオブジェクトをPOST（コーポレート側と同様）
  return apiFetch<any>(endpoint, "POST", {}, token, true);
}

/**
 * 投資家チャット作成API（メッセージ付きチャット作成）
 * 
 * 入力:
 * - companyId: 企業ID
 * - message: メッセージ
 * - token: 認証トークン
 * 
 * 出力:
 * - chatId: チャットID
 * - reply: 返信メッセージ
 */
export async function createInvestorChat(
  companyId: string,
  message: string,
  token?: string
): Promise<{
  chatId: string;
  reply: string;
}> {
  console.log('createInvestorChat関数呼び出し:', {
    companyId,
    companyIdType: typeof companyId,
    message,
    messageType: typeof message,
    token: token ? 'provided' : 'empty'
  });
  
  const endpoint = ENDPOINTS.investor.chat.newWithMessage(companyId);
  console.log('createInvestorChat構築されたエンドポイント:', endpoint);
  console.log('createInvestorChatリクエストボディ:', { message });
  
  return apiFetch<any>(endpoint, "POST", { message }, token, true);
}

/**
 * 投資家チャットメッセージ送信API
 * 
 * 入力:
 * - chatId: チャットID
 * - message: メッセージ
 * - onChunk: チャンク受信時のコールバック
 * - token: 認証トークン
 * - onStart: ストリーミング開始時のコールバック（オプション）
 * - onEnd: ストリーミング完了時のコールバック（オプション）
 * - onError: エラー時のコールバック（オプション）
 * 
 * 出力:
 * - void
 */
export async function sendInvestorChatMessage(
  chatId: string,
  message: string,
  onChunk: (chunk: string) => void,
  token?: string,
  onStart?: () => void,
  onEnd?: (fullResponse: string) => void,
  onError?: (error: string) => void
): Promise<void> {
  const endpoint = ENDPOINTS.investor.chat.message(chatId);
  
  console.log('投資家チャットメッセージ送信開始:', { chatId, message });
  console.log('sendInvestorChatMessage詳細パラメータ:', {
    chatId,
    chatIdType: typeof chatId,
    message,
    messageType: typeof message,
    messageLength: message.length,
    endpoint,
    token: token ? 'provided' : 'empty'
  });
  
  const requestBody = {
    chatId,
    message
  };
  console.log('sendInvestorChatMessageリクエストボディ:', requestBody);
  
  return streamingFetch(
    endpoint, 
    requestBody, 
    onChunk,
    onStart,
    onEnd,
    onError
  );
}

/**
 * 投資家チャット詳細取得API
 * 
 * 入力:
 * - chatId: チャットID
 * - token: 認証トークン
 * 
 * 出力:
 * - chatId: チャットID
 * - companyId: 企業ID
 * - messages: メッセージ一覧
 * - updatedAt: 更新日時
 */
export async function getInvestorChatDetail(
  chatId: string,
  token?: string
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
  return apiFetch<any>(endpoint, "GET", undefined, token, true);
}

/**
 * 投資家チャット削除API
 * 
 * 入力:
 * - chatId: チャットID
 * - token: 認証トークン
 * 
 * 出力:
 * - message: 削除完了メッセージ
 */
export async function deleteInvestorChat(
  chatId: string,
  token?: string
): Promise<{
  message: string;
}> {
  const endpoint = ENDPOINTS.investor.chat.detail(chatId);
  return apiFetch<any>(endpoint, "DELETE", undefined, token, true);
}

/**
 * 投資家ユーザー情報取得API
 * 
 * 入力:
 * - token: 認証トークン
 * 
 * 出力:
 * - userId: ユーザーID
 * - display_name: 表示名
 * - email: メールアドレス
 * - investor_type: 投資家タイプ
 * - investmentExperience: 投資経験
 * - companyName: 会社名（オプション）
 * - asset_scale: 資産運用規模（オプション）
 * - bio: 自己紹介（オプション）
 */
export async function getInvestorUser(token: string): Promise<{
  userId: string;
  display_name: string;
  email: string;
  investor_type: string;
  investmentExperience: string;
  companyName?: string;
  asset_scale?: string;
  bio?: string;
}> {
  return apiFetch<any>(ENDPOINTS.investor.profile.get, "GET", undefined, token, true);
}

/**
 * 投資家ユーザー情報更新API
 * 
 * 入力:
 * - token: 認証トークン
 * - updateData: 更新するユーザー情報
 *   - display_name: 表示名（オプション）
 *   - investor_type: 投資家タイプ（オプション）
 *   - investmentExperience: 投資経験（オプション）
 *   - companyName: 会社名（オプション）
 *   - asset_scale: 資産運用規模（オプション）
 *   - bio: 自己紹介（オプション）
 * 
 * 出力:
 * - success: 更新成功フラグ
 * - updatedProfile: 更新後のユーザー情報
 */
export async function updateInvestorUser(
  token: string, 
  updateData: {
    display_name?: string;
    investor_type?: string;
    investmentExperience?: string;
    companyName?: string;
    asset_scale?: string;
    bio?: string;
  }
): Promise<{
  success: boolean;
  updatedProfile: {
    userId: string;
    display_name: string;
    email: string;
    investor_type: string;
    investmentExperience: string;
    companyName?: string;
    asset_scale?: string;
    bio?: string;
  };
}> {
  return apiFetch<any>(ENDPOINTS.investor.profile.update, "PATCH", updateData, token, true);
}

/**
 * 投資家アクション追跡API
 * 
 * 入力:
 * - data: アクションデータ
 *   - companyId: 企業ID
 *   - pathname: アクセスパス
 *   - action: アクション種別（オプション）
 * - token: 認証トークン（オプション）
 * 
 * 出力:
 * - status: 処理ステータス
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


/**
 * 企業ごとの最新QA取得API
 * 
 * 入力:
 * - token: 認証トークン（オプション）
 * - limit: 取得件数（デフォルト: 10）
 * 
 * 出力:
 * - results: 企業ごとの最新QA一覧
 *   - qaId: QA ID
 *   - title: タイトル
 *   - question: 質問
 *   - answer: 回答
 *   - companyId: 企業ID
 *   - companyName: 企業名（オプション）
 *   - likeCount: いいね数
 *   - question_route: 質問ルート（オプション）
 *   - source: ソース配列
 *   - categories: カテゴリ配列（バックエンドの実際のフィールド名）
 *   - fiscalPeriod: 会計期間（オプション）
 *   - reviewStatus: レビューステータス
 *   - status: ステータス
 *   - createdAt: 作成日時
 *   - updatedAt: 更新日時
 * - totalCount: 総件数
 * - totalPages: 総ページ数
 */
export async function getLatestQAsByCompany(
  token?: string,
  limit: number = 5
): Promise<{
  results: Array<{
    qaId: string;
    title: string;
    question: string;
    answer: string;
    companyId: string;
    companyName?: string;
    likeCount: number;
    question_route?: string;
    source: string[];
    categories: string[];
    fiscalPeriod?: string;
    reviewStatus: 'DRAFT' | 'PENDING' | 'PUBLISHED';
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    updatedAt: string;
  }>;
  totalCount: number;
  totalPages: number;
}> {
  const queryString = new URLSearchParams();
  if (limit) queryString.append('limit', limit.toString());
  
  const endpoint = queryString.toString() 
    ? `${ENDPOINTS.investor.qa.latestByCompany}?${queryString.toString()}`
    : ENDPOINTS.investor.qa.latestByCompany;
    
  return apiFetch<any>(endpoint, "GET", undefined, token, true, true);
} 