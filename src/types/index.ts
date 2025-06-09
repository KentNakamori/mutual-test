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
  investor_type: 'institutional' | 'individual' | 'analyst' | 'other';
  asset_scale?: 'under_5m' | '5m_to_10m' | '10m_to_30m' | 'over_30m' | 'other';
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

