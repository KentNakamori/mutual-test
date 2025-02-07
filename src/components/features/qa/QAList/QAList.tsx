'use client'

import React, { useState } from 'react';
import { QAListHeader } from './QAListHeader';
import { QAListFilters } from './QAListFilters';
import { QAListItem } from './QAListItem';
import type { QA } from '../../../../types/models';
import type { FilterParams, SortParams, PaginationParams } from '../../../types/api';

interface QAListProps {
  data: QA[];
  totalCount: number;
  filters: FilterParams;
  sort: SortParams;
  pagination: PaginationParams;
  onFilterChange: (filters: FilterParams) => void;
  onSortChange: (sort: SortParams) => void;
  onPageChange: (page: number) => void;
  onQASelect: (id: string) => void;
}

export const QAList: React.FC<QAListProps> = ({
  data,
  totalCount,
  filters,
  sort,
  pagination,
  onFilterChange,
  onSortChange,
  onPageChange,
  onQASelect
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      <QAListHeader
        sort={sort}
        onSortChange={onSortChange}
        totalCount={totalCount}
        pageSize={pagination.limit}
        onPageSizeChange={(limit) => onPageChange({ ...pagination, limit })}
      />

      <QAListFilters
        filters={filters}
        onFilterChange={onFilterChange}
        isOpen={isFiltersOpen}
        onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      <div className="divide-y divide-gray-200">
        {data.map(qa => (
          <QAListItem
            key={qa._id}
            qa={qa}
            onClick={() => onQASelect(qa._id)}
          />
        ))}
      </div>

      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            前へ
          </button>
          <button
            onClick={() => onPageChange({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page * pagination.limit >= totalCount}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            次へ
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              全<span className="font-medium">{totalCount}</span>件中
              <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
              から
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, totalCount)}
              </span>
              件を表示
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              {/* Pagination buttons */}
              {Array.from({ length: Math.ceil(totalCount / pagination.limit) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onPageChange({ ...pagination, page: index + 1 })}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pagination.page === index + 1
                      ? 'z-10 bg-black text-white border-black'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
