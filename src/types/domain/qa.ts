/**
 * @file qa.ts
 * @description QA情報関連のドメイン型定義
 */

import { Timestamped, RecordStatus } from "../utilities";

/**
 * 公開されているQA
 */
export interface QA extends Timestamped, RecordStatus {
  /** QAの一意なID */
  id: string;
  /** 質問文 */
  question: string;
  /** 回答文 */
  answer: string;
  /** 対象の企業ID */
  companyId: string;
  /** いいね数 */
  likeCount: number;
  /** ブックマーク数 */
  bookmarkCount: number;
  /** 公開フラグ(公開 or 非公開など) */
  isPublic: boolean;
}

/**
 * QABase（下書き含むQAのベース概念）
 * - 企業内部管理用などで利用する拡張のためのベース型
 * - ここでは詳細割愛
 */
// export interface QABase extends QA { ... }
