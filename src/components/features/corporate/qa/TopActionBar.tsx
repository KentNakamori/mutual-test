// src/components/features/corporate/qa/TopActionBar.tsx
import React from 'react';
import SearchBar from '@/components/ui/SearchBar';
import UploadButton from './UploadButton';
import { TopActionBarProps } from '@/types';
import { categories_OPTIONS, QUESTION_ROUTE_OPTIONS } from '@/components/ui/tagConfig';
import { FilterOption } from '@/types';

const TopActionBar: React.FC<TopActionBarProps> = ({ onSearch, onUploadClick }) => {
  // 直近3年分の決算期を生成
  const generateFiscalPeriods = () => {
    const currentYear = new Date().getFullYear();
    const periods = [];
    for (let year = currentYear; year >= currentYear - 2; year--) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        periods.push({
          value: `${year}-Q${quarter}`,
          label: `${year}-Q${quarter}`
        });
      }
    }
    return periods;
  };

  const filterOptions: FilterOption[] = [
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
      id: 'categories',
      label: 'カテゴリー',
      type: 'select',
      options: categories_OPTIONS.map(option => ({
        value: option.label,
        label: option.label
      }))
    },
    {
      id: 'fiscalPeriod',
      label: '対象決算期',
      type: 'select',
      options: generateFiscalPeriods()
    }
  ];

  const sortOptions = [
    { value: "createdAt_desc", label: "作成日（新しい順）" },
    { value: "createdAt_asc", label: "作成日（古い順）" },
    { value: "likeCount_desc", label: "いいね数（多い順）" }
  ];

  const handleSearch = (keyword: string, filters: any) => {
    console.log('TopActionBar - 受け取ったフィルター:', filters);
    
    // 1. フィルターの処理 - すべて明示的に処理する
    
    // ジャンルの処理 (配列または文字列を適切に処理)
    let categoriesArray: string[] | undefined = undefined;
    if (filters.categories) {
      if (Array.isArray(filters.categories)) {
        const validcategoriess = filters.categories.filter((g: string) => g && g.trim() !== '');
        if (validcategoriess.length > 0) {
          categoriesArray = validcategoriess;
        }
      } else if (typeof filters.categories === 'string' && filters.categories.trim() !== '') {
        categoriesArray = [filters.categories];
      }
    }
    
    // 決算期の処理
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
    
    // question_routeの処理（単一の文字列として処理）
    let questionRoute: string | undefined = undefined;
    if (filters.question_route) {
      if (typeof filters.question_route === 'string' && filters.question_route.trim() !== '') {
        questionRoute = filters.question_route;
      } else if (Array.isArray(filters.question_route) && filters.question_route.length > 0) {
        // 配列の場合は最初の要素を使用
        questionRoute = filters.question_route[0];
      }
    }
    
    // 2. ソートの処理
    let sortKey: 'createdAt' | 'likeCount' | undefined = undefined;
    let sortOrder: 'asc' | 'desc' = 'desc';
    
    if (filters.sort && typeof filters.sort === 'string') {
      // 'createdAt_desc' 形式からsortKeyとorderを抽出
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
    
    // デフォルト値の設定
    if (!sortKey) {
      sortKey = 'createdAt';
    }
    
    // 3. 検索条件をクリーンに整形
    const searchParams = {
      query: keyword || '',
      question_route: questionRoute,
      categories: categoriesArray,
      fiscalPeriod: fiscalPeriodArray,
      sort: sortKey,
      order: sortOrder
    };
    
    console.log('TopActionBar - 送信する検索条件:', searchParams);
    onSearch(searchParams);
  };

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex-grow mr-4">
        <SearchBar
          placeholder="Q&Aを検索"
          filterOptions={filterOptions}
          sortOptions={sortOptions}
          onSearch={handleSearch}
        />
      </div>
      <UploadButton onClick={onUploadClick} />
    </div>
  );
};

export default TopActionBar;
