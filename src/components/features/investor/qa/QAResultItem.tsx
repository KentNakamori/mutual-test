// src/components/features/investor/qa/QAResultItem.tsx
"use client";

import React from 'react';
import QACard from '@/components/ui/QACard';
import { QA, QAResultItemProps } from '@/types';

const QAResultItem: React.FC<QAResultItemProps & {
  getCompanyName?: (companyId: string) => string;
  formatDate?: (dateStr: string) => string;
}> = ({ qa, onClickItem, onLike, getCompanyName, formatDate }) => {
  // onSelectの呼び出し時に QA 自体も渡す
  const handleSelect = (qaId: string) => {
    onClickItem && onClickItem(qa, qaId);
  };

  return (
    <QACard
      mode="preview"
      role="investor"
      qa={qa}
      onSelect={handleSelect}
      onLike={onLike}
      getCompanyName={getCompanyName}
      formatDate={formatDate}
    />
  );
};

export default QAResultItem;
