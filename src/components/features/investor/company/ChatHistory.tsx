//src\components\features\investor\company\ChatHistory.tsx

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatTabView';
import { ChatHistoryProps } from '../../../../types';


/**
 * ChatHistory コンポーネント
 * ユーザーとAIのチャットメッセージを吹き出し形式で表示します。
 */
const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, loading }) => {
  const endRef = useRef<HTMLDivElement>(null);
  
  // メッセージ更新時に自動スクロール
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded mb-4" style={{ maxHeight: '400px' }}>
      {messages.map((msg) => (
        <div key={msg.messageId} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
          <div className={`inline-block px-4 py-2 rounded ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}>
            {msg.text}
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
