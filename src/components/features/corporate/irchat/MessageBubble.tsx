// src/components/features/corporate/irchat/MessageBubble.tsx
import React from 'react';
import { ChatMessage, MessageBubbleProps } from "@/types"; 

/**
 * MessageBubble コンポーネント
 * 担当者（user）とAI（ai）のメッセージでレイアウトや背景色を切り替えます。
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg max-w-md ${isUser ? 'bg-gray-200 text-black' : 'text-black'}`}>
        <p>{message.text}</p>
        <div className="text-xs text-gray-500 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
