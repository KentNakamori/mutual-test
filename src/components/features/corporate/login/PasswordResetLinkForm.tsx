// src/components/features/corporate/login/PasswordResetLinkForm.tsx
"use client";

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

const PasswordResetLinkForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');
    setMessage('');

    // 模擬的なAPI呼び出し
    setTimeout(() => {
      // 例として test@example.com のみ成功とする
      if (email === 'test@example.com') {
        setMessage('パスワード再設定リンクを送信しました。メールをご確認ください。');
      } else {
        setError('登録されていないメールアドレスです。');
      }
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">パスワード再設定リンク送信</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">メールアドレス</label>
          <Input
            value={email}
            onChange={setEmail}
            placeholder="メールアドレスを入力"
            type="email"
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        <Button label={isSending ? '送信中…' : '再設定リンク送信'} type="submit" disabled={isSending} />
      </form>
    </div>
  );
};

export default PasswordResetLinkForm;
