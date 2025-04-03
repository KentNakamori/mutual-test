// src/components/features/corporate/irchat/MessageBubble.tsx
import React from 'react';
import { ChatMessage, MessageBubbleProps } from "@/types"; 

/**
 * MessageBubble コンポーネント
 * 担当者（user）とAI（ai）のメッセージでレイアウトや背景色を切り替えます。
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.role === 'ai';
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className={`p-3 rounded-lg max-w-md ${isAI ? 'bg-gray-200 text-gray-900' : 'bg-black text-white'}`}>
        <p>{message.text}</p>
        <div className="text-xs text-gray-500 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
