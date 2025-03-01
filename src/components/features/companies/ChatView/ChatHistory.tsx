// src/components/features/companies/ChatView/ChatHistory.tsx
import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { ChatMessage as ChatMessageType } from "@/types/domain/chat";

type ChatHistoryProps = {
  messages: ChatMessageType[];
  isLoading?: boolean;
};

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージ追加時に一番下へスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 border border-gray-200 rounded p-2 mb-2 overflow-y-auto max-h-80">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="text-sm text-gray-400">AIの回答を待っています...</div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatHistory;
