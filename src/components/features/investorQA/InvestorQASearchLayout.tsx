"use client";

import React, { useState } from "react";
import QASearchForm from "./QASearchForm";
import QAResultList from "./QAResultList";
import QADetailModal from "./QADetailModal";

interface Props {
  keyword: string;
  selectedCompany: string;
  sort: string;
  page: number;
  data: {
    qaId: string;
    question: string;
    answerSnippet: string;
    companyName: string;
    likeCount: number;
    bookmarkCount: number;
  }[];
  totalCount: number;
  isLoading: boolean;
  errorMessage?: string;
  onSearch: (conditions: {
    keyword?: string;
    company?: string;
    sort?: string;
  }) => void;
  onPageChange: (newPage: number) => void;
}

export default function InvestorQASearchLayout({
  keyword,
  selectedCompany,
  sort,
  page,
  data,
  totalCount,
  isLoading,
  errorMessage,
  onSearch,
  onPageChange,
}: Props) {
  // モーダル制御
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQA, setSelectedQA] = useState<string | null>(null);

  const handleSelectQA = (qaId: string) => {
    setSelectedQA(qaId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedQA(null);
  };

  // ページネーション計算
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* 検索フォーム */}
      <QASearchForm
        keyword={keyword}
        selectedCompany={selectedCompany}
        onSearch={onSearch}
        onChangeKeyword={() => {}} // 不要なら空実装でも可
        onChangeCompany={() => {}} // 同上
      />

      {/* エラー表示/ローディング */}
      {errorMessage && <div className="text-error mb-2">{errorMessage}</div>}
      {isLoading && <div>Loading QAs...</div>}

      {/* QAリスト */}
      {!isLoading && !errorMessage && (
        <QAResultList items={data} onSelectQA={handleSelectQA} />
      )}

      {/* ページネーション */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={page <= 1}
          >
            Prev
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* QA詳細モーダル */}
      <QADetailModal
        isOpen={modalOpen}
        qaId={selectedQA || undefined}
        onClose={handleCloseModal}
      />
    </div>
  );
}
