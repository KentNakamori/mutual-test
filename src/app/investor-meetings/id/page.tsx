// src/app/investor-meetings/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/common/layout/PageHeader';
import { MeetingDetail } from '@/components/features/investor-meetings/MeetingDetail/MeetingDetail';
import { MeetingForm } from '@/components/features/investor-meetings/MeetingForm/MeetingForm';
import type { Meeting } from '@/types/models';

interface Props {
  params: {
    id: string;
  };
}

export default function MeetingDetailPage({ params }: Props) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMeeting();
  }, [params.id]);

  const fetchMeeting = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/meetings/${params.id}`);
      if (!response.ok) throw new Error('Meeting not found');
      const data = await response.json();
      setMeeting(data.data);
    } catch (error) {
      console.error('Failed to fetch meeting:', error);
      router.push('/investor-meetings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (meetingData: Partial<Meeting>) => {
    try {
      const response = await fetch(`/api/v1/meetings/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) throw new Error('Failed to update meeting');

      setIsEditing(false);
      fetchMeeting();
    } catch (error) {
      console.error('Failed to update meeting:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/v1/meetings/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete meeting');

      router.push('/investor-meetings');
    } catch (error) {
      console.error('Failed to delete meeting:', error);
    }
  };

  if (isLoading || !meeting) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`${meeting.investor.basicInfo.name}との面談`}
        description={new Date(meeting.date).toLocaleDateString('ja-JP')}
      />

      {isEditing ? (
        <div className="bg-white rounded-lg p-6">
          <MeetingForm
            initialData={meeting}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <MeetingDetail
          meeting={meeting}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}