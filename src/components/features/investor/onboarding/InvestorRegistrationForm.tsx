"use client";

import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { InvestorRegistrationData } from '@/types';

const InvestorRegistrationForm: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  
  const [formData, setFormData] = useState<InvestorRegistrationData>({
    display_name: '',
    email: user?.email || '',
    investor_type: '個人投資家',
    asset_scale: '500万円未満',
    bio: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const investorTypeOptions = [
    { value: '機関投資家', label: '機関投資家' },
    { value: '個人投資家', label: '個人投資家' },
    { value: 'セルサイドアナリスト', label: 'セルサイドアナリスト' },
    { value: 'その他', label: 'その他' },
  ];

  const assetScaleOptions = [
    { value: '500万円未満', label: '500万円未満' },
    { value: '500万円～1000万円', label: '500万円～1000万円' },
    { value: '1000万円～5000万円', label: '1000万円～5000万円' },
    { value: '5000万円～1億円', label: '5000万円～1億円' },
    { value: '1億円以上', label: '1億円以上' },
    { value: '非開示', label: '非開示' },
  ];

  const validateForm = (data: InvestorRegistrationData) => {
    const newErrors: Record<string, string> = {};
    
    // 必須項目チェック
    if (!data.investor_type) {
      newErrors.investor_type = '投資家種別を選択してください';
    }
    
    // メールアドレス形式チェック
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    // 文字数制限
    if (data.display_name && data.display_name.length > 50) {
      newErrors.display_name = '表示名は50文字以内で入力してください';
    }
    
    if (data.bio && data.bio.length > 500) {
      newErrors.bio = '自己紹介は500文字以内で入力してください';
    }
    
    return newErrors;
  };

  const handleInputChange = (field: keyof InvestorRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/investor/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ユーザー登録に失敗しました');
      }
      
      // 登録成功 - メインページにリダイレクト
      router.push('/investor/companies');
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'ユーザー登録に失敗しました'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 表示名 - 一旦非表示 */}
      {/* <div>
        <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
          表示名（任意）
        </label>
        <input
          type="text"
          id="display_name"
          value={formData.display_name}
          onChange={(e) => handleInputChange('display_name', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="表示名を入力してください"
        />
        {errors.display_name && (
          <p className="mt-1 text-sm text-red-600">{errors.display_name}</p>
        )}
      </div> */}

      {/* メールアドレス */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="メールアドレスを入力してください"
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* 投資家種別 */}
      <div>
        <label htmlFor="investor_type" className="block text-sm font-medium text-gray-700">
          投資家種別 <span className="text-red-500">*</span>
        </label>
        <select
          id="investor_type"
          value={formData.investor_type}
          onChange={(e) => handleInputChange('investor_type', e.target.value as any)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {investorTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.investor_type && (
          <p className="mt-1 text-sm text-red-600">{errors.investor_type}</p>
        )}
      </div>

      {/* 資産運用規模 */}
      <div>
        <label htmlFor="asset_scale" className="block text-sm font-medium text-gray-700">
          資産運用規模 <span className="text-red-500">*</span>
        </label>
        <select
          id="asset_scale"
          value={formData.asset_scale || ''}
          onChange={(e) => handleInputChange('asset_scale', e.target.value as any)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {assetScaleOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.asset_scale && (
          <p className="mt-1 text-sm text-red-600">{errors.asset_scale}</p>
        )}
      </div>

      {/* 自己紹介 - 一旦非表示 */}
      {/* <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          自己紹介（任意）
        </label>
        <textarea
          id="bio"
          rows={4}
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="自己紹介を入力してください（500文字以内）"
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.bio?.length || 0}/500文字
        </p>
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
        )}
      </div> */}

      {/* エラーメッセージ */}
      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      {/* 送信ボタン */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '登録中...' : '登録する'}
        </button>
      </div>
    </form>
  );
};

export default InvestorRegistrationForm; 