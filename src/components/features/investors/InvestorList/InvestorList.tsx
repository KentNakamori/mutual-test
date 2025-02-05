import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Investor } from '@/types/models';
import type { FilterParams } from '@/types/api';

interface InvestorListProps {
  investors: Investor[];
  filters: FilterParams;
  pagination: {
    page: number;
    totalPages: number;
  };
  onFilterChange: (filters: FilterParams) => void;
  onPageChange: (page: number) => void;
  onSortChange: (sort: { field: string; order: 'asc' | 'desc' }) => void;
}

export const InvestorList: React.FC<InvestorListProps> = ({
  investors,
  filters,
  pagination,
  onFilterChange,
  onPageChange,
  onSortChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* 一覧表示のヘッダー */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          全{pagination.totalPages}ページ中 {pagination.page}ページ目
        </div>
        <div className="flex items-center gap-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => onSortChange({ field: 'name', order: e.target.value as 'asc' | 'desc' })}
          >
            <option value="asc">名前 (昇順)</option>
            <option value="desc">名前 (降順)</option>
          </select>
        </div>
      </div>

      {/* 投資家カードのグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {investors.map((investor) => (
          <Card key={investor._id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{investor.basicInfo.name}</h3>
                    <p className="text-sm text-gray-500">{investor.basicInfo.company}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(investor.status)}`}>
                    {investor.status}
                  </span>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">{investor.basicInfo.email}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-gray-500">総ユーザー数:</span>
                      <span className="ml-2 font-medium">
                        {investor.totalUsers.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {investor.documents.length > 0 && (
                    <div className="text-sm text-gray-500">
                      添付文書: {investor.documents.length}件
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <a
                    href={`/investors/${investor._id}`}
                    className="block w-full px-4 py-2 text-center text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    詳細を見る
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ページネーション */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            前へ
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                    pagination.page === pageNum
                      ? 'bg-black text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorList;