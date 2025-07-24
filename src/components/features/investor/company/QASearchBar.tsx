//src\components\features\investor\company\QASearchBar.tsx

import React, { useState, useEffect } from 'react';
import { FilterOption, QaSearchBarProps } from '@/types';
import SearchBar from '@/components/ui/SearchBar';
import { CATEGORY_OPTION, QUESTION_ROUTE_OPTIONS } from '@/components/ui/tagConfig';
import { Bookmark } from 'lucide-react';

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
  // ブックマークフィルターの状態
  const [isBookmarkedOnly, setIsBookmarkedOnly] = useState<boolean>(
    initialFilters.isBookmarked || false
  );

  // 企業ページ用QA検索フィルターオプション（ブックマークフィルターを除く）
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
      id: 'category',
      label: 'カテゴリ',
      type: 'multiSelect',
      options: CATEGORY_OPTION.map(option => ({
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

  // 初期値の変更を監視してブックマークフィルターを更新
  useEffect(() => {
    if (initialFilters.isBookmarked !== isBookmarkedOnly) {
      setIsBookmarkedOnly(initialFilters.isBookmarked || false);
    }
  }, [initialFilters.isBookmarked]);

  // ブックマークフィルターの切り替え
  const handleBookmarkToggle = () => {
    const newBookmarkState = !isBookmarkedOnly;
    setIsBookmarkedOnly(newBookmarkState);
    
    // 現在のフィルターにブックマークフィルターを追加して検索実行
    const updatedFilters = {
      ...initialFilters,
      isBookmarked: newBookmarkState || undefined
    };
    
    if (onSearchSubmit) {
      onSearchSubmit(initialKeyword, updatedFilters);
    }
  };

  const handleSearch = (keyword: string, filters: any) => {
    console.log('Company QASearchBar - 受け取ったフィルター:', filters);
    
    // フィルターの処理
    
    // カテゴリの処理 (配列として処理)
    let categoryArray: string[] | undefined = undefined;
    if (filters.category) {
      if (Array.isArray(filters.category)) {
        const validCategories = filters.category.filter((g: string) => g && g.trim() !== '');
        if (validCategories.length > 0) {
          categoryArray = validCategories;
        }
      } else if (typeof filters.category === 'string' && filters.category.trim() !== '') {
        categoryArray = [filters.category];
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
    
    // 検索条件をクリーンに整形（現在のブックマークフィルターの状態を含める）
    const searchParams = {
      keyword: keyword || '',
      question_route: questionRoute,
      category: categoryArray,
      fiscalPeriod: fiscalPeriodArray,
      isBookmarked: isBookmarkedOnly || undefined,
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
        additionalButtons={
          <button
            onClick={handleBookmarkToggle}
            className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
              isBookmarkedOnly
                ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title={isBookmarkedOnly ? 'ブックマーク済みのみ表示中' : 'ブックマーク済みのみ表示'}
          >
            <Bookmark 
              size={16} 
              className={`mr-2 ${isBookmarkedOnly ? 'fill-current' : ''}`}
            />
            <span className="text-sm font-medium">
              ブックマーク
            </span>
          </button>
        }
      />
    </div>
  );
};

export default QASearchBar;
