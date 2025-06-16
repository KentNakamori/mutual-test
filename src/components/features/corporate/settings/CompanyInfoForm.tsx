// src/components/features/corporate/settings/CompanyInfoForm.tsx
import React, { useState } from 'react';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { LogoUploadModal } from '../../../ui/LogoUploadModal';
import { CompanyInfo, CompanyInfoFormProps } from '../../../../types';
import { updateCorporateCompanySettingsWithLogo } from '../../../../lib/api';
import { INDUSTRY_OPTIONS } from '@/types/industry';

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ initialData, onSaveSuccess }) => {
  const [formData, setFormData] = useState<CompanyInfo>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // ロゴ関連の状態
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // 型安全に各フィールドの更新を行うため、キーは keyof CompanyInfo にします。
  const handleChange = (field: keyof CompanyInfo, value: string) => {
    // 従業員数は number 型なので、数値変換が必要です
    if (field === 'employeeCount') {
      setFormData({ ...formData, [field]: Number(value) });
    } else {
      setFormData({ ...formData, [field]: value });
    }
    // エラーや成功メッセージをクリア
    setErrorMsg('');
    setSuccessMessage(null);
  };

  // ロゴファイル選択処理
  const handleLogoFileSelect = (file: File) => {
    setLogoFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMessage(null);
    
    try {
      // FormDataを作成してロゴファイルも含める
      const updateFormData = new FormData();
      
      // 企業情報の各フィールドを追加（バックエンドが期待するフィールド名にマッピング）
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // フィールド名のマッピング
          let backendFieldName = key;
          if (key === 'tel') {
            backendFieldName = 'phone'; // フロントエンドのtelをバックエンドのphoneにマッピング
          } else if (key === 'email') {
            backendFieldName = 'contactEmail'; // フロントエンドのemailをバックエンドのcontactEmailにマッピング
          }
          
          updateFormData.append(backendFieldName, String(value));
        }
      });
      
      // ロゴファイルがある場合は追加
      if (logoFile) {
        updateFormData.append('logo', logoFile);
      }

      // API経由で企業情報更新（PUT /corporate/settings/company）
      const data = await updateCorporateCompanySettingsWithLogo(updateFormData);
      setSuccessMessage('企業情報が正常に更新されました');
      
      // ロゴ関連の状態をリセット
      setLogoFile(null);
      setLogoPreview('');
      
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
      
      {/* 成功メッセージ */}
      {successMessage && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">企業名</label>
            <Input 
              value={formData.companyName || ''} 
              onChange={(value: string) => handleChange('companyName', value)} 
              placeholder="企業名を入力" 
              disabled={true} // 企業名は変更不可に設定
            />
            <p className="text-xs text-gray-500 mt-1">企業名は変更できません</p>
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
            <label className="block text-sm font-medium mb-1">問い合わせ用メールアドレス</label>
            <Input 
              value={formData.email || ''} 
              onChange={(value: string) => handleChange('email', value)} 
              placeholder="問い合わせ用メールアドレスを入力" 
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
            <label className="block text-sm font-medium mb-1">証券コード</label>
            <Input 
              value={formData.securitiesCode || ''} 
              onChange={(value: string) => handleChange('securitiesCode', value)} 
              placeholder="証券コードを入力" 
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
            <label className="block text-sm font-medium mb-1">市場区分</label>
            <select
              value={formData.marketSegment || ''}
              onChange={(e) => handleChange('marketSegment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">市場区分を選択してください</option>
              <option value="東証プライム">東証プライム</option>
              <option value="東証スタンダード">東証スタンダード</option>
              <option value="東証グロース">東証グロース</option>
              <option value="未上場">未上場</option>
            </select>
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
              placeholder="資本金を入力（例：1億円）" 
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
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">事業内容</label>
          <Input 
            value={formData.businessDescription || ''} 
            onChange={(value: string) => handleChange('businessDescription', value)} 
            placeholder="事業内容を入力" 
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              事業内容は30文字程度での入力を推奨します
            </p>
            <p className={`text-xs ${
              (formData.businessDescription || '').length > 30 
                ? 'text-orange-500' 
                : 'text-gray-500'
            }`}>
              {formData.businessDescription?.length || 0}文字
            </p>
          </div>
        </div>

        {/* ロゴセクション */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ロゴ
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {logoPreview ? (
                <div className="w-24 h-16 flex items-center justify-center bg-gray-50 rounded border overflow-hidden">
                  <img 
                    src={logoPreview} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : initialData.logoUrl ? (
                <div className="w-24 h-16 flex items-center justify-center bg-gray-50 rounded border overflow-hidden">
                  <img 
                    src={initialData.logoUrl} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Logo</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <button
                type="button"
                onClick={() => setShowLogoModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                ロゴを変更
              </button>
              <p className="text-sm text-gray-500 mt-1">
                5MB以下の画像ファイル（PNG, JPEG, JPG, GIF, SVG, WEBP）
              </p>
              {logoFile && (
                <p className="text-sm text-green-600 mt-1">
                  選択済み: {logoFile.name}
                </p>
              )}
            </div>
          </div>
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

      {/* ロゴ選択モーダル */}
      <LogoUploadModal
        isOpen={showLogoModal}
        onClose={() => setShowLogoModal(false)}
        onFileSelect={handleLogoFileSelect}
      />
    </div>
  );
};

export default CompanyInfoForm;
