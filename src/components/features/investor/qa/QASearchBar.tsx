// components/features/qa/QASearchBar.tsx
import React from 'react';
import { FilterType, FilterOption, QASearchBarProps} from '@/types';
import SearchBar from '@/components/ui/SearchBar';

// QA検索用フィルターオプション（決算期、ジャンル）
const qaFilterOptions: FilterOption[] = [
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

// ソートオプション（作成日順、いいね数）
const qaSortOptions = [
    { value: 'createdAt_desc', label: '作成日: 新しい順' },
    { value: 'createdAt_asc', label: '作成日: 古い順' },
    { value: 'likeCount_desc', label: 'いいね数: 高い順' },
    { value: 'likeCount_asc', label: 'いいね数: 低い順' }
  ];



const QASearchBar: React.FC<QASearchBarProps> = ({ 
  onSearchSubmit, 
  onSortChange, 
  initialKeyword = '', 
  initialFilters = {} 
}) => {
  return (
    <SearchBar
      placeholder="キーワードや企業名で検索"
      initialKeyword={initialKeyword}
      initialFilters={initialFilters}
      filterOptions={qaFilterOptions}
      sortOptions={qaSortOptions}
      // 共通UIの「詳細検索」ボタンラベルはそのまま利用
      filterButtonLabel="詳細検索"
      onSearch={onSearchSubmit}
      onSort={onSortChange}
    />
  );
};

export default QASearchBar;
