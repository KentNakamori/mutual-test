// src/components/features/corporate/LogoutButton.tsx
import React from 'react';
import Button from '../../../ui/Button';
import { useAuth } from '../../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm('本当にログアウトしますか？')) {
      logout();
      // ログアウト後、ログイン画面へリダイレクト
      router.push('/corporate/login');
    }
  };

  return (
    <div className="flex justify-center">
      <Button label="ログアウト" onClick={handleLogout} variant="destructive" />
    </div>
  );
};

export default LogoutButton;
