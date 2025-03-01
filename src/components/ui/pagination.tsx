/**
 * Paginationコンポーネント
 * - リストや検索結果をページ分割し、現在のページや前後ページを切り替えるUI
 * - shadcnには標準のPaginationが無いので、カスタム実装例
 */

import React from "react";
import { cn } from "@/libs/utils";

export type PaginationProps = {
  /** 現在のページ (1-based) */
  currentPage: number;
  /** 総ページ数 */
  totalPages: number;
  /** ページが変更されたときのハンドラ */
  onPageChange: (newPage: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // シンプルに先頭と末尾+現在ページ前後のみ表示する例
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    // 例: 分割して一部のみ...省略する場合の実装を省略し、全て表示
    pages.push(i);
  }

  return (
    <div className="flex items-center space-x-2 mt-4 justify-center">
      {/* Prev */}
      <button
        onClick={handlePrev}
        disabled={currentPage <= 1}
        className={cn(
          "px-3 py-1 border rounded text-sm",
          currentPage <= 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
        )}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={cn(
            "px-3 py-1 border rounded text-sm hover:bg-gray-100",
            page === currentPage
              ? "bg-black text-white border-black"
              : "text-gray-700"
          )}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className={cn(
          "px-3 py-1 border rounded text-sm",
          currentPage >= totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"
        )}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
