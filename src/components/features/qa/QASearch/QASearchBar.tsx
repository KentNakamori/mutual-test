'use client'

import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import debounce from 'lodash/debounce';

interface QASearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const QASearchBar: React.FC<QASearchBarProps> = ({
  onSearch,
  placeholder = 'キーワードを入力...'
}) => {
  const [query, setQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((value: string) => onSearch(value), 300),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="block w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-10 text-sm placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        placeholder={placeholder}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};
