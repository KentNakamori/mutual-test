// src/lib/api/tracking.ts

/**
 * 【重要】トラッキング機能について
 * 
 * バックエンドの変更により、以下のとおり動作が変更されました：
 * 
 * 1. 企業詳細ページのアクセストラッキング：
 *    - `/investor/companies/{companyId}` API呼び出し時に自動的に記録される
 *    - フロントエンド側での追加のトラッキングAPI呼び出しは不要
 * 
 * 2. クリックトラッキング：
 *    - 現在は実装されていない
 *    - 必要に応じて将来的に実装予定
 * 
 * 3. 複数企業のページビュートラッキング：
 *    - 企業一覧ページでは不要（企業詳細ページのアクセス時のみ記録）
 */

// 後方互換性のため型定義は保持
export interface TrackRequest {
  companyId: string;
  pathname: string;
  action: 'pageview' | 'click' | 'scroll';
}

const DEBUG = process.env.NODE_ENV === 'development';

/**
 * @deprecated バックエンドでの自動トラッキング実装により不要
 * 企業詳細ページのアクセスは `/investor/companies/{companyId}` API呼び出し時に自動記録されます
 */
export const trackCompanyView = async (companyId: string, pathname: string): Promise<void> => {
  if (DEBUG) {
    console.log('ℹ️ trackCompanyView: バックエンドで自動トラッキングされるため、この関数は何も実行しません', {
      companyId,
      pathname
    });
  }
  // 何も実行しない - バックエンドで自動的にトラッキングされる
};

/**
 * @deprecated 現在は実装されていません
 * 将来的にクリックトラッキングが必要になった場合に再実装予定
 */
export const trackClick = async (companyId: string, pathname: string): Promise<void> => {
  if (DEBUG) {
    console.log('ℹ️ trackClick: 現在は実装されていません', {
      companyId,
      pathname
    });
  }
  // 現在は何も実行しない
};

/**
 * @deprecated バックエンドでの自動トラッキング実装により不要
 * 企業一覧ページでのトラッキングは不要です
 */
export const trackMultiplePageViews = async (
  companies: Array<{ companyId: string }>,
  pathname: string
): Promise<void> => {
  if (DEBUG) {
    console.log('ℹ️ trackMultiplePageViews: 企業一覧ページでのトラッキングは不要です', {
      companiesCount: companies.length,
      pathname
    });
  }
  // 何も実行しない - 企業一覧ページでのトラッキングは不要
};

/**
 * @deprecated バックエンドでの自動トラッキング実装により不要
 */
export const trackPageView = async (pathname: string): Promise<void> => {
  if (DEBUG) {
    console.log('ℹ️ trackPageView: バックエンドで自動トラッキングされるため不要', pathname);
  }
  // 何も実行しない
}; 