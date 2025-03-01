/**
 * BookmarkButtonコンポーネント
 * - QAや企業ページなどをブックマーク/フォローしたい時のトグルボタン
 * - アイコン + テキスト表示を含む例
 */

import React from "react";
import { Star } from "lucide-react"; 
// ↑ Lucideのスターアイコン例。実環境に合わせてimport調整

import { cn } from "@/libs/utils";

type BookmarkButtonProps = {
  /** ブックマーク済みかどうか */
  isBookmarked: boolean;
  /** ボタン押下時のハンドラ */
  onToggleBookmark: () => void;
  /** ラベル文言 (例: "フォロー", "保存" など) */
  label?: string;
  /** サイズ */
  size?: "sm" | "md" | "lg";
  /** 無効状態にするか */
  disabled?: boolean;
};

const sizeStyles = {
  sm: "text-sm px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggleBookmark,
  label,
  size = "md",
  disabled = false,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggleBookmark}
      className={cn(
        "flex items-center space-x-1 border rounded transition-colors",
        "hover:bg-gray-100 active:scale-95",
        disabled && "opacity-50 cursor-not-allowed",
        sizeStyles[size]
      )}
      aria-label="Bookmark button"
    >
      <Star
        className={cn(
          "w-4 h-4",
          isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-gray-500"
        )}
        fill={isBookmarked ? "currentColor" : "none"}
      />
      {label && <span>{label}</span>}
    </button>
  );
};

export default BookmarkButton;
