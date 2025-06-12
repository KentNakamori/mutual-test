// src/components/features/corporate/settings/CompanyInfoForm.tsx
import React, { useState } from 'react';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { CompanyInfo, CompanyInfoFormProps } from '../../../../types';
import { updateCorporateCompanySettings } from '../../../../lib/api';
import { INDUSTRY_OPTIONS } from '@/types/industry';

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ initialData, onSaveSuccess }) => {
  const [formData, setFormData] = useState<CompanyInfo>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 型安全に各フィールドの更新を行うため、キーは keyof CompanyInfo にします。
  const handleChange = (field: keyof CompanyInfo, value: string) => {
    // 従業員数は number 型なので、数値変換が必要です
    if (field === 'employeeCount') {
      setFormData({ ...formData, [field]: Number(value) });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setErrorMsg('');
    try {
      // API経由で企業情報更新（PUT /corporate/settings/company）
      await updateCorporateCompanySettings(formData);
      // 更新成功後、親コンポーネントへ再取得を依頼
      onSaveSuccess();
    } catch (error: any) {
      setErrorMsg(error.message || '更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">企業情報の更新</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">企業名</label>
            <Input 
              value={formData.companyName || ''} 
              onChange={(value: string) => handleChange('companyName', value)} 
              placeholder="企業名を入力" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">業界</label>
            <select
              value={formData.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">業界を選択してください</option>
              {INDUSTRY_OPTIONS.map(option => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">所在地</label>
            <Input 
              value={formData.address || ''} 
              onChange={(value: string) => handleChange('address', value)} 
              placeholder="所在地を入力" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">メールアドレス</label>
            <Input 
              value={formData.email || ''} 
              onChange={(value: string) => handleChange('email', value)} 
              placeholder="担当メールアドレスを入力" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">電話番号</label>
            <Input 
              value={formData.tel || ''} 
              onChange={(value: string) => handleChange('tel', value)} 
              placeholder="電話番号を入力" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">企業証券コード</label>
            <Input 
              value={formData.securitiesCode || ''} 
              onChange={(value: string) => handleChange('securitiesCode', value)} 
              placeholder="企業証券コードを入力" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">設立年月日</label>
            <Input 
              value={formData.establishedDate || ''} 
              onChange={(value: string) => handleChange('establishedDate', value)} 
              placeholder="YYYY-MM-DD の形式で入力" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">代表者名</label>
            <Input 
              value={formData.ceo || ''} 
              onChange={(value: string) => handleChange('ceo', value)} 
              placeholder="代表者名を入力" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">資本金</label>
            <Input 
              value={formData.capital || ''} 
              onChange={(value: string) => handleChange('capital', value)} 
              placeholder="資本金を入力" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">従業員数</label>
            <Input 
              value={formData.employeeCount ? formData.employeeCount.toString() : ''} 
              onChange={(value: string) => handleChange('employeeCount', value)} 
              placeholder="従業員数を入力" 
              type="number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">WebサイトURL</label>
            <Input 
              value={formData.websiteUrl || ''} 
              onChange={(value: string) => handleChange('websiteUrl', value)} 
              placeholder="WebサイトURLを入力" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">問い合わせ用メールアドレス</label>
            <Input 
              value={formData.contactEmail || ''} 
              onChange={(value: string) => handleChange('contactEmail', value)} 
              placeholder="問い合わせ用メールアドレスを入力" 
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">事業内容</label>
          <Input 
            value={formData.businessDescription || ''} 
            onChange={(value: string) => handleChange('businessDescription', value)} 
            placeholder="事業内容を入力" 
          />
        </div>

        {errorMsg && <div className="text-red-600 text-sm mt-4">{errorMsg}</div>}
        <div className="mt-6">
          <Button 
            label={isSaving ? '保存中…' : '保存'} 
            onClick={handleSubmit} 
            disabled={isSaving} 
            variant="primary" 
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoForm;
