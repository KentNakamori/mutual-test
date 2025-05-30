// src/components/features/corporate/irchat/MessageBubble.tsx
import React from 'react';
import { MessageBubbleProps } from "@/types";
import MarkdownRenderer from './MarkdownRenderer';

/**
 * MessageBubble コンポーネント
 * 担当者（user）とAI（ai）のメッセージでレイアウトや背景色を切り替えます。
 * AIのメッセージはMarkdown形式で表示されます。
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isAI = message.role === 'ai';
  const isStreaming = isAI && message.text !== '' && !message.text.includes('エラーが発生しました');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg max-w-3xl ${isUser ? 'bg-gray-200 text-black' : 'bg-gray-100 text-black'}`}>
        {isAI ? (
          // AIメッセージの場合はMarkdownレンダリングを使用
          <div className="break-words">
            {message.text === '' ? (
              // ローディング状態
              <span className="inline-flex items-center">
                <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-bounce mr-1" style={{ animationDelay: '0ms' }} />
                <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-bounce mr-1" style={{ animationDelay: '150ms' }} />
                <span className="inline-block w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            ) : (
              <>
                <MarkdownRenderer content={message.text} />
                {isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse ml-0.5" />
                )}
              </>
            )}
          </div>
        ) : (
          // ユーザーメッセージの場合は通常のテキスト表示
          <p className="whitespace-pre-wrap break-words">
            {message.text}
          </p>
        )}
        <div className="text-xs text-gray-500 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
