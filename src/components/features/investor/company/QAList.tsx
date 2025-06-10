//src\components\features\investor\company\QAList.tsx

import React from 'react';
import QACard from '../../../ui/QACard';
import { QaListProps, QA } from '../../../../types';



/**
 * QAList コンポーネント
 * Q&A項目のリストを表示します。
 */
const QAList: React.FC<QaListProps> = ({ 
  items, 
  onSelectQA 
}) => {
  // propsのバリデーション
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Q&Aデータがありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((qa: QA) => (
        <QACard 
          key={qa.qaId} 
          mode="preview"
          role="investor"
          qa={qa} 
          onSelect={() => onSelectQA && onSelectQA(qa)} 
        />
      ))}
    </div>
  );
};

export default QAList;
