// src/app/investor/login/page.tsx
"use client";

import React from 'react';
import MinimalHeader from '@/components/common/MinimalHeader';
import MinimalFooter from '@/components/common/MinimalFooter';
import LoginForm from '@/components/features/investor/login/LoginForm';
import GuestLoginButton from '@/components/features/investor/login/GuestLoginButton';
import LinkToSignup from '@/components/features/investor/login/LinkToSignup';

/**
 * InvestorLoginPage
 * - 共通コンポーネント（MinimalHeader, MinimalFooter）とページ固有コンポーネント（LoginForm, GuestLoginButton, LinkToSignup）を組み合わせたログインページです。
 * - ロゴクリック時は投資家向けトップへ遷移（例：'/investor'）
 */
const InvestorLoginPage: React.FC = () => {
  const handleLogoClick = () => {
    // 例としてトップページへ遷移（Next.js Router等で実装）
    window.location.href = '/investor';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MinimalHeader onClickLogo={handleLogoClick} logoText="MyApp" />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
          <GuestLoginButton />
          <LinkToSignup />
        </div>
      </main>
      <MinimalFooter copyrightText="MyApp Inc." />
    </div>
  );
};

export default InvestorLoginPage;
