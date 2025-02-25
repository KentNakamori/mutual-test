/**
 config/api.ts
 * @description APIエンドポイントのベースURLや設定値を管理
 */

// 環境変数 (Next.js の場合は NEXT_PUBLIC_ で始まるものを利用)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

// 共通ヘッダーに付与するオプションなど（必要に応じて拡張）
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

