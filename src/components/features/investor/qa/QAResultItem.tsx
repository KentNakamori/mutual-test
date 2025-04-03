// src/components/features/investor/qa/QAResultItem.tsx
"use client";

import React from 'react';
import QACard, { QAData } from '@/components/ui/QACard';
import { QA } from '@/types';

export interface QAResultItemProps {
  /** 表示対象のQ&Aデータ */
  qa: QA;
  /** 項目クリック時のハンドラ */
  onClickItem: () => void;
  /** いいね操作ハンドラ */
  onLike: (qaId: string) => void;
}

const QAResultItem: React.FC<QAResultItemProps> = ({ qa, onClickItem, onLike }) => {
  // QA 型から共通QAカード用の型（QAData）への変換
  const qaData: QAData = {
    id: qa.qaId,
    title: qa.question, // タイトルがない場合は質問文をタイトルとして利用
    question: qa.question,
    answer: qa.answer,
    createdAt: qa.createdAt,
    views: qa.views,
    likeCount: qa.likeCount,
    tags: qa.tags || [],
    genreTags: qa.genreTags || [],
    updatedAt: qa.updatedAt,
  };

  return (
    <div onClick={onClickItem}>
      <QACard
        mode="preview"
        role="investor"  // 投資家向けとして編集機能が非表示になる
        qa={qaData}
        onLike={onLike}
      />
    </div>
  );
};

export default QAResultItem;
