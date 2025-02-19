/**
 * @file components/ui/Pagination.tsx
 * @description 検索結果やリスト表示でページを分割する際に利用するページネーションコンポーネント
 */

import React from "react";
import Button from "./Button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  siblingsCount?: number;
  variant?: "compact" | "detailed";
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  siblingsCount = 1,
  variant = "compact",
}) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };
  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  const renderPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - siblingsCount);
    const end = Math.min(totalPages, currentPage + siblingsCount);
    for (let p = start; p <= end; p++) {
      pages.push(
        <Button
          key={p}
          label={`${p}`}
          variant={p === currentPage ? "default" : "ghost"}
          onClick={() => onPageChange(p)}
        />
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        label="前へ"
        disabled={currentPage <= 1}
        onClick={handlePrev}
      />

      {variant === "compact" ? (
        <span className="px-2">{currentPage} / {totalPages}</span>
      ) : (
        <div className="flex space-x-1">{renderPageNumbers()}</div>
      )}

      <Button
        variant="outline"
        label="次へ"
        disabled={currentPage >= totalPages}
        onClick={handleNext}
      />
    </div>
  );
};

export default Pagination;
