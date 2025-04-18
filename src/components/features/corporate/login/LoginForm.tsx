// src/components/features/corporate/login/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/**
 * LoginForm
 * メールアドレス／パスワード入力欄とログインボタンを提供します。
 */
const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 簡易バリデーション
    if (!email || !password) {
      setErrorMessage('メールアドレスとパスワードを入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      // NextAuthを使用したログイン処理
      const result = await signIn('credentials', {
        email,
        password,
        userType: 'corporate',
        redirect: false,
      });

      if (result?.error) {
        // ログインエラーの場合
        throw new Error(result.error);
      }

      if (result?.ok) {
        // ログイン成功の場合はダッシュボードへ遷移
        router.push('/corporate/dashboard');
      }
    } catch (error: any) {
      console.error('ログインエラー:', error);
      setErrorMessage('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div role="alert" className="text-error text-sm">
          {errorMessage}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          メールアドレス
        </label>
        <Input
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          type="email"
          errorState={!email && !!errorMessage}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          パスワード
        </label>
        <Input
          value={password}
          onChange={setPassword}
          placeholder="パスワード"
          type="password"
          errorState={!password && !!errorMessage}
        />
      </div>
      <div>
        <Button
          type="submit"
          label={isLoading ? 'ログイン中...' : 'ログイン'}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default LoginForm;
