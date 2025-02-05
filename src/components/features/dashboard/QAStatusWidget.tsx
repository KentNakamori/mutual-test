import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import BaseWidget from './BaseWidget';
import type { QADTO } from '../../../types/dto';

interface QAStatus {
  total: number;
  pending: number;
  urgent: number;
}

const QAStatusWidget: React.FC = () => {
  const [status, setStatus] = useState<QAStatus>({
    total: 0,
    pending: 0,
    urgent: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchQAStatus = async () => {
    setIsLoading(true);
    try {
      const responses = await Promise.all([
        fetch('/api/v1/qa?status=pending'),
        fetch('/api/v1/qa?priority=high')
      ]);
      
      const [pendingData, urgentData] = await Promise.all(
        responses.map(r => r.json())
      );

      setStatus({
        total: pendingData.meta.total + urgentData.meta.total,
        pending: pendingData.meta.total,
        urgent: urgentData.meta.total
      });
    } catch (error) {
      console.error('Failed to fetch QA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQAStatus();
  }, []);

  return (
    <BaseWidget
      title="Q&A状況"
      onRefresh={fetchQAStatus}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-orange-600" />
              <span className="text-sm font-medium text-orange-600">
                未対応
              </span>
            </div>
            <p className="text-2xl font-semibold text-orange-700">
              {status.pending}
              <span className="text-sm font-normal text-orange-600 ml-1">
                件
              </span>
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-600">
                緊急
              </span>
            </div>
            <p className="text-2xl font-semibold text-red-700">
              {status.urgent}
              <span className="text-sm font-normal text-red-600 ml-1">
                件
              </span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">対応進捗</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(((status.total - status.pending) / status.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${Math.round(
                  ((status.total - status.pending) / status.total) * 100
                )}%`
              }}
            />
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};

export default QAStatusWidget;