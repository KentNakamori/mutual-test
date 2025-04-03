//src/components/features/investor/qa/QAResultList.tsx
"use client";

import React from 'react';
import { QA, QAResultListProps} from '@/types';
import QAResultItem from './QAResultItem';



/**
 * QAResultList コンポーネント
 * ・検索結果リストを表示し、結果が0件の場合はメッセージを表示します。
 */
const QAResultList: React.FC<QAResultListProps> = ({ items, onItemClick, onLike, onBookmark }) => {
  if (items.length === 0) {
    return <p>該当するQ&Aが見つかりませんでした。</p>;
  }
  return (
    <div className="space-y-4">
      {items.map((qa) => (
        <QAResultItem
          key={qa.qaId}
          qa={qa}
          onClickItem={() => onItemClick(qa)}
          onLike={onLike}
          onBookmark={onBookmark}
        />
      ))}
    </div>
  );
};

export default QAResultList;
