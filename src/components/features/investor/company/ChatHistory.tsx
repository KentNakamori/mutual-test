//src\components\features\investor\company\ChatHistory.tsx

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/models';
import { ChatMessagesProps } from '@/types/components/chat';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

/**
 * ChatHistory コンポーネント
 * ユーザーとAIのチャットメッセージを吹き出し形式で表示します。
 * AIのメッセージはMarkdown形式で表示されます。
 */
const ChatHistory: React.FC<ChatMessagesProps & { loading?: boolean }> = ({ messages, loading }) => {
  const endRef = useRef<HTMLDivElement>(null);
  
  // メッセージ更新時に自動スクロール
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded mb-4">
      {messages.map((msg) => (
        <div key={msg.messageId} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
          <div className={`inline-block px-4 py-2 rounded max-w-3xl ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}>
            {msg.role === "ai" ? (
              // AIメッセージの場合はMarkdownレンダリングを使用
              <div className="break-words">
                <MarkdownRenderer content={msg.text} />
              </div>
            ) : (
              // ユーザーメッセージの場合は通常のテキスト表示
              <span className="whitespace-pre-wrap break-words">
                {msg.text}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ))}
      {loading && (
        <div className="text-center text-gray-500">AIが考え中...</div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default ChatHistory;
