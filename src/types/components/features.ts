/**
 * @file features.ts
 * @description 機能別コンポーネントのProps型定義
 *  - ページ詳細要件定義で登場するフォームやパネルなどを例示
 */

import React from "react";

/* ----------------------------------
 * ログインページ関連
 * ---------------------------------- */

/**
 * ログインフォームProps
 * - メールアドレス & パスワードの入力、ログイン実行
 */
export interface LoginFormProps {
  isLoading: boolean; // API呼び出し中かどうか
  onSubmit: (email: string, password: string) => void;
  errorMessage?: string; // 認証失敗時のエラーメッセージ
}

/**
 * ゲスト利用セクションProps
 */
export interface GuestLoginSectionProps {
  termsAccepted: boolean;
  onChangeTerms: (checked: boolean) => void;
  onGuestLogin: () => void;
  errorMessage?: string; // 規約未チェックなどエラー時に表示
}

/* ----------------------------------
 * トップページ (企業一覧)関連
 * ---------------------------------- */

/**
 * 検索バー(SearchBar)のProps
 * - 企業名などの検索キーワードを入力
 */
export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

/**
 * ソートセレクトのProps
 */
export interface SortSelectProps {
  sortKey: string;
  onChangeSort: (sortKey: string) => void;
}

/**
 * フィルタパネルProps
 */
export interface FilterPanelProps {
  selectedIndustry?: string;
  followedOnly?: boolean;
  onChangeFilter: (updatedValues: {
    industry?: string;
    followedOnly?: boolean;
  }) => void;
}

/**
 * 企業カードProps (トップページ一覧用)
 */
export interface CompanyCardProps {
  id: string;
  name: string;
  industry?: string;
  logoUrl?: string;
  description?: string;
  isFollowing?: boolean;
  onFollowToggle?: (companyId: string, currentState: boolean) => void;
  onClick?: (companyId: string) => void; // 企業詳細へ遷移
}

/* ----------------------------------
 * 企業ごとのページ (チャット/QA一覧など)
 * ---------------------------------- */

/**
 * チャット画面 (企業別) のProps
 */
export interface CompanyChatContainerProps {
  companyId: string;
  initialSessionId?: string;
  faqList?: { question: string; answer: string }[]; // よくある質問
}

/**
 * QA一覧パネルのProps
 */
export interface QAListPanelProps {
  companyId: string;
  onSelectQA: (qaId: string) => void; // QAをクリックした際に詳細を開くなど
}

/* ----------------------------------
 * 投資家用 QA一覧ページ (横断検索)
 * ---------------------------------- */

/**
 * QA横断検索フォームProps
 */
export interface QASearchFormProps {
  keyword: string;
  selectedCompany?: string;
  onSearch: (conditions: {
    keyword?: string;
    company?: string;
    sort?: string;
  }) => void;
  onChangeKeyword: (val: string) => void;
  onChangeCompany: (companyId?: string) => void;
}

/**
 * QA検索結果リスト (横断検索) のProps
 */
export interface QAResultListProps {
  items: {
    qaId: string;
    question: string;
    answerSnippet: string;
    companyName: string;
    likeCount: number;
    bookmarkCount: number;
  }[];
  onSelectQA: (qaId: string) => void;
}

/**
 * QA詳細モーダル (横断検索結果から開く) のProps
 */
export interface QADetailModalProps {
  isOpen: boolean;
  qaId?: string;
  question?: string;
  answer?: string;
  likeCount?: number;
  bookmarked?: boolean;
  onClose: () => void;
  onLikeToggle?: (qaId: string) => void;
  onBookmarkToggle?: (qaId: string) => void;
}

/* ----------------------------------
 * chatログ一覧ページ
 * ---------------------------------- */

/**
 * Chatログ一覧のSearchBar拡張
 */
export interface ChatLogSearchBarProps {
  keyword: string;
  showArchived?: boolean;
  onChangeKeyword: (val: string) => void;
  onToggleArchived: (checked: boolean) => void;
  onSearch: () => void;
}

/**
 * Chatログ一覧表示コンポーネントProps
 */
export interface ChatLogListProps {
  logs: {
    sessionId: string;
    title?: string;
    companyId?: string;
    updatedAt: string;
  }[];
  onClickItem: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onArchive: (sessionId: string) => void;
}

/* ----------------------------------
 * マイページ (プロフィール/設定)関連
 * ---------------------------------- */

/**
 * プロフィール編集フォームProps
 */
export interface UserProfileFormProps {
  userData: {
    name: string;
    email: string;
    avatarUrl?: string;
    introduction?: string;
  };
  onSave: (updatedData: {
    name: string;
    email: string;
    avatarUrl?: string;
    introduction?: string;
  }) => void;
  isSaving?: boolean;
  errorMessage?: string;
}

/**
 * パスワード変更フォームProps
 */
export interface PasswordChangeFormProps {
  onChangePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  isChanging?: boolean;
  errorMessage?: string;
}

/**
 * 通知設定フォームProps
 */
export interface NotificationSettingFormProps {
  currentSetting: {
    notifyOnNewQA: boolean;
    notifyOnFollowUpdate: boolean;
    notificationEmail?: string;
    frequency: string;
  };
  onSave: (updatedSetting: {
    notifyOnNewQA: boolean;
    notifyOnFollowUpdate: boolean;
    notificationEmail?: string;
    frequency: string;
  }) => void;
  isSaving?: boolean;
}

/**
 * 退会モーダルProps
 */
export interface AccountDeletionModalProps {
  isOpen: boolean;
  onConfirm: (confirmPassword: string, reason?: string) => void;
  onCancel: () => void;
  isProcessing?: boolean;
  errorMessage?: string;
}

/* ----------------------------------
 * 全体チャットページ (横断チャット)関連
 * ---------------------------------- */

/**
 * グローバルチャットページProps
 */
export interface GlobalChatPageProps {
  userId?: string; // ログインしていればユーザーIDあり
  initialSessionId?: string;
}

/**
 * 過去セッション一覧 (グローバルチャット) Props
 */
export interface ChatSessionListProps {
  sessions: {
    sessionId: string;
    title?: string;
    lastUpdated: string;
  }[];
  onSelectSession: (sessionId: string) => void;
}

/**
 * メインのチャット履歴表示パネルProps
 */
export interface ChatHistoryPanelProps {
  messages: {
    role: "user" | "ai";
    content: string;
    timestamp: string;
  }[];
  isLoading?: boolean; // AI回答待機状態を制御
}

/**
 * チャット入力コンポーネントProps
 */
export interface ChatInputBoxProps {
  onSubmit: (text: string) => void;
  isDisabled?: boolean;
}

/**
 * 回答の関連企業・関連QAを表示するパネルProps (オプション)
 */
export interface SuggestedResultsPanelProps {
  relatedCompanies?: Array<{
    companyId: string;
    companyName: string;
  }>;
  relatedQAs?: Array<{
    qaId: string;
    question: string;
    answerSummary: string;
  }>;
  onClickCompany?: (companyId: string) => void;
  onClickQA?: (qaId: string) => void;
}
