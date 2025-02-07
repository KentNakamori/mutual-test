'use client'

import React, { useState } from 'react';
import { QASearchBar } from './QASearchBar';
import { QASearchResults } from './QASearchResults';
import type { QA } from '../../../../types/models';

interface QASearchProps {
  onSearch: (query: string) => Promise<QA[]>;
  onSelect: (qa: QA) => void;
}

export const QASearch: React.FC<QASearchProps> = ({
  onSearch,
  onSelect
}) => {
  const [results, setResults] = useState<QA[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await onSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (qa: QA) => {
    onSelect(qa);
    setResults([]);
    setQuery('');
  };

  return (
    <div className="relative">
      <QASearchBar
        onSearch={handleSearch}
        placeholder="QAを検索..."
      />
      <QASearchResults
        results={results}
        query={query}
        isLoading={isLoading}
        onSelect={handleSelect}
      />
    </div>
  );
};