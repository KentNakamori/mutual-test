import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { StatusBadge } from '../shared/StatusBadge';
import type { Meeting } from '@/types/models';
import { formatDate } from '@/utils/date';

interface MeetingCardProps {
  meeting: Meeting;
  className?: string;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, className }) => {
  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold leading-relaxed">
            {meeting.investor.basicInfo.name}
          </h3>
          <StatusBadge status={meeting.status} />
        </div>
        <p className="text-sm text-gray-500">
          {formatDate(meeting.date)}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-base text-gray-600 line-clamp-3">
          {meeting.notes}
        </div>
        
        {meeting.qas.length > 0 && (
          <div className="text-sm text-gray-500">
            関連Q&A: {meeting.qas.length}件
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end pt-4 border-t border-gray-100">
        <button 
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
          onClick={() => window.location.href = `/investor-meetings/${meeting.id}`}
        >
          詳細を見る
        </button>
      </CardFooter>
    </Card>
  );
};

export default MeetingCard;