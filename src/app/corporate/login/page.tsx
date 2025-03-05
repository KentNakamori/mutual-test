'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MinimalHeader from '@/components/common/MinimalHeader';
import MinimalFooter from '@/components/common/MinimalFooter';
import LoginCard from '@/components/features/corporate/login/LoginCard';

/**
 * LoginPage
 * 企業向けログインページ本体。MinimalHeader と MinimalFooter を配置し、
 * 中央に LoginCard を表示します。
 */
const LoginPage: React.FC = () => {
  const router = useRouter();

  // ロゴクリック時の遷移（例: トップページへ）
  const handleLogoClick = () => {
    router.push('/');
  };

  // フッターリンク選択時の遷移処理
  const handleFooterLinkSelect = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MinimalHeader
        onClickLogo={handleLogoClick}
        logoText="MyApp"
        links={[{ label: 'Home', href: '/' }]}
      />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <LoginCard />
      </main>
      <MinimalFooter
        footerLinks={[
          { label: 'Terms', href: '/terms' },
          { label: 'Contact', href: '/contact' },
        ]}
        copyrightText="MyApp Inc."
        onSelectLink={handleFooterLinkSelect}
      />
    </div>
  );
};

export default LoginPage;
