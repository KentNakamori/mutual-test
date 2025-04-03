// src/components/features/corporate/qa/QaListCards.tsx
import React, { useState } from "react";
import QACard, { QAData } from "@/components/ui/QACard";
import { QA, QaListCardsProps} from "@/types";



const itemsPerPage = 10;

const QaListCards: React.FC<QaListCardsProps> = ({ qaItems, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(qaItems.length / itemsPerPage);

  // 現在のページのアイテムを抽出
  const currentItems = qaItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // モックデータのQA型（QA）から、共通QAカード用の型（QAData）に変換する関数例
  const convertToQAData = (qa: QA): QAData => {
    return {
      id: qa.qaId,
      title: qa.question, // QAにタイトルがない場合は、質問文をタイトルとして利用
      question: qa.question,
      answer: qa.answer,
      createdAt: qa.createdAt,
      views: qa.views || 0, // もし views がない場合は0を設定
      likeCount: qa.likeCount,
      tags: qa.tags || [],         // 必要に応じて（mockでは空配列）
      genreTags: qa.genreTags || [] // 必要に応じて（mockでは空配列）
    };
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {currentItems.map((qa) => (
          <QACard
            key={qa.qaId}
            mode="preview"
            role="corporate"  // QA管理ページは企業向けの管理画面と仮定
            qa={convertToQAData(qa)}
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
