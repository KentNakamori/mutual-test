/**
 * @file company.ts
 * @description 企業関連のドメイン型定義
 */

import { Timestamped } from "../utilities";

/**
 * 企業オブジェクト
 */
export interface Company extends Timestamped {
  /** 企業ID(内部管理ID) */
  id: string;
  /** 企業名 */
  name: string;
  /** 業種 / セクター */
  industry?: string;
  /** ロゴ画像URL */
  logoUrl?: string;
  /** 企業の簡易説明や紹介文 */
  description?: string;
  /** フォロー数 (運用で集計して保持する場合) */
  followerCount?: number;
}

/**
 * フォロー関係
 * - 投資家ユーザーと企業間のフォロー情報
 */
export interface Follow extends Timestamped {
  /** 投資家ユーザーID */
  investorId: string;
  /** 企業ID */
  companyId: string;
  /** フォロー開始日 */
  followedAt: string;
  /** 将来的に通知モードなどを拡張可能 */
}
