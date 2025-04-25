// src/components/features/corporate/irchat/MessageList.tsx
"use client";

import React from 'react';
import MessageBubble from './MessageBubble';
import {MessageListProps } from "@/types";

/**
 * MessageList コンポーネント
 * メッセージを時系列に並べ、MessageBubble をレンダリングします。
 */
const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {messages.map((msg) => (
        <MessageBubble key={msg.messageId} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
