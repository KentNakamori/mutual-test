'use client'

import React from 'react';
import { MeetingInfo } from './MeetingInfo';
import { MeetingNotes } from './MeetingNotes';
import { MeetingActions } from './MeetingActions';
import type { Meeting } from '@/types/models';

interface MeetingDetailProps {
  meeting: Meeting;
  onEdit: () => void;
  onDelete: () => void;
}

export const MeetingDetail: React.FC<MeetingDetailProps> = ({
  meeting,
  onEdit,
  onDelete,
}) => {
  const handleEdit = () => {
    onEdit();
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/v1/meetings/${meeting.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      if (!response.ok) throw new Error('Status update failed');
    } catch (error) {
      console.error('Failed to update meeting status:', error);
    }
  };

  const handleNotesUpdate = async (newNotes: string) => {
    try {
      const response = await fetch(`/api/v1/meetings/${meeting.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: newNotes,
        }),
      });
      if (!response.ok) throw new Error('Notes update failed');
    } catch (error) {
      console.error('Failed to update meeting notes:', error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="divide-y divide-gray-200">
        <MeetingInfo
          meeting={meeting}
          onStatusChange={handleStatusChange}
        />

        <MeetingNotes
          notes={meeting.notes}
          onNotesUpdate={handleNotesUpdate}
        />

        <MeetingActions
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default MeetingDetail;
