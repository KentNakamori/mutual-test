// src/components/features/investor/qa/QAResultItem.tsx
"use client";

import React from 'react';
import QACard from '@/components/ui/QACard';
import { QA, QAResultItemProps } from '@/types';

const QAResultItem: React.FC<QAResultItemProps> = ({ qa, onClickItem, onLike }) => {
  return (
    <QACard
      mode="preview"
      role="investor"  // 投資家向けなので編集機能は表示されず、いいねのみ表示される
      qa={qa}
      // onSelect は qa.qaId を引数として渡すので、その qaId と QA オブジェクトの両方を渡す
      onSelect={(qaId: string) => onClickItem && onClickItem(qa, qaId)}
      onLike={onLike}
    />
  );
};

export default QAResultItem;
