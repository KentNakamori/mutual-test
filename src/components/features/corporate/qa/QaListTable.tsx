// src/components/features/investor/qa/QaListTable.tsx
import React from 'react';
import Table from '@/components/ui/Table';
import { QA } from '@/types';

export interface QaListTableProps {
  qaItems: QA[];
  onEdit: (qaId: string) => void;
  onDelete: (qaId: string) => void;
}

const QaListTable: React.FC<QaListTableProps> = ({ qaItems, onEdit, onDelete }) => {
  const columns = [
    { key: 'question', label: '質問', sortable: true },
    { key: 'answer', label: '回答', sortable: false },
    { key: 'likeCount', label: 'いいね', sortable: true },
    { key: 'actions', label: '操作', sortable: false },
  ];

  // 各行のデータを組み立て
  const data = qaItems.map(qa => ({
    question: qa.question,
    answer:
      qa.answer.length > 50 ? qa.answer.slice(0, 50) + '...' : qa.answer,
    likeCount: qa.likeCount,
    actions: (
      <div className="flex space-x-2">
        <button onClick={() => onEdit(qa.qaId)} className="text-blue-600 hover:underline">
          編集
        </button>
        <button onClick={() => onDelete(qa.qaId)} className="text-red-600 hover:underline">
          削除
        </button>
      </div>
    ),
  }));

  return (
    <div className="overflow-x-auto">
      <Table columns={columns} data={data} />
    </div>
  );
};

export default QaListTable;
