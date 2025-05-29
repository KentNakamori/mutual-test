// src/components/features/investor/chat/ChatLogsSearchBar.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { FilterType, ChatLogsSearchBarProps } from '@/types';
import { Search } from 'lucide-react';

const ChatLogsSearchBar: React.FC<ChatLogsSearchBarProps> = ({
  onSearch,
  initialKeyword = '',
  loading = false
}) => {
  const [localKeyword, setLocalKeyword] = useState<string>(initialKeyword);
  const [localFilter, setLocalFilter] = useState<FilterType>({});

  // initialKeywordが変更された時にlocalKeywordを更新
  useEffect(() => {
    setLocalKeyword(initialKeyword);
  }, [initialKeyword]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSearch(localKeyword, localFilter);
  };

  return (
    <div className="relative flex-grow max-w-md mb-6">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            placeholder="検索ワードを入力してください... "
            disabled={loading}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatLogsSearchBar;
