// src/components/features/investor/qa/QAResultItem.tsx
"use client";

import React from 'react';
import QACard from '@/components/ui/QACard';
import { QA, QAResultItemProps} from '@/types';



const QAResultItem: React.FC<QAResultItemProps> = ({ qa, onClickItem, onLike }) => {
  return (
    <div onClick={onClickItem}>
      <QACard
        mode="preview"
        role="investor"  // 投資家向けなので編集機能は表示されず、いいねのみ表示される
        qa={qa}
        onLike={onLike}
      />
    </div>
  );
};

export default QAResultItem;
