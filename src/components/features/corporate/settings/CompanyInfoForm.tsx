// src/components/features/corporate/settings/CompanyInfoForm.tsx
import React, { useState } from 'react';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { CompanyInfo, CompanyInfoFormProps } from '../../../../types';
import { updateCorporateCompanySettings } from '../../../../lib/api';
import { useAuth } from '../../../../hooks/useAuth';

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ initialData, onSaveSuccess }) => {
  const [formData, setFormData] = useState<CompanyInfo>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { token } = useAuth();

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
      await updateCorporateCompanySettings(token as string, formData);
      // 更新成功後、親コンポーネントへ再取得を依頼
      onSaveSuccess();
    } catch (error: any) {
      setErrorMsg(error.message || '更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">企業情報の更新</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">企業名</label>
          <Input 
            value={formData.companyName || ''} 
            onChange={(val) => handleChange('companyName', val)} 
            placeholder="企業名を入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">所在地</label>
          <Input 
            value={formData.address || ''} 
            onChange={(val) => handleChange('address', val)} 
            placeholder="所在地を入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">メールアドレス</label>
          <Input 
            value={formData.email || ''} 
            onChange={(val) => handleChange('email', val)} 
            placeholder="担当メールアドレスを入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">電話番号</label>
          <Input 
            value={formData.tel || ''} 
            onChange={(val) => handleChange('tel', val)} 
            placeholder="電話番号を入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">企業証券コード</label>
          <Input 
            value={formData.securitiesCode || ''} 
            onChange={(val) => handleChange('securitiesCode', val)} 
            placeholder="企業証券コードを入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">設立年月日</label>
          <Input 
            value={formData.establishedDate || ''} 
            onChange={(val) => handleChange('establishedDate', val)} 
            placeholder="YYYY-MM-DD の形式で入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">代表者名</label>
          <Input 
            value={formData.ceo || ''} 
            onChange={(val) => handleChange('ceo', val)} 
            placeholder="代表者名を入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">事業内容</label>
          <Input 
            value={formData.businessDescription || ''} 
            onChange={(val) => handleChange('businessDescription', val)} 
            placeholder="事業内容を入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">資本金</label>
          <Input 
            value={formData.capital || ''} 
            onChange={(val) => handleChange('capital', val)} 
            placeholder="資本金を入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">従業員数</label>
          <Input 
            value={formData.employeeCount ? formData.employeeCount.toString() : ''} 
            onChange={(val) => handleChange('employeeCount', val)} 
            placeholder="従業員数を入力" 
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">WebサイトURL</label>
          <Input 
            value={formData.websiteUrl || ''} 
            onChange={(val) => handleChange('websiteUrl', val)} 
            placeholder="WebサイトURLを入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">問い合わせ用メールアドレス</label>
          <Input 
            value={formData.contactEmail || ''} 
            onChange={(val) => handleChange('contactEmail', val)} 
            placeholder="問い合わせ用メールアドレスを入力" 
          />
        </div>
        {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
        <Button 
          label={isSaving ? '保存中…' : '保存'} 
          onClick={handleSubmit} 
          disabled={isSaving} 
          variant="primary" 
        />
      </div>
    </div>
  );
};

export default CompanyInfoForm;
