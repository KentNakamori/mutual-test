/**
 * @file components/ui/LikeButton.tsx
 * @description 任意の対象に「いいね」を行うトグルボタン。いいね数表示と「いいね済み」状態を切り替え
 */

import React from "react";
import{Button }from "./button";

type LikeButtonProps = {
  count: number;
  isLiked: boolean;
  onToggleLike: () => void;
  variant?: "heart" | "thumb";
  size?: "sm" | "md" | "lg";
};

const LikeButton: React.FC<LikeButtonProps> = ({
  count,
  isLiked,
  onToggleLike,
  variant = "heart",
  size = "md",
}) => {
  const renderIcon = () => {
    if (variant === "thumb") {
      return isLiked ? "👍" : "👍"; // 使うアイコンライブラリで色など変える
    }
    // heart
    return isLiked ? "❤️" : "🤍";
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={onToggleLike}
      label={`${count}`}
      iconType={renderIcon()}
    />
  );
};

export default LikeButton;
