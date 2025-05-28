// src/components/features/corporate/irchat/MessageBubble.tsx
import React from 'react';
import { MessageBubbleProps } from "@/types";

/**
 * MessageBubble コンポーネント
 * 担当者（user）とAI（ai）のメッセージでレイアウトや背景色を切り替えます。
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isAI = message.role === 'ai';
  const isStreaming = isAI && message.text !== '' && !message.text.includes('エラーが発生しました');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg max-w-3xl ${isUser ? 'bg-gray-200 text-black' : 'bg-gray-100 text-black'}`}>
        <p className="whitespace-pre-wrap break-words">
          {message.text}
          {isAI && message.text === '' && (
            <span className="inline-flex items-center">
              <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-bounce mr-1" style={{ animationDelay: '0ms' }} />
              <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-bounce mr-1" style={{ animationDelay: '150ms' }} />
              <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse ml-0.5" />
          )}
        </p>
        <div className="text-xs text-gray-500 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
