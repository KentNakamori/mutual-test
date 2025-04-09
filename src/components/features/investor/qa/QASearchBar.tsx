// src/components/features/investor/qa/QASearchBar.tsx
"use client";

import React from 'react';
import SearchForm from '@/components/ui/SearchForm';
import { QASearchBarProps, FilterType } from '@/types';

const QASearchBar: React.FC<QASearchBarProps> = ({ onSearchSubmit }) => {
  return (
    <div className="mb-4">
      <SearchForm
        initialQuery=""
        onSearch={({ query, filter, sortOrder }) => {
          onSearchSubmit(query, { filter, sortOrder } as FilterType);
        }}
      />
    </div>
  );
};

export default QASearchBar;
