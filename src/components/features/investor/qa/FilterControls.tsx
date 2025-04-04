// src/components/features/investor/qa/FilterControls.tsx
"use client";

import React from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { FilterType, FilterControlsProps } from '@/types';

/**
 * FilterControls コンポーネント
 * ・いいね数の最小値入力と日付範囲選択を提供します。
 */
const FilterControls: React.FC<FilterControlsProps> = ({ filters, onChangeFilters }) => {
  // いいね数の入力変更ハンドラ
  const handleLikeCountChange = (value: string) => {
    const likeMin = Number(value);
    onChangeFilters({ ...filters, likeMin });
  };

  // 日付範囲選択のハンドラ（例として「全期間」「先週」「先月」を用意）
  const dateOptions = [
    { label: '全期間', value: 'all' },
    { label: '先週', value: 'last_week' },
    { label: '先月', value: 'last_month' },
  ];

  const handleDateChange = (value: string) => {
    let dateRange;
    const now = new Date();
    if (value === 'last_week') {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateRange = { from: lastWeek.toISOString(), to: now.toISOString() };
    } else if (value === 'last_month') {
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateRange = { from: lastMonth.toISOString(), to: now.toISOString() };
    } else {
      dateRange = undefined;
    }
    onChangeFilters({ ...filters, dateRange });
  };

  return (
    <div className="flex space-x-4">
      <div>
        <label className="block text-sm mb-1">最小いいね数</label>
        <Input 
          value={filters.likeMin ? filters.likeMin.toString() : ''}
          onChange={handleLikeCountChange}
          placeholder="例: 10"
          type="number"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">日付範囲</label>
        <Select 
          options={dateOptions}
          // ここは簡易的な実装例として、dateRange が存在すれば 'last_week' を、なければ 'all' としています
          value={filters.dateRange ? 'last_week' : 'all'}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
};

export default FilterControls;
