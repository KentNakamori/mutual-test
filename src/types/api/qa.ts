/**
types/qa.ts
 * @description QA関連APIのリクエスト/レスポンス型定義
 */

import { QA } from "../domain";

/**
 * QA一覧取得 Request
 */
export interface QAListRequest {
  /** 企業IDなど、必要に応じて */
  companyId?: string;
  keyword?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * QA一覧取得 Response
 */
export interface QAListResponse {
  data: QA[];
  totalCount: number;
}

/**
 * QAいいね登録/解除 Request
 */
export interface LikeQARequest {
  qaId: string;
  /** 登録 or 解除を判別したいならフラグ追加なども可 */
}

/**
 * QAいいね登録/解除 Response
 */
export interface LikeQAResponse {
  likeCount: number;
}

/**
 * QAブックマーク登録/解除 Request
 */
export interface BookmarkQARequest {
  qaId: string;
}

/**
 * QAブックマーク登録/解除 Response
 */
export interface BookmarkQAResponse {
  bookmarkCount: number;
}

/**
 * 横断検索 Request
 */
export interface SearchQARequest {
  keyword?: string;
  company?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * 横断検索 Response
 */
export interface SearchQAResponse {
  data: QA[];
  totalCount: number;
}
