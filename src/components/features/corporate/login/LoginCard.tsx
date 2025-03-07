//src\components\features\corporate\login\LoginCard.tsx

import React from 'react';
import Card from '@/components/ui/Card';
import LoginForm from './LoginForm';
import PasswordResetLink from './PasswordResetLink';

/**
 * LoginCard
 * ログインフォームとパスワードリセットリンクを内包するカードUI。
 */
const LoginCard: React.FC = () => {
  return (
    <Card className="w-full max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">企業ログイン</h1>
      <LoginForm />
      <PasswordResetLink href="/corporate/password-reset" />
    </Card>
  );
};

export default LoginCard;
