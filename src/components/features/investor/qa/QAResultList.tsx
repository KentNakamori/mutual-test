// src/components/features/investor/qa/QAResultList.tsx
"use client";

import React from 'react';
import { QA, QAResultListProps} from '@/types';
import QACard from '@/components/ui/QACard';

/**
 * QAResultList コンポーネント
 * 1列に縦方向のリストとして QA カードを表示します。
 */
const QAResultList: React.FC<QAResultListProps> = ({
  qas,
  onItemClick,
  onLike,
  getCompanyName,
  formatDate
}) => {
  if (qas.length === 0) {
    return <p className="text-center py-10 text-gray-500">検索結果がありません</p>;
  }

  return (
    <div className="space-y-4 my-6">
      {qas.map((qa) => (
        <QACard
          key={qa.qaId}
          mode="preview"
          role="investor"
          qa={qa}
          onSelect={() => onItemClick(qa)}
          onLike={onLike}
          getCompanyName={getCompanyName}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default QAResultList;
