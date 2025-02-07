'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QAList } from '@/components/features/qa/QAList/QAList';
import { QASearch } from '@/components/features/qa/QASearch/QASearch';
import type { QA } from '@/types/models';
import type { FilterParams, SortParams, PaginationParams } from '@/types/api';

export default function QAPage() {
  const router = useRouter();
  const [data, setData] = useState<QA[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterParams>({});
  const [sort, setSort] = useState<SortParams>({
    field: 'updated_at',
    direction: 'desc'
  });
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10
  });

  useEffect(() => {
    const fetchQAs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/v1/qa');
        const json = await response.json();
        setData(json.data);
        setTotalCount(json.meta.total);
      } catch (error) {
        console.error('Failed to fetch QAs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQAs();
  }, [filters, sort, pagination]);

  const handleQASelect = (id: string) => {
    router.push(`/qa/${id}`);
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/v1/qa/search?query=${encodeURIComponent(query)}`);
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">QAデータベース</h1>
          <QASearch
            onSearch={handleSearch}
            onSelect={(qa) => handleQASelect(qa._id)}
          />
        </div>

        <QAList
          data={data}
          totalCount={totalCount}
          filters={filters}
          sort={sort}
          pagination={pagination}
          onFilterChange={setFilters}
          onSortChange={setSort}
          onPageChange={setPagination}
          onQASelect={handleQASelect}
        />
      </div>
    </div>
  );
}