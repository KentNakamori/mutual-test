"use client";

import React, { useState } from "react";
// import { useQAList } from "@/hooks/useQA"; // 例
// import QADetailModal from "./QADetailModal"; // 後述
// import QAList from "./QAList"; // 後述

interface QAListViewProps {
  companyId: string;
}

export default function QAListView({ companyId }: QAListViewProps) {
  // 検索キーワードやソートなどのローカルステート
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  // useQAListでデータ取得（コメントアウト例）
  // const { data, isLoading, error } = useQAList({
  //   companyId,
  //   keyword,
  //   page,
  //   limit: 10,
  // });

  // QA詳細モーダル関連
  const [selectedQAId, setSelectedQAId] = useState<string | null>(null);

  const handleSelectQA = (qaId: string) => {
    setSelectedQAId(qaId);
  };

  return (
    <div>
      {/* 検索/フィルタUI (省略可) */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1"
          placeholder="質問を検索..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          onClick={() => setPage(1)}
          className="bg-black text-white px-4 py-1 rounded"
        >
          検索
        </button>
      </div>

      {/* QA一覧の表示 */}
      <div className="border border-gray-200 rounded p-4">
        {/* isLoading, error を見ながら切り替え */}
        <p className="text-sm text-gray-600">（デモ: QA一覧未実装）</p>
        {/* <QAList items={data?.data || []} onSelectQA={handleSelectQA} /> */}
      </div>

      {/* ページネーション */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Next
        </button>
      </div>

      {/* QA詳細モーダル */}
      {/* {selectedQAId && (
        <QADetailModal
          isOpen={true}
          qaId={selectedQAId}
          onClose={() => setSelectedQAId(null)}
        />
      )} */}
    </div>
  );
}
