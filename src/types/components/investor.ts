import { ReactNode } from 'react';
import { Company, QA, ProfileData, NotificationSetting } from '../models';
import { Industry } from '../industry';

/**
 * 投資家向けホームページ（フロントページ用）
 * - 企業一覧表示
 * - 検索機能
 * - フィルタリング
 */
export interface InvestorHomePageProps {
  children?: ReactNode;
}

/**
 * 投資家向け企業詳細ページ（企業詳細表示用）
 * - 企業情報表示
 * - Q&A一覧表示
 * - チャット機能
 */
export interface CompanyDetailPageProps {
  company: Company;
  qas: QA[];
}

/**
 * 投資家向けマイページ（ユーザー設定用）
 * - プロフィール表示・編集
 * - 通知設定
 * - アカウント管理
 */
export interface InvestorMyPageProps {
  user: ProfileData;
  notificationSetting: NotificationSetting;
  onUpdateProfile: (profile: ProfileData) => Promise<void>;
  onUpdateNotification: (setting: NotificationSetting) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

/**
 * 投資家向けQ&Aページ（Q&A検索・閲覧用）
 * - Q&A検索
 * - Q&A一覧表示
 * - Q&A詳細表示
 */
export interface InvestorQAPageProps {
  qas: QA[];
  totalCount: number;
  currentPage: number;
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, unknown>) => void;
}

/**
 * 投資家向けチャット履歴ページ（チャット履歴表示用）
 * - チャット履歴一覧
 * - チャット再開
 * - チャット検索
 */
export interface ChatHistoryPageProps {
  chatLogs: Array<{
    chatId: string;
    companyName: string;
    lastMessage: string;
    updatedAt: string;
  }>;
  onSelectChat: (chatId: string) => void;
}

/**
 * フォロー企業一覧ページ（フォロー管理用）
 * - フォロー企業一覧
 * - フォロー解除
 * - 企業詳細への遷移
 */
export interface FollowedCompaniesPageProps {
  followedCompanies: Company[];
  onUnfollow: (companyId: string) => Promise<void>;
}

/**
 * 投資家ログインページ（ログイン用）
 * - ログイン表示
 * - ログイン処理
 */
export interface InvestorLoginPageProps {
  // ログインページのプロパティを必要に応じて追加
}

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
export interface LinkToSignupProps {
  // サインアップリンクのプロパティを必要に応じて追加
}

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
  company: Company & { isFollowed?: boolean };
  onFollowStatusChange?: (isFollowed: boolean) => void;
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
  activeTab: "profile" | "password" | "notification" | "delete";
  onTabChange: (tab: "profile" | "password" | "notification" | "delete") => void;
  profileData: ProfileData;
  onSaveProfile: (updatedProfile: ProfileData) => Promise<void>;
  onChangePassword: (currentPass: string, newPass: string) => Promise<void>;
  onSaveNotification: (newSetting: NotificationSetting) => Promise<void>;
  onDeleteAccount: (password: string) => Promise<void>;
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
    type: 'select' | 'text' | 'date' | 'checkbox' | 'fiscalPeriod' | 'multiSelect';
    options?: { value: string; label: string }[];
  }[];
  sortOptions?: {
    value: string;
    label: string;
  }[];
  filterComponent?: React.ReactNode;
  onSearch: (keyword: string, filters: {
    question_route?: string;
    category?: string[];
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

/**
 * FAQ項目の型
 */
export interface FaqItem {
  id: string;
  question: string;
  answer?: string;
}

/**
 * FAQパネルのプロパティ
 */
export interface FAQPanelProps {
  onSelectFAQ: (question: string) => void;
  faqs?: FaqItem[];
}

/**
 * パスワード変更フォームのプロパティ
 */
export interface PasswordChangeFormProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

/**
 * アカウント削除フォームのプロパティ
 */
export interface AccountDeleteFormProps {
  onDeleteAccount: (password: string) => Promise<void>;
} 