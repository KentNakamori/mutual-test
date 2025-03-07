// src/components/features/corporate/CompanyInfoForm.tsx
import React, { useState } from 'react';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { CompanyInfo } from '../../../../types';
import { updateCorporateCompanySettings } from '../../../../libs/api';
import { useAuth } from '../../../../hooks/useAuth';

export interface CompanyInfoFormProps {
  initialData: CompanyInfo;
  onSaveSuccess: () => void;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ initialData, onSaveSuccess }) => {
  const [formData, setFormData] = useState<CompanyInfo>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { token } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
