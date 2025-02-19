"use client";

import React from "react";

interface ChatItem {
  chatId: string;
  title?: string;
  updatedAt: string;
}

interface RecentChatListProps {
  chats: ChatItem[];
  isLoading?: boolean;
  errorMessage?: string;
  onSelectChat?: (chatId: string) => void;
}

export default function RecentChatList({
  chats,
  isLoading,
  errorMessage,
  onSelectChat,
}: RecentChatListProps) {
  if (isLoading) {
    return <div>チャットを読み込み中...</div>;
  }

  if (errorMessage) {
    return <div className="text-error">{errorMessage}</div>;
  }

  if (!chats.length) {
    return <div className="text-sm text-gray-500">最近のチャットはありません。</div>;
  }

  return (
    <ul className="space-y-2">
      {chats.map((chat) => (
        <li
          key={chat.chatId}
          className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => onSelectChat?.(chat.chatId)}
        >
          <div className="font-medium text-gray-800">
            {chat.title || "無題のチャット"}
          </div>
          <div className="text-xs text-gray-500">
            最終更新: {chat.updatedAt}
          </div>
        </li>
      ))}
    </ul>
  );
}
