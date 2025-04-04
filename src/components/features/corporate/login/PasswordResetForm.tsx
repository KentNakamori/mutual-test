// src/components/features/corporate/login/PasswordResetForm.tsx
"use client";

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

const PasswordResetForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }
    setIsResetting(true);

    // 模擬的なAPI呼び出し
    setTimeout(() => {
      // 成功時、ログインページへリダイレクト（例としてクエリパラメータでメッセージを付加）
      router.push('/corporate/login?reset=success');
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">新しいパスワードを設定</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">新パスワード</label>
          <Input
            value={newPassword}
            onChange={setNewPassword}
            placeholder="新しいパスワードを入力"
            type="password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">新パスワード（確認）</label>
          <Input
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="再度パスワードを入力"
            type="password"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button label={isResetting ? '再設定中…' : 'パスワード再設定'} type="submit" disabled={isResetting} />
      </form>
    </div>
  );
};

export default PasswordResetForm;
