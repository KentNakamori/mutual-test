// src/components/features/corporate/irchat/MessageList.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { MessageListProps } from "@/types";

/**
 * MessageList コンポーネント
 * メッセージを時系列に並べ、MessageBubble をレンダリングします。
 * メッセージが追加されると自動的に最下部にスクロールします。
 */
const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // メッセージが更新されたら最下部にスクロール
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // デバッグ: 重複するキーをチェック
  useEffect(() => {
    const messageIds = messages.map(msg => msg.messageId);
    const uniqueIds = new Set(messageIds);
    
    if (messageIds.length !== uniqueIds.size) {
      console.error('重複するmessageIdが検出されました:', {
        totalMessages: messageIds.length,
        uniqueMessages: uniqueIds.size,
        messageIds,
        duplicates: messageIds.filter((id, index) => messageIds.indexOf(id) !== index),
        messages: messages.map(msg => ({ messageId: msg.messageId, role: msg.role, textLength: msg.text.length }))
      });
    } else if (process.env.NODE_ENV === 'development' && messages.length > 0) {
      console.log('✅ メッセージID重複チェック通過:', {
        messageCount: messages.length,
        latestIds: messageIds.slice(-2)
      });
    }
  }, [messages]);

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {messages.map((msg, index) => {
        // messageIdが空または未定義の場合のフォールバック
        const safeKey = msg.messageId || `message-${index}-${msg.role}-${msg.timestamp}`;
        
        return (
          <MessageBubble 
            key={safeKey} 
            message={msg} 
          />
        );
      })}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
