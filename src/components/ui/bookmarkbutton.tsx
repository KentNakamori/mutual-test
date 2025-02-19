/**
 * @file components/ui/BookmarkButton.tsx
 * @description 任意の対象をブックマーク（フォロー）するトグルボタン。ブックマーク済み状態などを表示
 */

import React from "react";
import {Button} from "./button";

type BookmarkButtonProps = {
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  label?: string;
  iconVariant?: "star" | "ribbon" | "heart";
  size?: "sm" | "md" | "lg";
};

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggleBookmark,
  label,
  iconVariant = "star",
  size = "md",
}) => {
  const renderIcon = () => {
    if (iconVariant === "ribbon") {
      return isBookmarked ? "🎀" : "🏳️";
    }
    if (iconVariant === "heart") {
      return isBookmarked ? "❤️" : "🤍";
    }
    // default star
    return isBookmarked ? "★" : "☆";
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={onToggleBookmark}
      label={label}
      iconType={renderIcon()}
    />
  );
};

export default BookmarkButton;
