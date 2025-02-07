'use client'

import React from 'react';
import { Clock } from 'lucide-react';
import { QAStatusBadge } from '../../../common/qa/QAStatusBadge';
import { QAPriorityTag } from '../../../common/qa/QAPriorityTag';
import type { QA } from '../../../../types/models';

interface QAListItemProps {
  qa: QA;
  onClick: (id: string) => void;
}

export const QAListItem: React.FC<QAListItemProps> = ({ qa, onClick }) => {
  const hasAttachments = qa.attachments && qa.attachments.length > 0;
  const responseCount = qa.responses.length;

  return (
    <div
      onClick={() => onClick(qa._id)}
      className="group p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-200"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <h3 className="text-base font-medium text-gray-900 group-hover:text-black">
              Q{qa._id.slice(-4)}
            </h3>
            <span className="text-sm text-gray-500">
              {responseCount > 0 ? `${responseCount}件の回答` : '未回答'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>
              {new Date(qa.updated_at ?? qa.created_at).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <QAStatusBadge status={qa.status} />
          <QAPriorityTag priority={qa.priority} />
        </div>
      </div>
      
      <div className="text-sm text-gray-700 line-clamp-2 mb-2">
        {qa.responses[0]?.content ?? '質問内容がここに表示されます'}
      </div>
      
      {hasAttachments && (
        <div className="text-xs text-gray-500">
          添付ファイル: {qa.attachments.length}件
        </div>
      )}
    </div>
  );
};
