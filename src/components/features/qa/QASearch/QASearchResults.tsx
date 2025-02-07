'use client'

import React from 'react';
import { QAStatusBadge } from '../../../common/qa/QAStatusBadge';
import type { QA } from '../../../../types/models';

interface QASearchResultsProps {
  results: QA[];
  query: string;
  isLoading: boolean;
  onSelect: (qa: QA) => void;
}

export const QASearchResults: React.FC<QASearchResultsProps> = ({
  results,
  query,
  isLoading,
  onSelect
}) => {
  if (isLoading) {
    return (
      <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
        <div className="px-4 py-3 text-sm text-gray-500">検索中...</div>
      </div>
    );
  }

  if (!query) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
        <div className="px-4 py-3 text-sm text-gray-500">
          検索結果が見つかりませんでした
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md bg-white shadow-lg">
      {results.map((qa) => (
        <button
          key={qa._id}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
          onClick={() => onSelect(qa)}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-900">
                Q{qa._id.slice(-4)}
              </div>
              <div className="text-sm text-gray-500 line-clamp-1">
                {qa.responses[0]?.content ?? '質問内容がここに表示されます'}
              </div>
            </div>
            <QAStatusBadge status={qa.status} />
          </div>
        </button>
      ))}
    </div>
  );
};
