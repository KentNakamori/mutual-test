// 基本的なユーティリティ型
export * from './common';

// ドメイン/ビジネスモデル型
export * from './models';

// API関連の型
export * from './api';


// コンポーネント型（UIコンポーネント関連）
export * from './components';

export interface InvestorRegistrationData {
  display_name?: string;
  email: string;
  investor_type: '個人投資家' | '機関投資家' | 'セルサイドアナリスト' | 'その他';
  asset_scale?: '500万円未満' | '500万円～1000万円' | '1000万円～5000万円' | '5000万円～1億円' | '1億円以上' | '非開示';
  bio?: string;
}

export interface InvestorUser {
  id: string;
  auth0_id: string;
  email: string;
  display_name?: string;
  investor_type: string;
  asset_scale?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

