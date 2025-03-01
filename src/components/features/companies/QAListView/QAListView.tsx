// src/components/features/companies/QAListView/QAListView.tsx
"use client";

import React, { useState, useEffect } from "react";
import QAList from "./QAList";
import QADetailModal from "./QADetailModal";
import { useQAList } from "@/hooks/useQA";
import { QA } from "@/types/domain/qa";

/**
 * QAListView Props
 */
type QAListViewProps = {
  companyId: string;
};

const mockQAData: QA[] = [
  {
    id: "mock-qa-1",
    question: "サンプルQAの質問文（モック）",
    answer: "サンプルQAの回答文（モック）",
    companyId: "mock-company-1",
    likeCount: 3,
    bookmarkCount: 1,
    isPublic: true,
    createdAt: "",
    updatedAt: "",
  },
];

const QAListView: React.FC<QAListViewProps> = ({ companyId }) => {
  const [keyword, setKeyword] = useState("");
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);

  const { data, error, isLoading } = useQAList({ companyId, keyword });

  // モック用のローカルQA state
  const [qaItems, setQaItems] = useState<QA[]>([]);

  // API呼び出し結果 or エラーが発生した場合の処理
  useEffect(() => {
    if (isLoading) return;
    if (error) {
      console.error("QA fetch error:", error);
      // モックデータを使う
      setQaItems(mockQAData);
    } else if (data) {
      // 正常時: APIの結果をセット
      setQaItems(data.data);
    }
  }, [isLoading, error, data]);

  const handleSearch = () => {
    // keywordの更新後、React Queryが再取得してくれる (useQAListに渡しているので)
  };

  const handleSelectQA = (qaId: string) => {
    const found = qaItems.find((qa) => qa.id === qaId);
    if (found) {
      setSelectedQA(found);
    }
  };

  const handleCloseModal = () => {
    setSelectedQA(null);
  };

  return (
    <div>
      <div className="mb-4 flex space-x-2">
        <input
          className="border border-gray-300 rounded p-2 text-sm flex-1"
          placeholder="キーワードで絞り込み"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          検索
        </button>
      </div>

      {/* QA一覧 */}
      <QAList
        qas={qaItems}
        isLoading={isLoading}
        onSelectQA={handleSelectQA}
      />

      {/* QA詳細モーダル */}
      <QADetailModal
        isOpen={!!selectedQA}
        qa={selectedQA || undefined}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default QAListView;
