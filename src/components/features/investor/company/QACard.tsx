//src\components\features\investor\company\QACard.tsx

import React from 'react';
import Card from '@/components/ui/Card';
import { QACardProps } from '../../../../types';


/**
 * QACard コンポーネント
 * QAの要約情報（質問、回答要約、いいね数）をカード形式で表示します。
 */
const QACard: React.FC<QACardProps & { onClick?: () => void }> = ({ qa, onClick }) => {
  return (
    <Card onClick={onClick} className="cursor-pointer">
      <h3 className="text-lg font-semibold mb-2">{qa.question}</h3>
      <p className="text-sm text-gray-700 mb-2 line-clamp-1">{qa.answer}</p>
      <div className="text-xs text-gray-500">いいね: {qa.likeCount}</div>
    </Card>
  );
};

export default QACard;
