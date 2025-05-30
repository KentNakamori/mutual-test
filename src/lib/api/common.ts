import { ENDPOINTS } from "../../config/api";
import { apiFetch } from "./client";

/**
 * 共通API
 */

/**
 * 検索API
 * 
 * 入力:
 * - query.keyword: 検索キーワード
 * - query.type: 検索タイプ ('corporate' または 'investor')
 * 
 * 出力:
 * - results: 検索結果の配列
 * - totalCount: 検索結果の総数
 */
export async function search(query: { keyword: string; type: string }): Promise<{ results: any[]; totalCount: number }> {
  const queryString = new URLSearchParams(query as any).toString();
  const endpoint = query.type === 'corporate' 
    ? `${ENDPOINTS.corporate.qa.search}?${queryString}`
    : `${ENDPOINTS.investor.qa.search}?${queryString}`;
  return apiFetch<{ results: any[]; totalCount: number }>(endpoint, "GET");
} 