import React from 'react';
import { ChatMessage } from '@/types';

interface MessageListProps {
  messages: ChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.messageId} className="flex flex-col">
          {message.sender === 'user' ? (
            // ユーザーメッセージ: 右側に表示、背景色グレー
            <div className="ml-auto max-w-3/4">
              <div className="bg-gray-200 rounded-lg p-3 text-black">
                {message.text}
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            // AIアシスタントメッセージ: 左側に表示、背景色なし
            <div className="mr-auto max-w-3/4">
              <div className="text-black p-3">
                {message.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList; 