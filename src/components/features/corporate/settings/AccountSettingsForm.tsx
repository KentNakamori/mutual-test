// src/components/features/corporate/settings/AccountSettingsForm.tsx
import React, { useState, ChangeEvent } from 'react';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { updateCorporateAccountSettings } from '../../../../lib/api';
import { useUser } from "@auth0/nextjs-auth0";

const AccountSettingsForm: React.FC = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { user, isLoading: isUserLoading } = useUser();

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!user) {
      setErrorMsg('認証が必要です');
      return;
    }

    if (newPass !== confirmNewPass) {
      setErrorMsg('新しいパスワードが一致しません');
      return;
    }

    setIsSaving(true);
    try {
      // API経由でアカウント設定更新（PUT /corporate/settings/account）
      // プロキシがJWTを自動的に付与するため、トークンの受け渡しは不要
      await updateCorporateAccountSettings({
        currentPassword: currentPass,
        newPassword: newPass,
        newEmail,
      });
      setSuccessMsg('アカウント設定が更新されました');
      // 入力欄をクリア
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
      setNewEmail('');
    } catch (error: any) {
      setErrorMsg(error.message || '更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  // 入力値の変更ハンドラ
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: ChangeEvent<HTMLInputElement>) => setter(e.target.value);

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">アカウント設定</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">現在のパスワード</label>
          <Input 
            type="password" 
            value={currentPass} 
            onChange={handleInputChange(setCurrentPass)} 
            placeholder="現在のパスワード" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">新しいパスワード</label>
          <Input 
            type="password" 
            value={newPass} 
            onChange={handleInputChange(setNewPass)} 
            placeholder="新しいパスワード" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">新しいパスワード（確認）</label>
          <Input 
            type="password" 
            value={confirmNewPass} 
            onChange={handleInputChange(setConfirmNewPass)} 
            placeholder="再入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">新しいメールアドレス</label>
          <Input 
            type="email" 
            value={newEmail} 
            onChange={handleInputChange(setNewEmail)} 
            placeholder="新しいメールアドレス" 
          />
        </div>
        {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
        {successMsg && <div className="text-green-600 text-sm">{successMsg}</div>}
        <Button 
          label={isSaving ? '更新中…' : '変更を保存'} 
          onClick={handleSubmit} 
          disabled={isSaving || isUserLoading} 
          variant="primary" 
        />
      </div>
    </div>
  );
};

export default AccountSettingsForm;
