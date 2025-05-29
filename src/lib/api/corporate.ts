import { ENDPOINTS } from "../../config/api";
import { apiFetch, streamingFetch } from "./client";
import {
  CreateQARequest,
  UploadRequest,
  UploadResponse,
  ChatRequest,
  ChatResponse,
  MailDraftRequest,
  MailDraftResponse,
  QA,
  CompanyInfo,
  DashboardData,
  ChatMessage,
  FileManagementResponse,
  FileCollection,
} from "../../types";
import {
  ChatHistoryResponse,
  ChatDetailResponse,
  IRChatResponse,
} from '@/types/api';

/**
 * 企業向けAPI
 */

/**
 * ダッシュボードデータ取得API
 * 
 * 入力:
 * - query.period: 期間
 * 
 * 出力:
 * - DashboardData: ダッシュボードに表示するデータ
 */
export async function getCorporateDashboard(query: { period: string }): Promise<DashboardData> {
  const qs = new URLSearchParams(query).toString();
  const endpoint = `${ENDPOINTS.corporate.dashboard}?${qs}`;
  return apiFetch<DashboardData>(endpoint, "GET", undefined, undefined, true, true);
}

/**
 * QA検索API
 * 
 * 入力:
 * - query.keyword: 検索キーワード
 * - query.review_status: レビューステータス
 * - query.question_route: 質問ルート
 * - query.genre: ジャンル配列
 * - query.fiscalPeriod: 会計期間配列
 * - query.sort: ソート項目
 * - query.order: ソート順
 * - query.page: ページ番号
 * - query.limit: 1ページあたりの件数
 * 
 * 出力:
 * - results: QA配列
 * - totalCount: 総件数
 * - totalPages: 総ページ数
 */
export async function searchCorporateQa(
  query: {
    keyword?: string;
    review_status?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
    question_route?: string;
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
  
  if (query.keyword) queryString.append('keyword', query.keyword);
  if (query.review_status) queryString.append('review_status', query.review_status);
  
  if (query.question_route && query.question_route.trim() !== '') {
    queryString.append('question_route', query.question_route);
  }
  
  if (query.genre && Array.isArray(query.genre) && query.genre.length > 0) {
    const validGenres = query.genre.filter(g => g && g.trim() !== '');
    validGenres.forEach(g => queryString.append('genre', g));
  }
  if (query.fiscalPeriod && Array.isArray(query.fiscalPeriod) && query.fiscalPeriod.length > 0) {
    const validPeriods = query.fiscalPeriod.filter(fp => fp && fp.trim() !== '');
    validPeriods.forEach(fp => queryString.append('fiscalPeriod', fp));
  }
  
  queryString.append('sort', query.sort || 'createdAt');
  queryString.append('order', query.order || 'desc');
  
  if (query.page) queryString.append('page', query.page.toString());
  if (query.limit) queryString.append('limit', query.limit.toString());

  const endpoint = `${ENDPOINTS.corporate.qa.search}?${queryString.toString()}`;
  return apiFetch<{
    results: QA[];
    totalCount: number;
    totalPages: number;
  }>(endpoint, "GET", undefined, undefined, true, true);
}

/**
 * QA作成API
 * 
 * 入力:
 * - data.title: タイトル
 * - data.question: 質問
 * - data.answer: 回答
 * - data.question_route: 質問ルート
 * - data.source: ソース配列
 * - data.genre: ジャンル配列
 * - data.fiscalPeriod: 会計期間
 * - data.reviewStatus: レビューステータス
 * 
 * 出力:
 * - qaId: 作成されたQAのID
 */
export async function createCorporateQa(
  data: {
    title: string;
    question: string;
    answer: string;
    question_route?: string;
    source?: string[];
    genre?: string[];
    fiscalPeriod?: string;
    reviewStatus: QA['reviewStatus'];
  }
): Promise<{ qaId: string }> {
  return apiFetch<{ qaId: string }>(ENDPOINTS.corporate.qa.create, "POST", data, undefined, true, true);
}

/**
 * QA更新API
 * 
 * 入力:
 * - qaId: 更新対象のQA ID
 * - data: 更新するフィールドと値
 * 
 * 出力:
 * - qaId: 更新されたQAのID
 * - updatedFields: 更新されたフィールドと値
 */
export async function updateCorporateQa(
  qaId: string,
  data: {
    title?: string;
    question?: string;
    answer?: string;
    question_route?: string;
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
    undefined,
    true,
    true
  );
}

/**
 * QA削除API
 * 
 * 入力:
 * - qaId: 削除対象のQA ID
 * 
 * 出力:
 * - message: 削除完了メッセージ
 */
export async function deleteCorporateQa(qaId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    ENDPOINTS.corporate.qa.delete(qaId),
    "DELETE",
    undefined,
    undefined,
    true,
    true
  );
}

/**
 * QAファイルアップロードAPI
 * 
 * 入力:
 * - uploadData.file: アップロードファイル
 * - uploadData.meta: メタデータ
 * 
 * 出力:
 * - UploadResponse: アップロード結果
 */
export async function uploadCorporateQa(uploadData: UploadRequest): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", uploadData.file);
  if (uploadData.meta) {
    formData.append("metadata", JSON.stringify(uploadData.meta));
  }
  return apiFetch<UploadResponse>(ENDPOINTS.corporate.qa.upload, "POST", formData, undefined, true, true);
}

/**
 * QA一括作成API
 * 
 * 入力:
 * - qas: 作成するQAの配列
 * 
 * 出力:
 * - createdCount: 作成されたQAの数
 * - message: 完了メッセージ
 */
export async function batchCreateCorporateQa(
  qas: CreateQARequest[]
): Promise<{ createdCount: number; message: string }> {
  return apiFetch<{ createdCount: number; message: string }>(ENDPOINTS.corporate.qa.batchCreate, "POST", { qas }, undefined, true, true);
}

/**
 * 下書き一覧取得API
 * 
 * 入力:
 * - query: クエリパラメータ
 * 
 * 出力:
 * - drafts: 下書き配列
 */
export async function getCorporateDrafts(
  query?: Record<string, string>
): Promise<{ drafts: any[] }> {
  const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
  const endpoint = `${ENDPOINTS.corporate.ir.drafts}${queryString}`;
  return apiFetch<{ drafts: any[] }>(endpoint, "GET", undefined, undefined, true, true);
}

/**
 * 下書き詳細取得API
 * 
 * 入力:
 * - draftId: 下書きID
 * 
 * 出力:
 * - draftId: 下書きID
 * - messages: メッセージ配列
 */
export async function getCorporateDraftDetail(
  draftId: string
): Promise<{ draftId: string; messages: ChatMessage[] }> {
  return apiFetch<{ draftId: string; messages: ChatMessage[] }>(ENDPOINTS.corporate.ir.detail(draftId), "GET", undefined, undefined, true, true);
}

/**
 * IRチャットメッセージ送信API
 * 
 * 入力:
 * - requestData: チャットリクエストデータ（メッセージ、下書きID、オプション）
 * 
 * 出力:
 * - ChatResponse: チャットレスポンス
 */
export async function postCorporateIrChat(
  requestData: ChatRequest & { draftId?: string; options?: { tone: string; maxLength: number } }
): Promise<ChatResponse> {
  return apiFetch<ChatResponse>(ENDPOINTS.corporate.ir.chat, "POST", requestData, undefined, true, true);
}

/**
 * メール下書き作成API
 * 
 * 入力:
 * - requestData: メール下書きリクエストデータ
 * 
 * 出力:
 * - MailDraftResponse: メール下書きレスポンス
 */
export async function createCorporateMailDraft(requestData: MailDraftRequest): Promise<MailDraftResponse> {
  return apiFetch<MailDraftResponse>(ENDPOINTS.corporate.ir.mailDraft, "POST", requestData, undefined, true, true);
}

/**
 * 企業設定取得API
 * 
 * 入力:
 * - なし
 * 
 * 出力:
 * - CompanyInfo: 企業情報
 */
export async function getCorporateCompanySettings(): Promise<CompanyInfo> {
  return apiFetch<CompanyInfo>(
    ENDPOINTS.corporate.settings.company,
    "GET",
    undefined,
    undefined,
    true,
    true
  );
}

/**
 * 企業設定更新API
 * 
 * 入力:
 * - updateData: 更新する企業情報
 * 
 * 出力:
 * - CompanyInfo & { message: string }: 更新後の企業情報とメッセージ
 */
export async function updateCorporateCompanySettings(
  updateData: CompanyInfo
): Promise<CompanyInfo & { message: string }> {
  return apiFetch<CompanyInfo & { message: string }>(
    ENDPOINTS.corporate.settings.company,
    "PUT",
    updateData,
    undefined,
    true,
    true
  );
}

/**
 * アカウント設定更新API
 * 
 * 入力:
 * - updateData: 更新するアカウント情報（現在のパスワード、新しいパスワード、新しいメールアドレス）
 * 
 * 出力:
 * - { message: string }: 更新結果メッセージ
 */
export async function updateCorporateAccountSettings(
  updateData: { currentPassword: string; newPassword: string; newEmail: string }
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    ENDPOINTS.corporate.settings.account,
    "PUT",
    updateData,
    undefined,
    true,
    true
  );
}

/**
 * IRチャット履歴取得API
 * 
 * 入力:
 * - query: ページネーション情報（ページ番号、ページサイズ）
 * 
 * 出力:
 * - ChatHistoryResponse: チャット履歴レスポンス
 */
export async function getCorporateChatHistory(
  query?: {
    page?: number;
    page_size?: number;
  }
): Promise<ChatHistoryResponse> {
  const queryString = query ? `?${new URLSearchParams(query as any).toString()}` : "";
  const endpoint = `${ENDPOINTS.corporate.ir.history}${queryString}`;
  return apiFetch<ChatHistoryResponse>(endpoint, "GET", undefined, undefined, true, true);
}

/**
 * IRチャット詳細取得API
 * 
 * 入力:
 * - chatId: チャットID
 * 
 * 出力:
 * - ChatDetailResponse: チャット詳細レスポンス
 */
export async function getCorporateChatDetail(chatId: string): Promise<ChatDetailResponse> {
  const endpoint = ENDPOINTS.corporate.ir.detail(chatId);
  return apiFetch<ChatDetailResponse>(endpoint, "GET", undefined, undefined, true, true);
}

/**
 * 新規IRチャット開始API
 * 
 * 入力:
 * - なし
 * 
 * 出力:
 * - IRChatResponse: 新規チャットレスポンス
 */
export async function startNewCorporateChat(): Promise<IRChatResponse> {
  return apiFetch<IRChatResponse>(ENDPOINTS.corporate.ir.newChat, "POST", {}, undefined, true, true);
}

/**
 * IRチャットメッセージストリーミング送信API
 * 
 * 入力:
 * - chatId: チャットID
 * - message: 送信メッセージ
 * - onChunk: チャンク受信時のコールバック関数
 * - onStart: ストリーミング開始時のコールバック関数（オプション）
 * - onEnd: ストリーミング完了時のコールバック関数（オプション）
 * - onError: エラー時のコールバック関数（オプション）
 * 
 * 出力:
 * - void
 */
export async function sendCorporateChatMessageStream(
  chatId: string,
  message: string,
  onChunk: (chunk: string) => void,
  onStart?: () => void,
  onEnd?: (fullResponse: string) => void,
  onError?: (error: string) => void
): Promise<void> {
  const endpoint = ENDPOINTS.corporate.ir.sendMessage(chatId);
  return streamingFetch(
    endpoint, 
    { message }, 
    onChunk,
    onStart,
    onEnd,
    onError
  );
}

/**
 * ファイル一覧取得API
 * 
 * 入力:
 * - なし（ログインしている企業のファイルを取得）
 * 
 * 出力:
 * - FileManagementResponse: ファイル一覧と総数、総ページ数
 */
export async function getCorporateFiles(): Promise<FileManagementResponse> {
  return apiFetch<FileManagementResponse>(
    ENDPOINTS.corporate.files.list,
    "GET",
    undefined,
    undefined,
    true,
    true
  );
}

/**
 * ファイルアップロードAPI
 * 
 * 入力:
 * - file: アップロードするPDFファイル
 * - fiscalPeriod: 対象決算期
 * - documentType: 資料種類
 * 
 * 出力:
 * - FileCollection: アップロードされたファイル情報
 */
export async function uploadCorporateFile(
  file: File,
  fiscalPeriod: string,
  documentType: string
): Promise<FileCollection> {
  // バリデーション
  if (!fiscalPeriod || fiscalPeriod.trim() === '') {
    throw new Error('fiscalPeriod is required');
  }
  if (!documentType || documentType.trim() === '') {
    throw new Error('documentType is required');
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fiscalPeriod", fiscalPeriod.trim());
  formData.append("documentType", documentType.trim());
  
  return apiFetch<FileCollection>(
    ENDPOINTS.corporate.files.upload,
    "POST",
    formData,
    undefined,
    true,
    true
  );
}

/**
 * ファイル削除API
 * 
 * 入力:
 * - fileId: 削除するファイルのID
 * 
 * 出力:
 * - { message: string }: 削除完了メッセージ
 */
export async function deleteCorporateFile(fileId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    ENDPOINTS.corporate.files.delete(fileId),
    "DELETE",
    undefined,
    undefined,
    true,
    true
  );
} 