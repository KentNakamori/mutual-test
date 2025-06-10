// src/components/features/corporate/qa/QaListCards.tsx
import React, { useState, useCallback } from "react";
import QACard from "@/components/ui/QACard";
import { QaListCardsWithFilterProps } from "@/types";
import StatusFilter from "./StatusFilter";

const QaListCards: React.FC<QaListCardsWithFilterProps> = ({ 
  qaItems,
  onSelect, 
  onEdit, 
  onDelete, 
  filters = {},
  onFilterChange
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'DRAFT' | 'PENDING' | 'PUBLISHED' | 'all'>(
    filters?.reviewStatus ?? 'all'
  );

  // 初期ページをfiltersから取得
  const [currentPage, setCurrentPage] = useState<number>(filters?.page || 1);

  const handleSelect = useCallback((qaId: string) => {
    onSelect(qaId);
  }, [onSelect]);

  const handleEdit = useCallback((qaId: string) => {
    onEdit(qaId);
  }, [onEdit]);

  const handleDelete = useCallback((qaId: string) => {
    onDelete(qaId);
  }, [onDelete]);

  const handleStatusChange = useCallback((status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'all') => {
    setSelectedStatus(status);
    // ステータス変更を親コンポーネントに通知
    onFilterChange?.({ 
      ...filters, 
      reviewStatus: status === 'all' ? undefined : status,
      page: 1 // ステータス変更時は1ページ目に戻る
    });
  }, [filters, onFilterChange]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    onFilterChange?.({ ...filters, page });
  }, [filters, onFilterChange]);

  return (
    <div className="space-y-4">
      <StatusFilter selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />
      
      {qaItems.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">該当するQAがありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {qaItems.map((qa) => (
            <QACard
              key={qa.qaId}
              qa={qa}
              mode="preview"
              role="corporate"
              onSelect={() => handleSelect(qa.qaId)}
              onEdit={() => handleEdit(qa.qaId)}
              onDelete={() => handleDelete(qa.qaId)}
            />
          ))}
        </div>
      )}
      
      {qaItems.length > 0 && filters.totalPages && filters.totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            前へ
          </button>
          <span className="text-gray-600">
            {currentPage} / {filters.totalPages || Math.ceil((filters.totalCount || 0) / (filters.limit || 10))}
          </span>
          <button
            disabled={currentPage >= (filters.totalPages || Math.ceil((filters.totalCount || 0) / (filters.limit || 10)))}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
};

export default QaListCards;
