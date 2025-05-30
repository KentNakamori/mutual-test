/**
 * 企業ユーザー向けログインページ
 * - Auth0認証を使用したログイン機能
 * - Corporate-DB connectionを使用
 * - ログイン後のリダイレクト先は /corporate/dashboard
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MinimalHeader from '@/components/common/MinimalHeader';
import MinimalFooter from '@/components/common/MinimalFooter';
import Button from '@/components/ui/Button';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const handleLogoClick = () => router.push('/');
  const handleLogin = () => {
    // Corporate-DB connection 指定、ログイン後に /corporate/dashboard へ
    router.push('/api/auth/corporate-login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MinimalHeader onClickLogo={handleLogoClick} logoText="MyApp" links={[{ label: 'Home', href: '/' }]} />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-6 space-y-8 bg-white shadow rounded-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">企業ユーザーログイン</h1>
            <p className="mt-2 text-sm text-gray-600">アカウントにアクセスして企業情報を管理</p>
          </div>
          <Button label="Auth0でログイン" onClick={handleLogin} className="w-full" />
          <div className="text-center text-xs text-gray-500">
            ログインすることで、利用規約とプライバシーポリシーに同意したことになります。
          </div>
        </div>
      </main>
      <MinimalFooter
        footerLinks={[{ label: 'Terms', href: '/terms' }, { label: 'Contact', href: '/contact' }]}
        copyrightText="MyApp Inc."
        onSelectLink={(href) => router.push(href)}
      />
    </div>
  );
};

export default LoginPage;
