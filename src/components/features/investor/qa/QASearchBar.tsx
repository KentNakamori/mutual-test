// components/features/qa/QASearchBar.tsx
import React from 'react';
import { FilterType, FilterOption  } from '@/types';
import SearchBar from '@/components/ui/SearchBar';

// QA検索用のフィルターオプション
const qaFilterOptions: FilterOption[] = [
  { 
    id: 'company', 
    label: '企業名', 
    type: 'select',
    options: [
      { value: 'comp1', label: 'テック・イノベーター株式会社' },
      { value: 'comp2', label: 'グリーンエナジー株式会社' }
    ]
  },
  { 
    id: 'fiscalPeriod', 
    label: '決算期', 
    type: 'select',
    options: [
      { value: '2025-Q1', label: '2025年度 Q1' },
      { value: '2025-Q2', label: '2025年度 Q2' },
      { value: '2025-Q3', label: '2025年度 Q3' },
      { value: '2025-Q4', label: '2025年度 Q4' }
    ]
  },
  { 
    id: 'genre', 
    label: 'ジャンル', 
    type: 'select',
    options: [
      { value: '業績', label: '業績' },
      { value: '人材戦略', label: '人材戦略' },
      { value: '経営戦略', label: '経営戦略' }
    ]
  }
];

interface QASearchBarProps {
  onSearchSubmit: (keyword: string, filters: FilterType) => void;
  initialKeyword?: string;
  initialFilters?: FilterType;
}

const QASearchBar: React.FC<QASearchBarProps> = ({ 
  onSearchSubmit, 
  initialKeyword = '', 
  initialFilters = {} 
}) => {
  return (
    <SearchBar
      placeholder="QA内容や企業名で検索"
      initialKeyword={initialKeyword}
      initialFilters={initialFilters}
      filterOptions={qaFilterOptions}
      buttonLabel="検索"
      filterButtonLabel="詳細検索"
      onSearch={onSearchSubmit}
    />
  );
};

export default QASearchBar;