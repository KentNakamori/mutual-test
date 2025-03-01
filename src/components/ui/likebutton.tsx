/**
 * LikeButtonコンポーネント
 * - QAや投稿への「いいね」トグルボタン
 * - アイコン + カウント表示
 */

import React from "react";
import { Heart } from "lucide-react"; 
// ↑ shadcnの推奨アイコン(Lucide)の例。実際のパスに合わせてimportしてください。
import { cn } from "@/libs/utils";

type LikeButtonProps = {
  /** 現在のいいね数 */
  count: number;
  /** ユーザーがいいね済みかどうか */
  isLiked: boolean;
  /** ボタンが押されたときのハンドラ */
  onToggleLike: () => void;
  /** ボタンサイズ (アイコン/フォントの大きさ) */
  size?: "sm" | "md" | "lg";
  /** 無効状態にするか */
  disabled?: boolean;
};

const sizeClasses = {
  sm: "text-sm px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

const LikeButton: React.FC<LikeButtonProps> = ({
  count,
  isLiked,
  onToggleLike,
  size = "md",
  disabled = false,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggleLike}
      className={cn(
        "flex items-center space-x-1 border rounded transition-colors",
        "hover:bg-gray-100 active:scale-95",
        disabled && "opacity-50 cursor-not-allowed",
        sizeClasses[size]
      )}
      aria-label="Like button"
    >
      <Heart
        className={cn(
          "w-4 h-4",
          isLiked ? "fill-red-600 text-red-600" : "text-gray-500"
        )}
        fill={isLiked ? "currentColor" : "none"} // 中を塗りつぶすかどうか
      />
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;
