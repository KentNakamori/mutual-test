import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0';
import { Lock, UserPlus, LogIn, X } from 'lucide-react';

interface GuestRestrictedContentProps {
  featureName: string;
  children?: React.ReactNode;
  onClose?: () => void;
  isPopup?: boolean;
}

const GuestRestrictedContent: React.FC<GuestRestrictedContentProps> = ({ 
  featureName, 
  children, 
  onClose, 
  isPopup = false 
}) => {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const handleLoginClick = () => {
    const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/investor/companies';
    router.push(`/api/auth/investor-login?returnTo=${encodeURIComponent(returnTo)}`);
  };

  const handleSignupClick = () => {
    const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/investor/companies';
    router.push(`/api/auth/investor-login?screen_hint=signup&returnTo=${encodeURIComponent(returnTo)}`);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  // ローディング中は何も表示しない
  if (isLoading) {
    return isPopup ? null : <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  // 認証済みユーザーには子要素を表示
  if (user) {
    return <>{children}</>;
  }

  // ポップアップ表示の場合
  if (isPopup) {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="p-8">
            <div className="mb-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {featureName}はログインが必要です
              </h3>
              <p className="text-gray-600 mb-3 leading-relaxed">
                この機能をご利用いただくには、アカウントへのログインが必要です。
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                アカウントをお持ちでない方は、簡単に新規登録していただけます。
              </p>
            </div>
            
            <div className="w-full space-y-4 mb-6">
              <button
                onClick={handleLoginClick}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-sm"
              >
                <LogIn className="h-5 w-5" />
                ログインする
              </button>
              <button
                onClick={handleSignupClick}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition duration-200"
              >
                <UserPlus className="h-5 w-5" />
                新規登録する
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 通常表示の場合（従来の挙動）
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto mt-8 p-8">
      <div className="mb-8">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-10 w-10 text-blue-400" />
        </div>
      </div>
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {featureName}はログインが必要です
        </h3>
        <p className="text-gray-600 mb-3 leading-relaxed">
          この機能をご利用いただくには、アカウントへのログインが必要です。
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          アカウントをお持ちでない方は、簡単に新規登録していただけます。
        </p>
      </div>
      
      <div className="w-full space-y-4 mb-6">
        <button
          onClick={handleLoginClick}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-sm"
        >
          <LogIn className="h-5 w-5" />
          ログインする
        </button>
        <button
          onClick={handleSignupClick}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition duration-200"
        >
          <UserPlus className="h-5 w-5" />
          新規登録する
        </button>
      </div>
      
      <div className="text-center">
        <a 
          href="/investor/companies" 
          className="text-sm text-blue-600 hover:text-blue-800 underline hover:no-underline transition duration-200"
        >
          企業一覧に戻る
        </a>
      </div>
    </div>
  );
};

export default GuestRestrictedContent; 