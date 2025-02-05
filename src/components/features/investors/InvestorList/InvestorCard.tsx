import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Investor } from '@/types/models';

interface InvestorCardProps {
  investor: Investor;
  onSelect: (id: string) => void;
}

export const InvestorCard: React.FC<InvestorCardProps> = ({
  investor,
  onSelect,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'アクティブ';
      case 'inactive':
        return '非アクティブ';
      case 'pending':
        return '保留中';
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          {/* ヘッダー部分 */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold leading-relaxed">
                {investor.basicInfo.name}
              </h3>
              <p className="text-sm text-gray-500">{investor.basicInfo.company}</p>
            </div>
            <span 
              className={`px-3 py-1 text-sm rounded-full ${getStatusColor(investor.status)}`}
            >
              {getStatusText(investor.status)}
            </span>
          </div>

          {/* 基本情報 */}
          <div className="flex-1 space-y-4">
            <div className="text-sm text-gray-600">
              <p>{investor.basicInfo.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">総ユーザー数</p>
                <p className="text-sm font-medium">
                  {investor.totalUsers.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">文書数</p>
                <p className="text-sm font-medium">
                  {investor.documents.length}件
                </p>
              </div>
            </div>
          </div>

          {/* アクション部分 */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <a
                href={`/investors/${investor._id}`}
                className="flex-1 px-4 py-2 text-sm text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                詳細を見る
              </a>
              <button
                onClick={() => onSelect(investor._id)}
                className="px-4 py-2 text-sm text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                選択
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorCard;
