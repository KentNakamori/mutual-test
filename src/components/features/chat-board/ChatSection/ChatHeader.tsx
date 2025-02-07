// components/features/chat-board/ChatSection/ChatHeader.tsx
import React from 'react';
import { Video, Users, MoreVertical } from 'lucide-react';
import type { User } from '@/types/models';

interface ChatHeaderProps {
  participants: User[];
  onStartCall?: () => void;
  onOpenParticipants?: () => void;
  onOpenMenu?: () => void;
}

export default function ChatHeader({
  participants,
  onStartCall,
  onOpenParticipants,
  onOpenMenu
}: ChatHeaderProps) {
  const participantCount = participants.length;

  return (
    <header className="h-16 px-4 border-b flex items-center justify-between bg-white">
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenParticipants}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <Users size={20} />
          <span>{participantCount}人が参加中</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onStartCall}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Video size={20} />
        </button>
        <button
          onClick={onOpenMenu}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreVertical size={20} />
        </button>
      </div>
    </header>
  );
}
