// src/components/features/corporate/login/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/libs/api';
import { LoginRequest, LoginResponse } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

/**
 * LoginForm
 * メールアドレス／パスワード入力欄とログインボタンを提供します。
 * API認証に失敗しても、エラー表示はせずにそのままダッシュボードへ遷移します。
 */
const LoginForm: React.FC = () => {
  const router = useRouter();
  const { loginSuccess } = useAuth();
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
      const requestData: LoginRequest = { email, password };
      const response: LoginResponse = await login(requestData);
      // 認証成功時、useAuth で認証情報を更新
      loginSuccess(response.accessToken, response.role as 'investor' | 'corporate', response.userId);
    } catch (error: any) {
      console.warn('API認証失敗:', error);
      // API認証が失敗しても、特に何もしない
    }
    setIsLoading(false);
    // 認証の成功・失敗に関わらずダッシュボードへ遷移
    router.push('/corporate/dashboard');
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
          type="submit"  // ← ここで submit タイプを明示
          label={isLoading ? 'ログイン中...' : 'ログイン'}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default LoginForm;
