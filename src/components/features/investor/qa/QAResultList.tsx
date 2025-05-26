// src/components/features/investor/qa/QAResultList.tsx
"use client";

import React, { useEffect } from 'react';
import { QA, QAResultListProps } from '@/types';
import QACard from '@/components/ui/QACard';

/**
 * QAResultList コンポーネント
 * 1列に縦方向のリストとして QA カードを表示します。
 */
const QAResultList: React.FC<QAResultListProps> = ({
  qas = [],
  onItemClick,
  onLike,
  getCompanyName,
  formatDate
}) => {
  // コンポーネントマウント時とqasが変更されたときにデバッグ情報を出力
  useEffect(() => {
    console.log('QAResultList: qas received:', qas);
    console.log('QAResultList: qas length:', qas?.length);
    if (qas?.length > 0) {
      console.log('QAResultList: first qa sample:', qas[0]);
    }
  }, [qas]);

  // qasがundefined/null、または空配列の場合
  if (!qas || qas.length === 0) {
    console.log('QAResultList: No results to display');
    return <p className="text-center py-10 text-gray-500">検索結果がありません</p>;
  }

  // qasのデータ形式をチェック（qaIdがあるか確認）
  const validQAs = qas.filter(qa => qa && qa.qaId);
  if (validQAs.length === 0) {
    console.log('QAResultList: No valid QAs with qaId');
    return <p className="text-center py-10 text-gray-500">有効なQAデータがありません</p>;
  }

  return (
    <div className="space-y-4 my-6">
      {validQAs.map((qa) => {
        console.log(`QAResultList: Rendering QA ${qa.qaId}`);
        return (
          <QACard
            key={qa.qaId}
            mode="preview"
            role="investor"
            qa={qa}
            onSelect={() => {
              console.log(`QAResultList: QA selected: ${qa.qaId}`);
              onItemClick(qa);
            }}
            onLike={(qaId) => {
              console.log(`QAResultList: QA liked: ${qaId}`);
              onLike(qaId);
            }}
          />
        );
      })}
    </div>
  );
};

export default QAResultList;
