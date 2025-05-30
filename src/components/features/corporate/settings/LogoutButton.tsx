// src/components/features/corporate/settings/LogoutButton.tsx
'use client';
import React, { useState } from 'react';
import Button from '../../../ui/Button';
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from 'next/navigation';
import Dialog from '../../../ui/Dialog';

const LogoutButton: React.FC = () => {
  const { user, isLoading } = useUser();
  const token = user?.sub ?? null; 
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => router.push('/auth/logout');

  return (
    <div className="flex justify-center">
      <Button label="ログアウト" onClick={handleLogoutClick} variant="destructive" />
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ログアウト確認"
      >
        <div className="mb-4">本当にログアウトしますか？</div>
        <div className="flex justify-end">
          <Button label="OK" onClick={confirmLogout} variant="destructive" />
        </div>
      </Dialog>
    </div>
  );
};

export default LogoutButton;
