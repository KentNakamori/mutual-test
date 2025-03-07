// src/components/features/corporate/AccountSettingsForm.tsx
import React, { useState } from 'react';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { updateCorporateAccountSettings } from '../../../../libs/api';
import { useAuth } from '../../../../hooks/useAuth';

const AccountSettingsForm: React.FC = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { token } = useAuth();

  const handleSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (newPass !== confirmNewPass) {
      setErrorMsg('新しいパスワードが一致しません');
      return;
    }
    setIsSaving(true);
    try {
      // API経由でアカウント設定更新（PUT /corporate/settings/account）
      await updateCorporateAccountSettings(token as string, {
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

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">アカウント設定</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">現在のパスワード</label>
          <Input 
            type="password" 
            value={currentPass} 
            onChange={setCurrentPass} 
            placeholder="現在のパスワード" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">新しいパスワード</label>
          <Input 
            type="password" 
            value={newPass} 
            onChange={setNewPass} 
            placeholder="新しいパスワード" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">新しいパスワード（確認）</label>
          <Input 
            type="password" 
            value={confirmNewPass} 
            onChange={setConfirmNewPass} 
            placeholder="再入力" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">新しいメールアドレス</label>
          <Input 
            type="email" 
            value={newEmail} 
            onChange={setNewEmail} 
            placeholder="新しいメールアドレス" 
          />
        </div>
        {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
        {successMsg && <div className="text-green-600 text-sm">{successMsg}</div>}
        <Button 
          label={isSaving ? '更新中…' : '変更を保存'} 
          onClick={handleSubmit} 
          disabled={isSaving} 
          variant="primary" 
        />
      </div>
    </div>
  );
};

export default AccountSettingsForm;
