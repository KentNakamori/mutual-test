// src/components/features/corporate/irchat/DraftList.tsx
import React from 'react';
import DraftItem from './DraftItem';
import { Draft, DraftListProps } from "@/types"; 


/**
 * DraftList コンポーネント
 * ドラフト一覧を表示し、選択時に onSelectDraft を呼び出します。
 */
const DraftList: React.FC<DraftListProps> = ({ drafts, selectedDraftId, onSelectDraft }) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-semibold mb-4">ドラフト一覧</h2>
      <ul className="space-y-2">
        {drafts.map((draft) => (
          <DraftItem
            key={draft.draftId}
            draft={draft}
            isSelected={draft.draftId === selectedDraftId}
            onClick={() => onSelectDraft(draft.draftId)}
          />
        ))}
      </ul>
    </div>
  );
};

export default DraftList;
