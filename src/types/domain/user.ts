/**
 * @file user.ts
 * @description ユーザー関連のドメイン型定義
 */

import { Timestamped } from "../utilities";

/**
 * ユーザーの役割区分
 */
export enum UserRole {
  Investor = "investor",
  Company = "company",
  Guest = "guest",
}

/**
 * 通知設定 (共通)
 */
export interface NotificationSetting {
  /** ユーザーID (ログインユーザーの場合のみ必須) */
  userId?: string;
  /** 新着QA通知ON/OFF */
  notifyOnNewQA: boolean;
  /** 企業フォロー更新通知ON/OFF */
  notifyOnFollowUpdate: boolean;
  /** 通知メールアドレス(ユーザーのメールと別で設定できるケース) */
  notificationEmail?: string;
  /** 受信頻度 (即時 / 1日1回 / 週1回 等) */
  frequency: string;
}

/**
 * 汎用ユーザーオブジェクト (共通)
 * - 投資家/企業/ゲストで共通する項目を定義
 */
export interface User extends Timestamped {
  /** ユーザーID(文字列: 内部管理ID) */
  id: string;
  /** 表示名（ニックネームや実名） */
  displayName: string;
  /** ロール区分 (投資家/企業/ゲスト) */
  role: UserRole;
  /** メールアドレス(投資家・企業ユーザーは必須、ゲストは任意) */
  email?: string;
  /** プロフィール画像URL(任意) */
  avatarUrl?: string;
  /** 通知設定(任意) */
  notificationSettings?: NotificationSetting;
}

/**
 * 投資家ユーザー
 * - Userを拡張し、投資家固有のプロパティが増えたらここに追加
 */
export interface Investor extends User {
  role: UserRole.Investor;
  /** 将来的に、上位プランやフォロー企業一覧などをここで拡張可能 */
}

/**
 * 企業ユーザー
 * - Userを拡張し、企業ユーザー固有のプロパティが増えたらここに追加
 */
export interface CompanyUser extends User {
  role: UserRole.Company;
  /** 企業管理権限などを拡張可能 */
}

/**
 * ゲストユーザー
 * - Userを拡張し、ゲストユーザー固有のプロパティが増えたらここに追加
 */
export interface GuestUser extends User {
  role: UserRole.Guest;
  /** ゲストトークンの有効期限など、必要に応じて拡張 */
}
