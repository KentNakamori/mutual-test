// app/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {/* ロゴ画像を中央に配置（高さ約30px） */}
        <div className="flex justify-center mb-8">
        <Image src="/images/qa-station-logo.png" alt="QA Station Logo" width={180} height={50} />

        </div>

        <h2 className="text-xl font-semibold mb-6 text-center">ログインページを選択</h2>

        <div className="flex flex-col space-y-4">
          <Link
            href="/corporate/login"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
          >
            企業ログイン
          </Link>
          <Link
            href="/investor/login"
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-center"
          >
            投資家ログイン
          </Link>
          <Link
            href="/guest_login"
            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 text-center"
          >
            ゲストログイン
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/about" className="text-blue-500 hover:underline">
            会社概要
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

