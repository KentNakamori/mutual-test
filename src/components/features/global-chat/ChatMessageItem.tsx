"use client";

import React from "react";
import { cn } from "@/libs/utils";

/**
 * 単一メッセージ表示用のProps
 */
interface ChatMessageItemProps {
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

/**
 * ChatMessageItem
 * - ユーザーのメッセージ or AIのメッセージを吹き出し形式で表示
 */
const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  role,
  content,
  timestamp,
}) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex flex-col",
        isUser ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] p-3 rounded-md shadow text-sm",
          "leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-gray-200 text-gray-800"
            : "bg-gray-50 text-gray-700"
        )}
      >
        {content}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {new Date(timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default ChatMessageItem;
