import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface GuestRestrictedContentProps {
  featureName: string;
}

const GuestRestrictedContent: React.FC<GuestRestrictedContentProps> = ({ featureName }) => {
  const router = useRouter();

  const handleLoginClick = () => {
    // Auth0ログインページへリダイレクト（現在のURLをreturnToに設定）
    const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/investor/companies';
    router.push(`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {featureName}機能はログインユーザーのみ利用可能です
        </h3>
        <p className="text-gray-600">
          この機能を利用するには、アカウントを作成してログインしてください。
        </p>
      </div>
      <Button
        label="ログインする"
        onClick={handleLoginClick}
        variant="primary"
      />
    </div>
  );
};

export default GuestRestrictedContent; 