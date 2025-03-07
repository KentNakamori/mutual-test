// src/components/features/investor/LoginForm.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { investorLogin } from '@/libs/api';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/**
 * LoginForm コンポーネント
 * - メールアドレスとパスワードの入力、ログインAPI 呼び出し、エラー表示を担当します。
 * - 認証成功時は useAuth の loginSuccess を呼び出し、ダッシュボードへ遷移します。
 */
const LoginForm: React.FC = () => {
  const router = useRouter();
  const { loginSuccess } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 基本の入力バリデーション
    if (!email || !password) {
      setErrorMessage('メールアドレスとパスワードを入力してください。');
      return;
    }

    setIsSubmitting(true);
    try {
      // 投資家向けログインAPI呼び出し
      const response = await investorLogin({ email, password });
      // APIレスポンスから取得したアクセストークン・ユーザーIDをAuth Contextへ反映
      loginSuccess(response.accessToken, 'investor', response.userId);
      router.push('/investor/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || 'ログインに失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 mb-4">
      <h2 className="text-2xl font-semibold mb-4">ログイン</h2>
      {errorMessage && (
        <div role="alert" className="mb-4 text-red-600">
          {errorMessage}
        </div>
      )}
      <div className="mb-4">
        <label className="block mb-1 font-medium">メールアドレス</label>
        <Input
          value={email}
          onChange={setEmail}
          placeholder="example@mail.com"
          type="email"
          errorState={!!errorMessage}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">パスワード</label>
        <Input
          value={password}
          onChange={setPassword}
          placeholder="パスワード"
          type="password"
          errorState={!!errorMessage}
        />
      </div>
      <Button
        label={isSubmitting ? "ログイン中..." : "ログイン"}
        type="submit"  // submit ボタンとして指定
        disabled={isSubmitting}
        variant="primary"
      />
    </form>
  );
};

export default LoginForm;
