// src/components/features/qa/Pagination.tsx
import React from 'react';
import Button from '@/components/ui/Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onChangePage }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      <Button
        label="前へ"
        onClick={() => onChangePage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        variant="outline"
      />
      <span className="text-sm">
        {currentPage} / {totalPages}
      </span>
      <Button
        label="次へ"
        onClick={() => onChangePage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        variant="outline"
      />
    </div>
  );
};

export default Pagination;
