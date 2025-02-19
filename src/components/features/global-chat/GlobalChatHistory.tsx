"use client";

import React from "react";
import { ChatHistoryPanelProps } from "@/types/components";

/**
 * グローバルチャットの履歴表示領域
 */
const GlobalChatHistory: React.FC<ChatHistoryPanelProps> = ({
  messages,
  isLoading,
}) => {
  return (
    <div className="h-80 overflow-y-auto border-b border-gray-200 pb-4">
      {messages.map((msg, index) => (
        <div key={index} className="mb-3">
          <div
            className={`flex ${
              msg.role === "ai" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`px-3 py-2 rounded shadow-sm ${
                msg.role === "ai" ? "bg-gray-50" : "bg-black text-white"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1 text-right">
            {msg.timestamp}
          </div>
        </div>
      ))}

      {isLoading && <p className="text-sm text-gray-500">通信中...</p>}
    </div>
  );
};

export default GlobalChatHistory;
