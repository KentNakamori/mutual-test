import React from 'react';
import { MoreHorizontal, RefreshCw } from 'lucide-react';

interface BaseWidgetProps {
  title: string;
  children: React.ReactNode;
  onRefresh?: () => void;
  className?: string;
  isLoading?: boolean;
}

const BaseWidget: React.FC<BaseWidgetProps> = ({
  title,
  children,
  onRefresh,
  className = '',
  isLoading = false
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className={`p-1 hover:bg-gray-100 rounded-full transition-colors
                ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={16} />
            </button>
          )}
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3 mt-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ) : children}
      </div>
    </div>
  );
};

export default BaseWidget;