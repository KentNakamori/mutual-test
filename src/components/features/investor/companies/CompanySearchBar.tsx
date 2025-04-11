// src/components/features/investor/companies/CompanySearchBar.tsx
import React from 'react';
import SearchBar from '@/components/ui/SearchBar';
import { CompanySearchQuery, CompanySearchBarProps } from '@/types';

const CompanySearchBar: React.FC<CompanySearchBarProps> = ({ initialQuery, onSearchChange }) => {
  return (
    <div className="w-full mb-6">
      <SearchBar
        placeholder="企業名・キーワードで検索"
        initialKeyword={initialQuery.keyword}
        onSearch={(query, filters) => {
          onSearchChange({
            // キーワードは入力値、業種などは初期値あるいはフィルターで渡されたものを統合して返す
            keyword: query,
            industry: initialQuery.industry,
            ...filters,
          });
        }}
      />
    </div>
  );
};

export default CompanySearchBar;
