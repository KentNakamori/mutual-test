import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { ObjectId, Meeting, QA } from '@/types/models';

interface InvestorHistoryProps {
  meetings: ObjectId[];
  qas: ObjectId[];
}

interface HistoryItem {
  id: string;
  type: 'meeting' | 'qa';
  date: Date;
  title: string;
  status: string;
  notes?: string;
}

export const InvestorHistory: React.FC<InvestorHistoryProps> = ({
  meetings,
  qas,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'meetings' | 'qas'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 履歴アイテムの状態に応じた色を返す
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold leading-relaxed">活動履歴</h2>
          
          <div className="flex items-center gap-4">
            {/* タブ切り替え */}
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                className={`px-4 py-2 text-sm transition-colors duration-200 ${
                  activeTab === 'all'
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('all')}
              >
                すべて
              </button>
              <button
                className={`px-4 py-2 text-sm border-l border-gray-300 transition-colors duration-200 ${
                  activeTab === 'meetings'
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('meetings')}
              >
                面談
              </button>
              <button
                className={`px-4 py-2 text-sm border-l border-gray-300 transition-colors duration-200 ${
                  activeTab === 'qas'
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('qas')}
              >
                Q&A
              </button>
            </div>

            {/* ソート切り替え */}
            <select
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <option value="desc">新しい順</option>
              <option value="asc">古い順</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* タイムライン表示 */}
          <div className="relative">
            {/* 縦線 */}
            <div className="absolute top-0 left-8 h-full w-px bg-gray-200" />

            {/* 履歴アイテム */}
            <div className="space-y-6">
              {meetings.map((meeting) => (
                <div key={String(meeting)} className="relative flex gap-4">
                  {/* アイコン */}
                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-full z-10">
                    <span className="text-xl">👥</span>
                  </div>

                  {/* コンテンツ */}
                  <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-base font-medium">面談記録</h4>
                      <span className={`px-2 py-1 text-sm rounded-full ${
                        getStatusColor('completed')
                      }`}>
                        完了
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      ここに面談の詳細が入ります
                    </p>
                    <time className="text-sm text-gray-500">
                      2024/02/05 14:30
                    </time>
                  </div>
                </div>
              ))}

              {qas.map((qa) => (
                <div key={String(qa)} className="relative flex gap-4">
                  {/* アイコン */}
                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-full z-10">
                    <span className="text-xl">❓</span>
                  </div>

                  {/* コンテンツ */}
                  <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-base font-medium">Q&A</h4>
                      <span className={`px-2 py-1 text-sm rounded-full ${
                        getStatusColor('resolved')
                      }`}>
                        解決済み
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      ここにQ&Aの内容が入ります
                    </p>
                    <time className="text-sm text-gray-500">
                      2024/02/05 15:45
                    </time>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* データが空の場合 */}
          {meetings.length === 0 && qas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              活動履歴がありません
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorHistory;
