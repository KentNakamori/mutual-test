// components/features/chat-board/ChatSection/ChatList.tsx
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { WSMessage } from '@/types/components';

interface ChatListProps {
  messages: WSMessage[];
  currentUserId: string;
  onLoadMore: () => void;
}

export default function ChatList({
  messages,
  currentUserId,
  onLoadMore
}: ChatListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
    }, options);

    const target = scrollRef.current?.firstElementChild;
    if (target) {
      observerRef.current.observe(target);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [onLoadMore]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-4 p-4"
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.timestamp}
          message={message}
          isOwn={message.payload?.userId === currentUserId}
        />
      ))}
    </div>
  );
}