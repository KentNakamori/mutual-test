import React from 'react';
import type { SortState } from '@/types/states';

interface MeetingSortProps {
  sort: SortState;
  onSortChange: (sort: SortState) => void;
}

const SORT_OPTIONS = [
  { value: 'date', label: '日付' },
  { value: 'status', label: 'ステータス' },
  { value: 'investor', label: '投資家名' },
];

export const MeetingSort: React.FC<MeetingSortProps> = ({ 
  sort, 
  onSortChange 
}) => {
  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange({
      ...sort,
      field: event.target.value
    });
  };

  const handleOrderChange = () => {
    onSortChange({
      ...sort,
      order: sort.order === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={sort.field}
        onChange={handleFieldChange}
        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        {SORT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}順
          </option>
        ))}
      </select>

      <button
        onClick={handleOrderChange}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
      >
        {sort.order === 'asc' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h5m0 0v8m0-8h2" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h5m0 0v8m0-8h2" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MeetingSort;
