import React from 'react';
import InvestorRegistrationForm from '@/components/features/investor/onboarding/InvestorRegistrationForm';

const InvestorOnboardingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ユーザー情報登録
          </h1>
          <p className="text-gray-600">
            サービスをご利用いただくために、基本情報をご入力ください。
          </p>
        </div>

        {/* プログレスインジケーター */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                基本情報入力
              </span>
            </div>
          </div>
        </div>

        {/* フォーム */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <InvestorRegistrationForm />
        </div>

        {/* フッター */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ご不明な点がございましたら、
            <a href="/contact" className="text-blue-600 hover:text-blue-500">
              お問い合わせ
            </a>
            ください。
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestorOnboardingPage; 