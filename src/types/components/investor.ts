import { Company, ProfileData } from '../models';
import { Industry } from '../industry';

/**
 * 投資家ログインページ（ログイン用）
 * - ログイン表示
 * - ログイン処理
 */
export interface InvestorLoginPageProps {}

/**
 * ゲストログインボタン（ゲストログイン用）
 * - ゲストログイン処理
 */
export interface GuestLoginButtonProps {
  onGuestLoginSuccess?: () => void;
  onGuestLoginError?: (error: Error) => void;
}

/**
 * サインアップリンク（サインアップ用）
 * - サインアップリンク表示
 */
export interface LinkToSignupProps {}

/**
 * トップページ（トップ表示用）
 * - 企業一覧表示
 */
export interface TopPageProps {
  companies: Company[];
}

/**
 * 企業リスト（企業一覧表示用）
 * - 企業一覧表示
 * - フォロー操作
 */
export interface CompanyListProps {
  companies: Company[];
  onFollowToggle: (companyId: string, nextState: boolean) => void;
}

/**
 * 企業カード（企業表示用）
 * - 企業情報表示
 * - フォロー操作
 */
export interface CompanyCardProps {
  company: Company;
  onFollowToggle: (companyId: string, nextState: boolean) => void;
  onCardClick?: (companyId: string) => void;
}

/**
 * 企業ページ（企業詳細表示用）
 * - 企業詳細表示
 */
export interface CompanyPageProps {
  company: Company;
}

/**
 * 企業ヘッダー（企業ヘッダー表示用）
 * - 企業ヘッダー表示
 */
export interface CompanyHeaderProps {
  company: Company;
}

/**
 * 企業検索クエリ（企業検索用）
 * - 検索条件
 */
export interface CompanySearchQuery {
  keyword: string;
  industry?: Industry;
}

/**
 * 企業検索バー（企業検索用）
 * - 検索表示
 * - 検索処理
 */
export interface CompanySearchBarProps {
  initialQuery: CompanySearchQuery;
  onSearchChange: (query: CompanySearchQuery & { filter?: string; sortOrder?: 'asc' | 'desc' }) => void;
}

/**
 * マイページ（ユーザーページ用）
 * - ユーザー情報表示
 */
export interface MyPageProps {
  profile: ProfileData;
}

/**
 * マイページタブメニュー（タブ切り替え用）
 * - タブ表示
 * - タブ切り替え処理
 */
export interface MyPageTabMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * プロフィールフォーム（プロフィール編集用）
 * - プロフィール編集
 * - 保存処理
 */
export interface ProfileFormProps {
  initialProfile: ProfileData;
  onSaveProfile: (updatedProfile: ProfileData) => Promise<void>;
}

/**
 * パスワードリセットリンク（パスワードリセット用）
 * - パスワードリセットリンク表示
 */
export interface PasswordResetLinkProps {
  href: string;
}

/**
 * 検索バーのプロパティ
 */
export interface SearchBarProps {
  placeholder?: string;
  initialKeyword?: string;
  initialFilters?: Record<string, any>;
  showFilterButton?: boolean;
  className?: string;
  filterButtonLabel?: string;
  filterOptions?: {
    id: string;
    label: string;
    type: 'select' | 'text' | 'date' | 'checkbox';
    options?: { value: string; label: string }[];
  }[];
  sortOptions?: {
    value: string;
    label: string;
  }[];
  filterComponent?: React.ReactNode;
  onSearch: (keyword: string, filters: {
    question_route?: string;
    genre?: string[];
    fiscalPeriod?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    reviewStatus?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  }) => void;
  onSort?: (sortBy: string) => void;
}

/**
 * 拡張された検索バーのプロパティ
 */
export interface EnhancedSearchBarProps extends SearchBarProps {
  sortOptions?: {
    value: string;
    label: string;
  }[];
  initialSortBy?: string;
  onSort?: (sortBy: string) => void;
} 