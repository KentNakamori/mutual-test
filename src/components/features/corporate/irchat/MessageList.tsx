// src/components/features/corporate/irchat/MessageList.tsx
import React from 'react';
import MessageBubble from './MessageBubble';
import { ChatMessage, MessageListProps  } from "@/types"; 




/**
 * MessageList コンポーネント
 * メッセージを時系列に並べ、MessageBubble をレンダリングします。
 */
const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <MessageBubble key={msg.messageId} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
