// src/components/features/investor/GuestLoginButton.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { investorGuest } from '@/libs/api';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';

/**
 * GuestLoginButton コンポーネント
 * - ゲストログイン用のボタン。押下時にゲスト用APIを呼び出し、認証状態を更新した上でトップページへ遷移します。
 */
const GuestLoginButton: React.FC = () => {
  const router = useRouter();
  const { guestLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      // ゲストログインAPI呼び出し。パラメータが不要な場合は空オブジェクトを渡す。
      const response = await investorGuest({});
      guestLogin(response.userId);
      router.push('/investor/dashboard');
    } catch (err: any) {
      setError(err.message || 'ゲストログインに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      {error && <div role="alert" className="mb-2 text-red-600">{error}</div>}
      <Button
        label={isLoading ? "ゲストログイン中..." : "ゲストとしてログイン"}
        onClick={handleGuestLogin}
        disabled={isLoading}
        variant="outline"
      />
    </div>
  );
};

export default GuestLoginButton;
