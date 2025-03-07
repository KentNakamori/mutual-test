// src/components/features/mypage/AccountDeleteForm.tsx
import React, { useState } from 'react';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import Checkbox from '../../../ui/Checkbox';

export interface AccountDeleteFormProps {
  onDeleteAccount: (password: string) => Promise<void>;
}

const AccountDeleteForm: React.FC<AccountDeleteFormProps> = ({ onDeleteAccount }) => {
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('退会する前に同意してください。');
      return;
    }
    if (!password) {
      alert('パスワードを入力してください。');
      return;
    }
    setIsDeleting(true);
    try {
      await onDeleteAccount(password);
      alert('アカウントが削除されました。');
      // 必要に応じてリダイレクト処理など
    } catch (error) {
      alert('アカウント削除に失敗しました。');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleDelete} className="space-y-4">
      <div className="bg-red-50 p-4 rounded">
        <p className="text-red-600">注意: 退会するとアカウント情報および関連データは完全に削除され、元に戻せません。</p>
      </div>
      <div>
        <label className="block mb-1">パスワードの再入力</label>
        <Input 
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="パスワード"
        />
      </div>
      <div>
        <Checkbox 
          checked={agreed}
          onChange={setAgreed}
          label="上記の注意事項に同意します"
        />
      </div>
      <div>
        <Button 
          type="submit"
          label={isDeleting ? "処理中..." : "退会する"}
          variant="destructive"
          disabled={isDeleting}
        />
      </div>
    </form>
  );
};

export default AccountDeleteForm;
