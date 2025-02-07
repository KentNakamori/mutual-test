import React, { useState } from 'react';
import { InvestorSelect } from '../shared/InvestorSelect';
import type { FilterState } from '@/types/states';

interface MeetingFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const STATUS_OPTIONS = [
  { value: 'scheduled', label: '予定済み' },
  { value: 'in_progress', label: '進行中' },
  { value: 'completed', label: '完了' },
  { value: 'cancelled', label: 'キャンセル' },
];

export const MeetingFilter: React.FC<MeetingFilterProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      status: event.target.value || undefined
    });
  };

  const handleInvestorChange = (investorId: string | undefined) => {
    onFilterChange({
      ...filters,
      investorId
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="space-y-2">
        <label 
          htmlFor="status-filter" 
          className="block text-sm font-medium text-gray-600"
        >
          ステータス
        </label>
        <select
          id="status-filter"
          value={filters.status || ''}
          onChange={handleStatusChange}
          className="w-40 px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          <option value="">全て</option>
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">
          投資家
        </label>
        <InvestorSelect
          value={filters.investorId}
          onChange={handleInvestorChange}
          className="w-64"
        />
      </div>
    </div>
  );
};

export default MeetingFilter;
