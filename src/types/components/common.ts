/**
 * @file common.ts
 * @description 共通コンポーネントのProps型定義 (ヘッダー、フッター、レイアウト、他)
 */

import React from "react";

/**
 * レイアウトコンポーネントProps (例: Layout, PageLayout など)
 */
export interface LayoutProps {
  children: React.ReactNode;
  /** レイアウトのパターン切り替え用 */
  variant?: "default" | "sidebar" | "fullwidth";
}

/**
 * ヘッダーコンポーネントProps
 */
export interface HeaderProps {
  navigationLinks: { label: string; href: string }[];
  onLogoClick?: () => void;
  onClickProfile?: () => void;
}

/**
 * サイドバーコンポーネントProps
 */
export interface SidebarProps {
  menuItems: { label: string; icon?: React.ReactNode; onClick?: () => void }[];
  isOpen?: boolean;
  onToggleOpen?: () => void;
  onSelectMenu?: (menuLabel: string) => void;
}

/**
 * フッターコンポーネントProps
 */
export interface FooterProps {
  links: { label: string; href: string }[];
}

/**
 * 汎用ボタンProps
 */
export interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "destructive";
}

/**
 * テキスト入力Props
 */
export interface InputProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (newValue: string) => void;
}

/**
 * セレクトボックスProps
 */
export interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
}

/**
 * カードコンポーネントProps
 */
export interface CardProps {
  title: string;
  description?: string;
  image?: string;
  onClick?: () => void;
}

/**
 * タブコンポーネントProps
 */
export interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[];
  defaultValue?: string;
  onChangeTab?: (tabIndex: number) => void;
}

/**
 * ダイアログコンポーネントProps
 */
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * アラートダイアログコンポーネントProps
 */
export interface AlertDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

/**
 * ドロップダウンメニューProps
 */
export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: { label: string; value: string }[];
  onSelect: (value: string) => void;
}

/**
 * テーブルコンポーネントProps
 * @template T テーブルに表示する行データの型
 */
export interface TableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
  onSort?: (columnKey: keyof T) => void;
}

/**
 * アバターコンポーネントProps
 */
export interface AvatarProps {
  src: string;
  alt?: string;
  size?: number;
  onClick?: () => void;
}

/**
 * トーストコンポーネントProps
 */
export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

/**
 * チャットバブルコンポーネントProps
 */
export interface ChatBubbleProps {
  messageText: string;
  authorType: "user" | "ai";
  timestamp: string;
  references?: string[];
  onClickReference?: (reference: string) => void;
}

/* ------------------------------------------------------------------
 * フィルタバーコンポーネントProps
 * 例: SearchFilterBarやFilterBarで使用する型
 * ------------------------------------------------------------------ */
export interface FilterItem {
  /** フィルタのユニークキー */
  key: string; // e.g. "industry" / "followed"
  /** 表示ラベル */
  label: string; // e.g. "業種" / "フォロー中のみ"
  /** UI種別 */
  type: "select" | "checkbox";
  /** Selectの場合に選択可能な候補 */
  options?: string[];
  /** 選択されている値（selectの場合はstring, checkboxの場合はboolean） */
  value?: string | boolean;
}

/**
 * FilterBarProps
 * - フィルタバーの表示・選択変更・リセットなどを扱う
 */
export interface FilterBarProps {
  filters: FilterItem[];
  onFilterChange: (updatedFilters: FilterItem[]) => void;
  onReset?: () => void;
  layout?: "horizontal" | "vertical";
}
