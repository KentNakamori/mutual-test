'use client'

import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import type { FilterParams } from '../../../../types/api';

interface QAListFiltersProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const QAListFilters: React.FC<QAListFiltersProps> = ({
  filters,
  onFilterChange,
  isOpen,
  onToggle
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <button
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          <Filter size={20} />
          <span className="font-medium">フィルター</span>
        </div>
        <ChevronDown
          size={20}
          className={`transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              className="w-full p-2 border border-gray-200 rounded-md"
              value={filters.status || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                status: e.target.value || undefined
              })}
            >
              <option value="">全て</option>
              <option value="new">新規</option>
              <option value="in_progress">対応中</option>
              <option value="resolved">解決済み</option>
              <option value="closed">完了</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              優先度
            </label>
            <select
              className="w-full p-2 border border-gray-200 rounded-md"
              value={filters.priority || ''}
              onChange={(e) => onFilterChange({
                ...filters,
                priority: e.target.value || undefined
              })}
            >
              <option value="">全て</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始日
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-200 rounded-md"
                value={filters.startDate || ''}
                onChange={(e) => onFilterChange({
                  ...filters,
                  startDate: e.target.value || undefined
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                終了日
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-200 rounded-md"
                value={filters.endDate || ''}
                onChange={(e) => onFilterChange({
                  ...filters,
                  endDate: e.target.value || undefined
                })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
