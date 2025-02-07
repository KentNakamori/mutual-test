// src/app/investor-meetings/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/layout/PageHeader';
import { MeetingList } from '@/components/features/investor-meetings/MeetingList/MeetingList';
import { MeetingForm } from '@/components/features/investor-meetings/MeetingForm/MeetingForm';
import type { Meeting } from '@/types/models';

export default function InvestorMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({
    field: 'date',
    order: 'desc' as const,
  });

  useEffect(() => {
    fetchMeetings();
  }, [pagination.page, filters, sort]);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
        sort_by: sort.field,
        sort_order: sort.order,
      });

      const response = await fetch(`/api/v1/meetings?${params}`);
      const data = await response.json();
      
      setMeetings(data.data);
      setPagination(prev => ({
        ...prev,
        total: data.meta.total,
      }));
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMeeting = async (meetingData: Partial<Meeting>) => {
    try {
      const response = await fetch('/api/v1/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) throw new Error('Failed to create meeting');
      
      setIsFormOpen(false);
      fetchMeetings();
    } catch (error) {
      console.error('Failed to create meeting:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="投資家面談一覧"
        description="投資家との面談履歴と予定を管理します"
        actions={
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 text-sm text-white bg-black hover:bg-gray-900 transition-colors duration-200 rounded"
          >
            新規面談
          </button>
        }
      />

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <MeetingForm
              onSubmit={handleCreateMeeting}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      <MeetingList
        meetings={meetings}
        pagination={pagination}
        filters={filters}
        sort={sort}
        onFilterChange={setFilters}
        onSortChange={setSort}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />
    </div>
  );
}