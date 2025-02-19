/**
 * @file chat.ts
 * @description チャット/セッション情報のドメイン型定義
 */

import { Timestamped, RecordStatus } from "../utilities";

/**
 * チャットセッション
 */
export interface ChatSession extends Timestamped, RecordStatus {
  /** セッションID */
  id: string;
  /** ユーザーID(投資家がログインしている場合のみ) */
  userId?: string;
  /** 企業ID(企業別チャットの場合) */
  companyId?: string;
  /** 企業横断チャット(グローバルチャット)の場合はcompanyIdが無いケースもある */
  title?: string; // チャットにタイトルをつける場合
}

/**
 * チャットメッセージ
 */
export interface ChatMessage extends Timestamped {
  /** メッセージID */
  id: string;
  /** 紐づくセッションID */
  sessionId: string;
  /** 発言者区分 (user / ai など) */
  role: "user" | "ai";
  /** 本文(テキスト) */
  content: string;
  /** 回答に付加される過去QAリンクや資料URLなど */
  references?: string[];
}
