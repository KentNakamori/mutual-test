// src/components/features/investor/companies/CompanySearchBar.tsx
"use client";

import React from 'react';
import SearchForm from '@/components/ui/SearchForm';
import { CompanySearchQuery, CompanySearchBarProps } from '../../../../types';

const CompanySearchBar: React.FC<CompanySearchBarProps> = ({ initialQuery, onSearchChange }) => {
  return (
    // 左寄せでw-1/2の幅、mb-6で下部余白
    <div className="w-1/2 mb-6">
      <SearchForm
        initialQuery={initialQuery.keyword}
        onSearch={(params) => {
          onSearchChange({
            keyword: params.query,
            industry: initialQuery.industry, // 業種はそのまま引き継ぐ
            filter: params.filter,
            sortOrder: params.sortOrder,
          });
        }}
      />
    </div>
  );
};

export default CompanySearchBar;
