// src/app/corporate/password-reset/page.tsx
"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import MinimalHeader from '@/components/common/MinimalHeader';
import MinimalFooter from '@/components/common/MinimalFooter';
import PasswordResetLinkForm from '@/components/features/corporate/login/PasswordResetLinkForm';
import PasswordResetForm from '@/components/features/corporate/login/PasswordResetForm';

const PasswordResetPage: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="min-h-screen flex flex-col">
      <MinimalHeader onClickLogo={() => {}} />
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        {token ? <PasswordResetForm /> : <PasswordResetLinkForm />}
      </main>
      <MinimalFooter copyrightText="MyApp Inc." />
    </div>
  );
};

export default PasswordResetPage;
