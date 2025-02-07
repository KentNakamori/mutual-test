'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { FilterParams } from '@/types/api';

interface InvestorFilterProps {
  currentFilters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
}

export const InvestorFilter: React.FC<InvestorFilterProps> = ({
  currentFilters,
  onFilterChange,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              value={currentFilters.status || ''}
              onChange={(e) => onFilterChange({ ...currentFilters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">すべて</option>
              <option value="active">アクティブ</option>
              <option value="inactive">非アクティブ</option>
              <option value="pending">保留中</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              優先度
            </label>
            <select
              value={currentFilters.priority || ''}
              onChange={(e) => onFilterChange({ ...currentFilters, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">すべて</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>

          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          >
            {isAdvancedOpen ? '▼ 詳細検索を閉じる' : '▶ 詳細検索を開く'}
          </button>

          {isAdvancedOpen && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  開始日
                </label>
                <input
                  type="date"
                  value={currentFilters.startDate || ''}
                  onChange={(e) => onFilterChange({ ...currentFilters, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  終了日
                </label>
                <input
                  type="date"
                  value={currentFilters.endDate || ''}
                  onChange={(e) => onFilterChange({ ...currentFilters, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => onFilterChange({})}
              className="w-full px-4 py-2 text-sm text-center text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              フィルターをリセット
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorFilter;
