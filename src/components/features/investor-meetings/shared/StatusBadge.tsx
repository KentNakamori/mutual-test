import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_STYLES = {
  scheduled: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: '予定済み',
  },
  in_progress: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: '進行中',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: '完了',
  },
  cancelled: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: 'キャンセル',
  },
} as const;

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const style = STATUS_STYLES[status as keyof typeof STATUS_STYLES] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${style.bg} ${style.text} ${className || ''}`}
    >
      {style.label}
    </span>
  );
};

export default StatusBadge;
