// src/components/features/corporate/qa/QaTableRow.tsx
import React from 'react';
import { QA } from '@/types';
import Button from '@/components/ui/Button';

export interface QaTableRowProps {
  qaItem: QA;
  onEdit: (qaId: string) => void;
  onDelete: (qaId: string) => void;
}

const QaTableRow: React.FC<QaTableRowProps> = ({ qaItem, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-100">
      <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">{qaItem.question}</td>
      <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">
        {qaItem.answer.length > 50 ? qaItem.answer.slice(0, 50) + '...' : qaItem.answer}
      </td>
      <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">{qaItem.likeCount}</td>
      <td className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">
        <div className="flex space-x-2">
          <Button label="編集" onClick={() => onEdit(qaItem.qaId)} variant="outline" />
          <Button label="削除" onClick={() => onDelete(qaItem.qaId)} variant="destructive" />
        </div>
      </td>
    </tr>
  );
};

export default QaTableRow;
