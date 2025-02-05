'use client';

import React, { useState, useEffect } from 'react';
import { InvestorList } from '@/components/features/investors/InvestorList';
import { InvestorFilter } from '@/components/features/investors/InvestorFilter';
import { InvestorSearch } from '@/components/features/investors/InvestorSearch';
import type { Investor } from '@/types/models';
import type { FilterParams, PaginationParams } from '@/types/api';
import { API_ENDPOINTS } from '@/types/utils';

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [filters, setFilters] = useState<FilterParams>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestors();
  }, [filters, pagination]);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      const response = await fetch(`${API_ENDPOINTS.INVESTORS}?${queryParams}`);
      if (!response.ok) throw new Error('投資家データの取得に失敗しました');

      const data = await response.json();
      setInvestors(data.data);
      setTotalPages(Math.ceil(data.meta.total / pagination.limit));
    } catch (error) {
      console.error('Error fetching investors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // フィルター変更時はページを1に戻す
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSearch = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold leading-relaxed mb-8">投資家データベース</h1>

      <div className="space-y-6">
        {/* 検索・フィルターセクション */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <InvestorFilter
              currentFilters={filters}
              presets={[]} // プリセットは後で実装
              onFilterChange={handleFilterChange}
              onPresetSave={() => {}} // プリセット保存は後で実装
            />
          </div>
          <div className="lg:col-span-2">
            <InvestorSearch onSearch={handleSearch} />
            
            {/* 投資家一覧 */}
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full" />
              </div>
            ) : (
              <InvestorList
                investors={investors}
                filters={filters}
                pagination={{
                  page: pagination.page,
                  totalPages
                }}
                onFilterChange={handleFilterChange}
                onPageChange={handlePageChange}
                onSortChange={() => {}} // ソート機能は後で実装
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}