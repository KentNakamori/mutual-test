import React from 'react';
import { StatusBadge } from '../shared/StatusBadge';
import type { Meeting } from '@/types/models';
import { formatDate } from '@/utils/date';

interface MeetingInfoProps {
  meeting: Meeting;
  onStatusChange: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'scheduled', label: '予定済み' },
  { value: 'in_progress', label: '進行中' },
  { value: 'completed', label: '完了' },
  { value: 'cancelled', label: 'キャンセル' },
];

export const MeetingInfo: React.FC<MeetingInfoProps> = ({
  meeting,
  onStatusChange,
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold leading-relaxed">
            {meeting.investor.basicInfo.name}との面談
          </h2>
          <p className="text-base text-gray-500">
            {formatDate(meeting.date)}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <StatusBadge status={meeting.status} />
          <select
            value={meeting.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-relaxed">
            投資家情報
          </h3>
          <dl className="space-y-1">
            <dt className="text-sm text-gray-500">会社名</dt>
            <dd className="text-base">{meeting.investor.basicInfo.company}</dd>
            <dt className="text-sm text-gray-500">役職</dt>
            <dd className="text-base">{meeting.investor.basicInfo.position}</dd>
            <dt className="text-sm text-gray-500">メール</dt>
            <dd className="text-base">{meeting.investor.basicInfo.email}</dd>
          </dl>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-relaxed">
            関連情報
          </h3>
          <dl className="space-y-1">
            <dt className="text-sm text-gray-500">関連Q&A</dt>
            <dd className="text-base">{meeting.qas.length}件</dd>
            <dt className="text-sm text-gray-500">投資スタイル</dt>
            <dd className="text-base">{meeting.investor.preferences.investmentStyle}</dd>
            <dt className="text-sm text-gray-500">重点領域</dt>
            <dd className="text-base">{meeting.investor.preferences.focusAreas.join(', ')}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MeetingInfo;
