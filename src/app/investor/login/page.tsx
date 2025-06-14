/**
 * 投資家向けログインページ
 * - Auth0認証を使用したログイン機能
 * - ゲストユーザーとしての閲覧機能
 * - ログイン後のリダイレクト先は /investor/companies
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MinimalHeader from '@/components/common/MinimalHeader';
import MinimalFooter from '@/components/common/MinimalFooter';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const InvestorLoginPage: React.FC = () => {
  const router = useRouter();
  const handleLogoClick = () => router.push('/investor/companies');
  const handleAuth0Login = () => {
    router.push('/api/auth/investor-login');
  };
  const handleGuestContinue = () => router.push('/investor/companies');

  return (
    <div className="min-h-screen flex flex-col">
      <MinimalHeader onClickLogo={handleLogoClick} logoText="MyApp" />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">投資家ログイン</h1>
            <p className="text-gray-600">アカウントをお持ちの方はログインしてください</p>
          </div>
          <Button label="ログイン" onClick={handleAuth0Login} className="w-full" />
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>
          <Button label="ゲストとして閲覧を続ける" onClick={handleGuestContinue} variant="outline" />
          <div className="text-center text-sm text-gray-600">
            <p>一部の機能はログイン後にのみご利用いただけます</p>
          </div>
        </Card>
      </main>
      <MinimalFooter copyrightText="MyApp Inc." />
    </div>
  );
};

export default InvestorLoginPage;
