// src/components/features/investor/qa/QAResultItem.tsx
"use client";

import React from 'react';
import QACard from '@/components/ui/QACard';
import { QAResultItemProps } from '@/types';

const QAResultItem: React.FC<QAResultItemProps> = ({ qa, onClickItem, onLike }) => {
  // onSelectの呼び出し時に QA 自体も渡す
  const handleSelect = (qaId: string) => {
    if (onClickItem) {
      onClickItem(qa, qaId);
    }
  };

  return (
    <QACard
      mode="preview"
      role="investor"
      qa={qa}
      onSelect={handleSelect}
      onLike={onLike}
    />
  );
};

export default QAResultItem;
