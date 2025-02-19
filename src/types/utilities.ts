/**
 * @file utilities.ts
 * @description 汎用的に使えるユーティリティ型定義
 */

/**
 * APIレスポンスの汎用フォーマット
 * @template T レスポンスデータの型
 */
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    error?: {
      code: string;
      message: string;
    };
  }
  
  /**
   * タイムスタンプを示す共通型
   */
  export interface Timestamped {
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * レコードのアーカイブ/削除状態などをまとめるための拡張
   */
  export interface RecordStatus {
    isArchived?: boolean;
    isDeleted?: boolean;
  }
  
  /**
   * ページネーション情報
   */
  export interface PaginationParams {
    page: number;
    limit: number;
  }
  
  /**
   * ソート条件
   */
  export interface SortParams {
    sortKey: string;
    sortOrder: "asc" | "desc";
  }
  
  /**
   * フィルタ条件全般
   * - 実運用に合わせてジェネリクスや拡張など検討可
   */
  export interface FilterParams {
    keyword?: string;
    dateRange?: { start: string; end: string };
    industry?: string;
    // ...他のフィルタも拡張可能
  }
  
  /**
   * Nullable型
   * - T または null を許容
   */
  export type Nullable<T> = T | null;
  