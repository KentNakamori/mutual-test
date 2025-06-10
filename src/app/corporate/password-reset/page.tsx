// src/app/corporate/password-reset/page.tsx
"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MinimalHeader from '@/components/common/MinimalHeader';
import MinimalFooter from '@/components/common/MinimalFooter';
import PasswordResetLinkForm from '@/components/features/corporate/login/PasswordResetLinkForm';
import PasswordResetForm from '@/components/features/corporate/login/PasswordResetForm';

// useSearchParamsを使用するコンポーネントを分離
const PasswordResetContent: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <main className="flex-1 flex items-center justify-center bg-gray-50">
      {token ? <PasswordResetForm /> : <PasswordResetLinkForm />}
    </main>
  );
};

const PasswordResetPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <MinimalHeader onClickLogo={() => {}} />
      <Suspense fallback={
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">読み込み中...</div>
        </main>
      }>
        <PasswordResetContent />
      </Suspense>
      <MinimalFooter copyrightText="MyApp Inc." />
    </div>
  );
};

export default PasswordResetPage;
