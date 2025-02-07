'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { Investor } from '@/types/models';

interface InvestorContactProps {
  investor: Investor;
  editable: boolean;
  onUpdate: (data: Partial<Investor>) => void;
}

interface ContactSettings {
  email: boolean;
  phone: boolean;
  slack: boolean;
}

export const InvestorContact: React.FC<InvestorContactProps> = ({
  investor,
  editable,
  onUpdate,
}) => {
  const [contactData, setContactData] = useState({
    email: investor.basicInfo.email,
    phone: investor.basicInfo.phone || '',
    address: investor.basicInfo.address || '',
  });

  const [notificationSettings, setNotificationSettings] = useState<ContactSettings>({
    email: true,
    phone: false,
    slack: false,
  });

  const handleContactChange = (field: string, value: string) => {
    setContactData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationToggle = (channel: keyof ContactSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const handleSubmit = () => {
    onUpdate({
      basicInfo: {
        ...investor.basicInfo,
        ...contactData,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold leading-relaxed">連絡先情報</h2>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* 連絡先情報フォーム */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              {editable ? (
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="text-base">{contactData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電話番号
              </label>
              {editable ? (
                <input
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="text-base">{contactData.phone || '-'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                住所
              </label>
              {editable ? (
                <textarea
                  value={contactData.address}
                  onChange={(e) => handleContactChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              ) : (
                <p className="text-base">{contactData.address || '-'}</p>
              )}
            </div>
          </div>

          {/* 通知設定 */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold mb-4">通知設定</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">メール通知</p>
                  <p className="text-sm text-gray-500">更新情報をメールで受け取る</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('email')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    notificationSettings.email ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      notificationSettings.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS通知</p>
                  <p className="text-sm text-gray-500">重要な更新をSMSで受け取る</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('phone')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    notificationSettings.phone ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      notificationSettings.phone ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Slack通知</p>
                  <p className="text-sm text-gray-500">Slackでリアルタイム通知を受け取る</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('slack')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    notificationSettings.slack ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      notificationSettings.slack ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 保存ボタン */}
          {editable && (
            <div className="flex justify-end pt-6">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                設定を保存
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorContact;