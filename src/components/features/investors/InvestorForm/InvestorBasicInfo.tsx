'use client'

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { InvestorBasicInfo } from '@/types/models';

interface InvestorBasicInfoFormProps {
  data: InvestorBasicInfo;
  errors: Record<string, string>;
  onChange: (data: Partial<InvestorBasicInfo>) => void;
  onBlur?: (field: string) => void;
}

export const InvestorBasicInfoForm: React.FC<InvestorBasicInfoFormProps> = ({
  data,
  errors,
  onChange,
  onBlur,
}) => {
  const handleChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold leading-relaxed">基本情報</h2>
        <p className="text-sm text-gray-500">投資家の基本的な情報を入力してください</p>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              名前 <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => onBlur?.('name')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="山田 太郎"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* 会社名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              会社名 <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={data.company}
              onChange={(e) => handleChange('company', e.target.value)}
              onBlur={() => onBlur?.('company')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200 ${
                errors.company ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="株式会社サンプル"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company}</p>
            )}
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => onBlur?.('email')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="yamada@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* 電話番号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              電話番号
            </label>
            <input
              type="tel"
              value={data.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => onBlur?.('phone')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200 ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="03-1234-5678"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* 住所 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              住所
            </label>
            <textarea
              value={data.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => onBlur?.('address')}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-200 ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="東京都千代田区..."
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* 備考 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              備考
            </label>
            <textarea
              value={data.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="その他の追加情報があれば入力してください"
            />
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <span className="text-red-600">*</span> は必須項目です
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestorBasicInfoForm;
