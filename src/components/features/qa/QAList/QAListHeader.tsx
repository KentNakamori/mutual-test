'use client'

import React from 'react';
import type { SortParams } from '../../../../types/api';

interface QAListHeaderProps {
  sort: SortParams;
  onSortChange: (sort: SortParams) => void;
  totalCount: number;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export const QAListHeader: React.FC<QAListHeaderProps> = ({
  sort,
  onSortChange,
  totalCount,
  pageSize,
  onPageSizeChange
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <div className="text-sm text-gray-600">
        全{totalCount}件
      </div>
      <div className="flex items-center space-x-4">
        <select
          className="p-2 border border-gray-200 rounded-md text-sm"
          value={sort.field}
          onChange={(e) => onSortChange({
            field: e.target.value,
            direction: sort.direction
          })}
        >
          <option value="updated_at">更新日時</option>
          <option value="created_at">作成日時</option>
          <option value="priority">優先度</option>
          <option value="status">ステータス</option>
        </select>
        <select
          className="p-2 border border-gray-200 rounded-md text-sm"
          value={sort.direction}
          onChange={(e) => onSortChange({
            field: sort.field,
            direction: e.target.value as 'asc' | 'desc'
          })}
        >
          <option value="desc">降順</option>
          <option value="asc">昇順</option>
        </select>
        <select
          className="p-2 border border-gray-200 rounded-md text-sm"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value="10">10件</option>
          <option value="20">20件</option>
          <option value="50">50件</option>
        </select>
      </div>
    </div>
  );
};
