'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { Investor } from '@/types/models';

interface InvestorProfileProps {
  investor: Investor;
  editable: boolean;
  onUpdate: (data: Partial<Investor>) => void;
}

export const InvestorProfile: React.FC<InvestorProfileProps> = ({
  investor,
  editable,
  onUpdate,
}) => {
  const [editData, setEditData] = useState({
    basicInfo: { ...investor.basicInfo },
    preferences: { ...investor.preferences },
  });

  const handleInputChange = (
    field: string,
    subField: string,
    value: string
  ) => {
    setEditData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value,
      },
    }));
  };

  const handleSubmit = () => {
    onUpdate(editData);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold leading-relaxed">基本情報</h2>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* 基本情報セクション */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                名前
              </label>
              {editable ? (
                <input
                  type="text"
                  value={editData.basicInfo.name}
                  onChange={(e) => handleInputChange('basicInfo', 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="text-base">{investor.basicInfo.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                会社名
              </label>
              {editable ? (
                <input
                  type="text"
                  value={editData.basicInfo.company}
                  onChange={(e) => handleInputChange('basicInfo', 'company', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="text-base">{investor.basicInfo.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              {editable ? (
                <input
                  type="email"
                  value={editData.basicInfo.email}
                  onChange={(e) => handleInputChange('basicInfo', 'email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="text-base">{investor.basicInfo.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ステータス
              </label>
              {editable ? (
                <select
                  value={investor.status}
                  onChange={(e) => onUpdate({ status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="active">アクティブ</option>
                  <option value="inactive">非アクティブ</option>
                  <option value="pending">保留中</option>
                </select>
              ) : (
                <p className="text-base">{investor.status}</p>
              )}
            </div>
          </div>

          {/* 選好情報セクション */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-4">投資選好</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(investor.preferences).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key}
                  </label>
                  {editable ? (
                    <input
                      type="text"
                      value={editData.preferences[key]}
                      onChange={(e) => handleInputChange('preferences', key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  ) : (
                    <p className="text-base">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 保存ボタン */}
          {editable && (
            <div className="flex justify-end pt-6">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                変更を保存
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorProfile;
