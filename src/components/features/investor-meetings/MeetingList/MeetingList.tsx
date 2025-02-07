'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '../shared/StatusBadge';
import { MeetingCard } from './MeetingCard';
import { MeetingFilter } from './MeetingFilter';
import { MeetingSort } from './MeetingSort';
import type { Meeting } from '@/types/models';

interface MeetingListProps {
  meetings: Meeting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: {
    status?: string;
    investorId?: string;
  };
  sort: {
    field: string;
    order: 'asc' | 'desc';
  };
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: SortState) => void;
  onPageChange: (page: number) => void;
}

export const MeetingList: React.FC<MeetingListProps> = ({
  meetings,
  pagination,
  filters,
  sort,
  onFilterChange,
  onSortChange,
  onPageChange,
}) => {
  const handleFilterChange = (newFilters: FilterState) => {
    onFilterChange(newFilters);
  };

  const handleSortChange = (newSort: SortState) => {
    onSortChange(newSort);
  };

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <MeetingFilter 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
        <MeetingSort 
          sort={sort} 
          onSortChange={handleSortChange} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            className="transition-transform duration-200 hover:scale-105"
          />
        ))}
      </div>

      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: Math.ceil(pagination.total / pagination.limit) }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded ${
              pagination.page === index + 1
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MeetingList;