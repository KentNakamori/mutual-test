'use client'

import React, { useState, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { Card, CardContent } from '@/components/ui/card';

interface InvestorSearchProps {
  onSearch: (query: string) => void;
}

export const InvestorSearch: React.FC<InvestorSearchProps> = ({
  onSearch,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 検索履歴をローカルストレージから取得
  const getSearchHistory = (): string[] => {
    const history = localStorage.getItem('investorSearchHistory');
    return history ? JSON.parse(history) : [];
  };

  // 検索履歴を保存
  const saveToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const history = getSearchHistory();
    const newHistory = [
      searchQuery,
      ...history.filter(item => item !== searchQuery)
    ].slice(0, 5); // 最大5件まで保存

    localStorage.setItem('investorSearchHistory', JSON.stringify(newHistory));
  };

  // 検索実行をdebounce
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
      if (searchQuery.trim()) {
        saveToHistory(searchQuery);
      }
    }, 300),
    []
  );

  // 検索ハンドラー
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    debouncedSearch(searchQuery);

    // サジェスト表示の制御
    if (searchQuery.trim()) {
      const history = getSearchHistory();
      const filtered = history.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // サジェスト選択ハンドラー
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  // クリアボタンハンドラー
  const handleClear = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="投資家名、会社名で検索..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              onFocus={() => setShowSuggestions(true)}
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* サジェスト一覧 */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorSearch;
