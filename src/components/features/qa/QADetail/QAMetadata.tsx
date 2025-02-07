'use client'

import React from 'react';
import { QAStatusBadge } from '../../../common/qa/QAStatusBadge';
import { QAPriorityTag } from '../../../common/qa/QAPriorityTag';
import type { QA } from '../../../../types/models';

interface QAMetadataProps {
  qa: QA;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
}

export const QAMetadata: React.FC<QAMetadataProps> = ({
  qa,
  onStatusChange,
  onPriorityChange
}) => {
  const totalAttachments = qa.responses.reduce(
    (count, response) => count + (response.attachments?.length || 0),
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Q{qa._id.slice(-4)}</h2>
          <div className="text-sm text-gray-500">
            <div>作成: {new Date(qa.created_at).toLocaleString()}</div>
            <div>更新: {new Date(qa.updated_at).toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={qa.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="p-2 border border-gray-200 rounded-md text-sm"
          >
            <option value="new">新規</option>
            <option value="in_progress">対応中</option>
            <option value="resolved">解決済み</option>
            <option value="closed">完了</option>
          </select>

          <select
            value={qa.priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="p-2 border border-gray-200 rounded-md text-sm"
          >
            <option value="high">優先度: 高</option>
            <option value="medium">優先度: 中</option>
            <option value="low">優先度: 低</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <QAStatusBadge status={qa.status} />
        <QAPriorityTag priority={qa.priority} />
        <span className="text-sm text-gray-500">
          回答数: {qa.responses.length}
        </span>
        {totalAttachments > 0 && (
          <span className="text-sm text-gray-500">
            添付ファイル: {totalAttachments}件
          </span>
        )}
      </div>
    </div>
  );
};
