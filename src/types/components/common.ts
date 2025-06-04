import { ReactNode } from 'react';

/**
 * ナビゲーションリンク（ナビゲーション用）
 * - メニュー項目定義
 */
export type NavigationLink = {
  label: string;
  href: string;
};

/**
 * タブスイッチャー（タブ切り替え用）
 * - Q&A/チャットタブ切り替え
 */
export interface TabSwitcherProps {
  activeTab: "qa" | "chat";
  onChangeTab: (tab: "qa" | "chat") => void;
}

/**
 * ヘッダー（共通ヘッダー用）
 * - ナビゲーション表示
 * - ユーザー状態表示
 */
export interface HeaderProps {
  navigationLinks: NavigationLink[];
  userStatus: {
    isLoggedIn: boolean;
    userName?: string;
  };
  onClickLogo: () => void;
}

/**
 * フッター（共通フッター用）
 * - フッターリンク表示
 * - 著作権表示
 */
export interface MinimalFooterProps {
  footerLinks?: { label: string; href: string }[];
  copyrightText: string;
  onSelectLink?: (href: string) => void;
}

/**
 * 最小限ヘッダー（シンプルなヘッダー用）
 * - ロゴ表示
 * - 最小限のナビゲーション
 */
export interface MinimalHeaderProps {
  onClickLogo: () => void;
  logoText?: string;
  logoSrc?: string;
  links?: { label: string; href: string }[];
}

/**
 * フッター（共通フッター用）
 * - 著作権表示
 */
export interface FooterProps {
  copyright: string;
}

/**
 * ボタン（共通ボタン用）
 * - ボタン表示
 * - クリックイベント処理
 */
export interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'destructive' | 'outline' | 'link' | 'gradient';
  type?: "button" | "submit" | "reset";
}

/**
 * カード（共通カード用）
 * - コンテンツ表示
 * - クリックイベント処理
 */
export interface CardProps {
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * 入力フィールド（共通入力用）
 * - テキスト入力
 * - 入力値変更処理
 */
export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  errorState?: boolean;
}

/**
 * ダイアログ（モーダル用）
 * - モーダル表示
 * - モーダル制御
 */
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  showCloseButton?: boolean;
}

/**
 * オプション（セレクトボックス用）
 * - 選択肢定義
 */
export interface Option {
  label: string;
  value: string;
}

/**
 * セレクトボックス（選択用）
 * - 選択肢表示
 * - 選択値変更処理
 */
export interface SelectProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * カラム（テーブル用）
 * - テーブル列定義
 */
export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

/**
 * タブ（タブ表示用）
 * - タブ定義
 */
export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

/**
 * タブスイッチャー（タブ切り替え用）
 * - タブ表示
 * - タブ切り替え処理
 */
export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChangeTab?: (tabId: string) => void;
}

/**
 * テキストエリア（複数行入力用）
 * - 複数行テキスト入力
 * - 入力値変更処理
 */
export interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  errorState?: boolean;
}

/**
 * 確認ダイアログ（確認用）
 * - 確認表示
 * - 確認操作
 */
export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * チェックボックス（選択用）
 * - チェック状態表示
 * - チェック状態変更処理
 */
export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

/**
 * サイドバーメニュー項目の型定義
 */
export interface SidebarMenuItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
}

/**
 * サイドバーのプロパティ型定義
 */
export interface SidebarProps {
  menuItems: SidebarMenuItem[];
  isCollapsible?: boolean;
  selectedItem?: string;
  onSelectMenuItem?: (link: string) => void;
  defaultCollapsed?: boolean;
}

/**
 * フィルターコントロール（フィルター用）
 * - フィルター表示
 * - フィルター変更処理
 */
export interface FilterControlsProps {
  filters: {
    likeMin?: number;
    dateRange?: {
      from?: string;
      to?: string;
    };
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
    [key: string]: any;
  };
  onChangeFilters: (newFilters: any) => void;
}

/**
 * タグオプション（タグ用）
 * - タグ定義
 */
export interface TagOption {
  label: string;
  color: string;
}

/**
 * ページネーション（ページ切り替え用）
 * - ページ切り替え表示
 * - ページ切り替え処理
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

/**
 * フィルターオプション（フィルター用）
 * - フィルター項目定義
 */
export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'checkbox' | 'fiscalPeriod' | 'multiSelect';
  options?: { value: string; label: string }[];
}

/**
 * 検索バーの並び替えオプション
 */
export interface SortOption {
  value: string;
  label: string;
}

/**
 * チャット入力ボックス（チャット入力用）
 * - メッセージ入力
 * - メッセージ送信処理
 */
export interface ChatInputBoxProps {
  onSendMessage: (message: string) => void;
  loading?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isSessionSelected?: boolean;
}

/**
 * メッセージバブルのプロパティ型
 */
export interface MessageBubbleProps {
  message: {
    messageId: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: string;
  };
}

/**
 * メッセージリストのプロパティ型
 */
export interface MessageListProps {
  messages: {
    messageId: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: string;
  }[];
}

/**
 * パスワード変更フォーム（パスワード変更用）
 * - パスワード変更
 * - 変更処理
 */
export interface PasswordChangeFormProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

/**
 * 削除確認ダイアログ（削除操作確認用）
 * - 削除確認表示
 * - 削除操作
 */
export interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * アカウント削除フォーム（アカウント削除用）
 * - アカウント削除
 * - 削除処理
 */
export interface AccountDeleteFormProps {
  onDeleteAccount: (password: string) => Promise<void>;
} 