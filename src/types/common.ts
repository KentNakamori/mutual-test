/** ISO8601形式の文字列（日付データの保存・表示用） */
export type DateString = string;
/** Epochタイムスタンプ（ミリ秒）（時間計算・比較用） */
export type Timestamp = string;

/** エンティティIDのエイリアス（型の一貫性と可読性向上のため） */
export type UserId = string;
export type CompanyId = string;
export type QaId = string;
export type ChatId = string;
export type DocumentId = string;
export type DraftId = string;
export type FileId = string;

/**
 * ページネーション（ページ管理用）
 * - ページ情報
 */
export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

/**
 * フィルタータイプ（フィルター用）
 * - フィルター条件
 */
export interface FilterType {
  likeMin?: number;
  dateRange?: {
    from?: DateString;
    to?: DateString;
  };
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  question_route?: string;
  genre?: string[];
  fiscalPeriod?: string[];
  sort?: 'createdAt' | 'likeCount';
  order?: 'asc' | 'desc';
  [key: string]: any;
}

/**
 * ソート順（ソート用）
 * - ソート順定義
 */
export type SortOrder = 'asc' | 'desc';

/**
 * API結果（APIレスポンス用）
 * - 成功/エラー結果の統一的な表現
 */
export interface ApiResult<T> {
  data?: T;
  error?: {
    errorCode: string;
    message: string;
    status?: number;
  };
  status: number;
}

// APIレスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 検索関連の型
export interface SearchParams {
  keyword: string;
  genre: string[];
  source: string[];
  question_route?: string;
  fiscalPeriod?: string;
  sort: 'createdAt' | 'likeCount';
  order: 'asc' | 'desc';
  page: number;
  limit: number;
}

// API関連の共通型
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ソート・フィルタリング
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
} 