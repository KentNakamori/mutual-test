// src/components/features/investor/chat/ChatLogsSearchBar.tsx
import React, { useState, FormEvent } from 'react';
import { FilterType, ChatLogsSearchBarProps } from '@/types';
import { Search } from 'lucide-react';

const ChatLogsSearchBar: React.FC<ChatLogsSearchBarProps> = ({
  onSearchSubmit
}) => {
  const [localKeyword, setLocalKeyword] = useState<string>('');
  const [localFilter, setLocalFilter] = useState<FilterType>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localKeyword, localFilter);
  };

  return (
    <div className="relative flex-grow max-w-md mb-6">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            placeholder="検索ワードを入力してください..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </form>
    </div>
  );
};

export default ChatLogsSearchBar;
