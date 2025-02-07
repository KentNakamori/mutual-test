import React from 'react';

type QAStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

interface QAStatusBadgeProps {
  status: QAStatus;
}

export const QAStatusBadge: React.FC<QAStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    new: {
      label: '新規',
      className: 'bg-blue-100 text-blue-800'
    },
    in_progress: {
      label: '対応中',
      className: 'bg-yellow-100 text-yellow-800'
    },
    resolved: {
      label: '解決済み',
      className: 'bg-green-100 text-green-800'
    },
    closed: {
      label: '完了',
      className: 'bg-gray-100 text-gray-800'
    }
  };

  const { label, className } = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};
