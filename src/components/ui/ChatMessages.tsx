// src/components/ui/ChatMessages.tsx
import React from 'react';
import MessageList from '@/components/features/corporate/irchat/MessageList';
import { ChatMessage, ChatMessagesProps } from '@/types';

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, chatTitle }) => {
  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー（チャットタイトル）の固定部分 */}
      <div className="p-3 border-b flex-shrink-0">
        <h2 className="text-lg font-bold">{chatTitle}</h2>
      </div>
      {/* メッセージ一覧部分：この部分のみがスクロール対象
          min-h-0 を追加することで、親から指定された固定高さに沿って縮小させる */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <MessageList messages={messages} />
      </div>
    </div>
  );
};

export default ChatMessages;
