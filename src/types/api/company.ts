/**
 * @file company.ts
 * @description 企業関連APIのリクエスト/レスポンス型定義
 */

import { Company } from "../domain";

/**
 * 企業一覧取得API Request
 */
export interface CompanyListRequest {
  q?: string;
  sort?: string;
  industry?: string;
  followedOnly?: boolean;
  page?: number;
  limit?: number;
}

/**
 * 企業一覧取得API Response
 */
export interface CompanyListResponse {
  data: Company[];
  totalCount: number;
}

/**
 * 企業詳細取得API Response
 */
export interface CompanyDetailResponse {
  id: string;
  name: string;
  industry?: string;
  logoUrl?: string;
  description?: string;
  /** ログインユーザーがフォロー済みかどうか */
  isFollowing: boolean;
}

/**
 * 企業フォロー登録/解除API Request
 */
export interface FollowCompanyRequest {
  companyId: string;
}

/**
 * 企業フォロー登録/解除API Response
 */
export interface FollowCompanyResponse {
  /** フォロー登録/解除の成否 */
  success: boolean;
  /** 最新のフォロー状態 */
  isFollowing: boolean;
}
