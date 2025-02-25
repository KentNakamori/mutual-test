/**
 types/chat.ts
 * @description チャット関連APIのリクエスト/レスポンス型定義
 */

import { ChatMessage, ChatSession } from "../domain";

/**
 * チャット送信 Request (企業別 / グローバル共通)
 */
export interface ChatRequest {
  /** ユーザー入力メッセージ */
  message: string;
  /** 既存セッションがあれば */
  sessionId?: string;
  /** フィルタ条件など(横断チャット用の拡張) */
  filters?: Record<string, unknown>;
}

/**
 * チャット送信 Response
 */
export interface ChatResponse {
  /** AIの回答 */
  answer: string;
  /** 回答文末の関連リンクや資料情報 */
  references?: string[];
  /** 新規セッション開始時に発行されるID */
  newSessionId?: string;
}

/**
 * チャット履歴一覧 Request
 */
export interface ChatLogListRequest {
  keyword?: string; // タイトルや冒頭メッセージなどで検索
  archive?: boolean;
  page?: number;
  limit?: number;
}

/**
 * チャット履歴一覧 Response
 */
export interface ChatLogListResponse {
  data: ChatSession[];
  totalCount: number;
}

/**
 * チャット履歴削除 Request/Response
 */
export interface DeleteChatLogRequest {
  sessionId: string;
}

export interface DeleteChatLogResponse {
  success: boolean;
}

/**
 * チャット履歴アーカイブ Request/Response
 */
export interface ArchiveChatLogRequest {
  sessionId: string;
}

export interface ArchiveChatLogResponse {
  success: boolean;
}

/**
 * チャットセッション詳細 Response
 * - 全メッセージ一覧を返す
 */
export interface ChatSessionDetailResponse {
  sessionId: string;
  messages: ChatMessage[];
}
