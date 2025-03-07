// src/components/features/investor/login/LinkToSignup.tsx
import React from 'react';
import Link from 'next/link';

/**
 * LinkToSignup コンポーネント
 * - 「新規登録はこちら」のリンクを表示します。Next.js の Link コンポーネントを用いて、登録ページ（例：/investor/signup）へ遷移させます。
 */
const LinkToSignup: React.FC = () => {
  return (
    <div className="text-center">
      <span className="text-sm text-gray-600">アカウントをお持ちでないですか？</span>
      <Link href="/investor/signup">
        className="text-sm text-blue-600 hover:underline ml-1"新規登録はこちら
      </Link>
    </div>
  );
};

export default LinkToSignup;

