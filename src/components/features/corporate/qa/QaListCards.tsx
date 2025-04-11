// src/components/features/corporate/qa/QaListCards.tsx
import React, { useState } from "react";
import QACard from "@/components/ui/QACard";
import { QA, QaListCardsProps } from "@/types";

const itemsPerPage = 10;

const QaListCards: React.FC<QaListCardsProps> = ({ qaItems, onSelect, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(qaItems.length / itemsPerPage);

  // 現在のページのアイテムを抽出
  const currentItems = qaItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* カードを一列で表示 */}
      <div className="grid grid-cols-1 gap-4">
        {currentItems.map((qa) => (
          <QACard
            key={qa.qaId}
            mode="preview"
            role="corporate"
            qa={qa}
            onSelect={() => onSelect(qa.qaId)}
            onEdit={() => onEdit(qa.qaId)}
            onDelete={() => onDelete(qa.qaId)}
          />
        ))}
      </div>
      {/* ページネーション */}
      <div className="mt-4 flex justify-center items-center space-x-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QaListCards;
