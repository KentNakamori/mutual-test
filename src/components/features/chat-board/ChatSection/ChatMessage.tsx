// components/features/chat-board/ChatSection/ChatMessage.tsx
import React from 'react';
import { format } from 'date-fns';
import { WSMessage } from '@/types/components';

interface ChatMessageProps {
  message: WSMessage;
  isOwn: boolean;
}

export default function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const content = typeof message.payload === 'string' 
    ? message.payload 
    : message.payload?.content;
    
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`
          max-w-[70%] rounded-lg p-3 
          ${isOwn 
            ? 'bg-black text-white' 
            : 'bg-gray-100 text-gray-900'
          }
        `}
      >
        <p className="text-sm break-words">{content}</p>
        <time className={`
          text-xs mt-1 block text-right
          ${isOwn ? 'text-gray-300' : 'text-gray-500'}
        `}>
          {format(message.timestamp, 'HH:mm')}
        </time>
      </div>
    </div>
  );
}
