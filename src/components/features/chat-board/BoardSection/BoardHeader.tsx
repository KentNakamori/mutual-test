// components/features/chat-board/BoardSection/BoardHeader.tsx
import React from 'react';
import { Search, Plus } from 'lucide-react';

interface BoardHeaderProps {
  onSearch: (query: string) => void;
  onCreatePost: () => void;
}

export default function BoardHeader({ onSearch, onCreatePost }: BoardHeaderProps) {
  return (
    <header className="h-16 px-4 border-b flex items-center justify-between bg-white">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="search"
            placeholder="投稿を検索..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      <button
        onClick={onCreatePost}
        className="ml-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        <Plus size={20} />
        <span>新規投稿</span>
      </button>
    </header>
  );
}
