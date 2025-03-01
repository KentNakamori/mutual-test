"use client";

import React from "react";
import ChatMessageItem from "./ChatMessageItem";

export interface ChatMessageData {
  role: "user" | "ai";
  content: string;
  timestamp: string;
  id?: string;
}

interface GlobalChatMessagesAreaProps {
  messages: ChatMessageData[];
  isLoading?: boolean;
}

/**
 * チャットのメッセージ一覧表示
 */
const GlobalChatMessagesArea: React.FC<GlobalChatMessagesAreaProps> = ({
  messages,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      {/* メッセージリスト */}
      {messages.map((msg, idx) => (
        <ChatMessageItem
          key={msg.id || idx}
          role={msg.role}
          content={msg.content}
          timestamp={msg.timestamp}
        />
      ))}

      {/* AI応答待ち中なら簡易ローディング表示 */}
      {isLoading && (
        <div className="text-sm text-gray-500 mt-2">
          AIの回答を待機しています...
        </div>
      )}
    </div>
  );
};

export default GlobalChatMessagesArea;
