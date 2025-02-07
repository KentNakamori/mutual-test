'use client'

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import BaseWidget from './BaseWidget';
import type { MeetingDTO } from '../../../types/dto';

const AppointmentWidget: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodaysMeetings = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/v1/meetings?date=${today}`);
      const data = await response.json();
      setMeetings(data.data.slice(0, 3)); // 最新3件のみ表示
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysMeetings();
  }, []);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <BaseWidget
      title="本日の面談予定"
      onRefresh={fetchTodaysMeetings}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="mt-1">
                <Clock size={16} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {meeting.investor_name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTime(meeting.date)}
                </p>
                {meeting.notes && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {meeting.notes}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full
                    ${
                      meeting.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-700'
                        : meeting.status === 'in_progress'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {meeting.status === 'scheduled'
                    ? '予定'
                    : meeting.status === 'in_progress'
                    ? '進行中'
                    : '完了'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">本日の予定はありません</p>
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

export default AppointmentWidget;