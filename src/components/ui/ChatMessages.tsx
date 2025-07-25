// src/components/ui/ChatMessages.tsx
"use client";

import React from 'react';
import MessageList from '@/components/ui/MessageList';
import { ChatMessagesProps } from '@/types';

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="flex flex-col h-full">
      {/* メッセージ一覧部分：この部分のみがスクロール対象
          min-h-0 を追加することで、親から指定された固定高さに沿って縮小させる */}
      <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
        <MessageList messages={messages} />
      </div>
    </div>
  );
};

export default ChatMessages;
