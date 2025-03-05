// src/components/features/corporate/irchat/DraftItem.tsx
import React from 'react';

interface Draft {
  draftId: string;
  title: string;
  createdAt: string;
}

interface DraftItemProps {
  draft: Draft;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * DraftItem コンポーネント
 * 1件のドラフト情報を表示し、選択中の場合はスタイルで強調します。
 */
const DraftItem: React.FC<DraftItemProps> = ({ draft, isSelected, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-gray-200 font-semibold' : ''}`}
    >
      <div>{draft.title}</div>
      <div className="text-xs text-gray-500">{new Date(draft.createdAt).toLocaleString()}</div>
    </li>
  );
};

export default DraftItem;
