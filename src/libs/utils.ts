//src/libs/utils.ts

import type { PaginationParams } from '../types/api';

export const utils = {
  // 日付フォーマット
  formatDate: (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },

  // クエリパラメータのシリアライズ
  serializeQueryParams: (params: Record<string, any>): string => {
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  },

  // ページネーションパラメータ作成
  createPaginationParams: (page: number, limit: number): PaginationParams => ({
    page,
    limit
  }),

  // データの正規化
  normalizeResponse: <T extends { id: string }>(data: T[]): Record<string, T> => {
    return data.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
  },

  // エラーハンドリング
  handleError: (error: Error | unknown): string => {
    if (error instanceof Error) return error.message;
    return '予期せぬエラーが発生しました';
  },

  // ローカルストレージ操作
  storage: {
    set: (key: string, value: any): void => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('ストレージ保存エラー:', error);
      }
    },

    get: <T>(key: string, defaultValue: T): T => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('ストレージ取得エラー:', error);
        return defaultValue;
      }
    },

    remove: (key: string): void => {
      localStorage.removeItem(key);
    }
  },

  // ディープクローン
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  },

  // デバウンス
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
};