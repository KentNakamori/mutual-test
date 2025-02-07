import React from 'react';

type QAPriority = 'high' | 'medium' | 'low';

interface QAPriorityTagProps {
  priority: QAPriority;
}

export const QAPriorityTag: React.FC<QAPriorityTagProps> = ({ priority }) => {
  const priorityConfig = {
    high: {
      label: '高',
      className: 'bg-red-100 text-red-800'
    },
    medium: {
      label: '中',
      className: 'bg-yellow-100 text-yellow-800'
    },
    low: {
      label: '低',
      className: 'bg-green-100 text-green-800'
    }
  };

  const { label, className } = priorityConfig[priority];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};
