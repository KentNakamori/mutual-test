//src\components\features\investor\company\QASearchBar.tsx

import React from 'react';
import { FilterOption, QaSearchBarProps } from '@/types';
import SearchBar from '@/components/ui/SearchBar';
import { GENRE_OPTIONS, QUESTION_ROUTE_OPTIONS } from '@/components/ui/tagConfig';

/**
 * 企業ページ用QASearchBar コンポーネント
 * 特定企業のQAを検索・フィルタリングするための検索バーを提供します。
 */
const QASearchBar: React.FC<QaSearchBarProps> = ({ 
  onSearchSubmit, 
  onSortChange, 
  initialKeyword = '', 
  initialFilters = {} 
}) => {
  // 企業ページ用QA検索フィルターオプション
  const qaFilterOptions: FilterOption[] = [
    {
      id: 'question_route',
      label: '質問ルート',
      type: 'select',
      options: QUESTION_ROUTE_OPTIONS.map(option => ({
        value: option.label,
        label: option.label
      }))
    },
    {
      id: 'genre',
      label: 'ジャンル',
      type: 'multiSelect',
      options: GENRE_OPTIONS.map(option => ({
        value: option.label,
        label: option.label
      }))
    },
    {
      id: 'fiscalPeriod',
      label: '対象決算期',
      type: 'fiscalPeriod'
    }
  ];

  // ソートオプション
  const qaSortOptions = [
    { value: 'createdAt_desc', label: '作成日（新しい順）' },
    { value: 'createdAt_asc', label: '作成日（古い順）' },
    { value: 'likeCount_desc', label: 'いいね数（多い順）' },
    { value: 'likeCount_asc', label: 'いいね数（少ない順）' }
  ];

  const handleSearch = (keyword: string, filters: any) => {
    console.log('Company QASearchBar - 受け取ったフィルター:', filters);
    
    // フィルターの処理
    
    // ジャンルの処理 (配列として処理)
    let genreArray: string[] | undefined = undefined;
    if (filters.genre) {
      if (Array.isArray(filters.genre)) {
        const validGenres = filters.genre.filter((g: string) => g && g.trim() !== '');
        if (validGenres.length > 0) {
          genreArray = validGenres;
        }
      } else if (typeof filters.genre === 'string' && filters.genre.trim() !== '') {
        genreArray = [filters.genre];
      }
    }
    
    // 決算期の処理 (配列として処理)
    let fiscalPeriodArray: string[] | undefined = undefined;
    if (filters.fiscalPeriod) {
      if (Array.isArray(filters.fiscalPeriod)) {
        const validPeriods = filters.fiscalPeriod.filter((p: string) => p && p.trim() !== '');
        if (validPeriods.length > 0) {
          fiscalPeriodArray = validPeriods;
        }
      } else if (typeof filters.fiscalPeriod === 'string' && filters.fiscalPeriod.trim() !== '') {
        fiscalPeriodArray = [filters.fiscalPeriod];
      }
    }
    
    // question_routeの処理
    let questionRoute: string | undefined = undefined;
    if (filters.question_route) {
      if (typeof filters.question_route === 'string' && filters.question_route.trim() !== '') {
        questionRoute = filters.question_route;
      } else if (Array.isArray(filters.question_route) && filters.question_route.length > 0) {
        questionRoute = filters.question_route[0];
      }
    }
    
    // ソートの処理
    let sortKey: 'createdAt' | 'likeCount' = 'createdAt';
    let sortOrder: 'asc' | 'desc' = 'desc';
    
    if (filters.sort && typeof filters.sort === 'string') {
      const parts = filters.sort.split('_');
      if (parts.length === 2) {
        if (parts[0] === 'createdAt' || parts[0] === 'likeCount') {
          sortKey = parts[0];
        }
        if (parts[1] === 'asc' || parts[1] === 'desc') {
          sortOrder = parts[1];
        }
      }
    }
    
    // 明示的なorder指定がある場合はそちらを優先
    if (filters.order && (filters.order === 'asc' || filters.order === 'desc')) {
      sortOrder = filters.order;
    }
    
    // 検索条件をクリーンに整形
    const searchParams = {
      keyword: keyword || '',
      question_route: questionRoute,
      genre: genreArray,
      fiscalPeriod: fiscalPeriodArray,
      sort: sortKey,
      order: sortOrder
    };
    
    console.log('Company QASearchBar - 送信する検索条件:', searchParams);
    if (onSearchSubmit) {
      onSearchSubmit(searchParams.keyword, searchParams);
    }
    
    // ソート変更の通知
    if (onSortChange && filters.sort) {
      onSortChange(filters.sort);
    }
  };

  return (
    <div className="mb-4">
      <SearchBar
        placeholder="キーワードで検索"
        initialKeyword={initialKeyword}
        initialFilters={initialFilters}
        filterOptions={qaFilterOptions}
        sortOptions={qaSortOptions}
        filterButtonLabel="詳細検索"
        onSearch={handleSearch}
        onSort={onSortChange}
      />
    </div>
  );
};

export default QASearchBar;
