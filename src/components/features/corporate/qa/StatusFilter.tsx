import React from 'react';

export type ReviewStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED';

interface StatusFilterProps {
  selectedStatus: ReviewStatus | 'all';
  onStatusChange: (status: ReviewStatus | 'all') => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatus, onStatusChange }) => {
  const statusOptions = [
    { value: 'all', label: 'すべて', count: 0 },
    { value: 'DRAFT', label: '下書き', count: 0 },
    { value: 'PENDING', label: '非公開', count: 0 },
    { value: 'PUBLISHED', label: '公開済み', count: 0 }
  ];

  return (
    <div className="mb-6">
      <div className="flex space-x-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value as ReviewStatus | 'all')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
              selectedStatus === option.value
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{option.label}</span>
            {option.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                selectedStatus === option.value
                  ? 'bg-blue-400'
                  : 'bg-gray-200'
              }`}>
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter; 