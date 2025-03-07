import React from 'react';
import { QAItem } from './QATabView';
import QACard from './QACard';

interface QAListProps {
  items: QAItem[];
  onSelectQA: (qa: QAItem) => void;
}

/**
 * QAList コンポーネント
 * QAの各項目を QACard としてグリッド表示します。
 */
const QAList: React.FC<QAListProps> = ({ items, onSelectQA }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((qa) => (
        <QACard key={qa.id} qa={qa} onClick={() => onSelectQA(qa)} />
      ))}
    </div>
  );
};

export default QAList;
