import { API_BASE_URL } from '@/config/auth';

/**
 * logoUrlを完全URLに変換する関数
 * 相対パスの場合はバックエンドのベースURLを付加
 * 既に完全URLの場合はそのまま返す
 */
export function getFullImageUrl(logoUrl?: string): string | undefined {
  if (!logoUrl) return undefined;
  
  // 既に完全URLの場合はそのまま返す
  if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
    return logoUrl;
  }
  
  // 相対パスの場合はバックエンドのベースURLを付加
  return `${API_BASE_URL}${logoUrl}`;
} 