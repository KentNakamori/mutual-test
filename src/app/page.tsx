import { auth0 } from '@/lib/auth0';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth0.getSession();

  // ログイン済みの場合、ユーザータイプに応じてリダイレクト
  if (session?.user) {
    const userType = session.user['https://your-domain/userType'];
    if (userType === 'corporate') {
      redirect('/corporate/dashboard');
    } else if (userType === 'investor') {
      redirect('/investor/companies');
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {/* ──────────── ロゴ ──────────── */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/qa-station-logo.png"
            alt="QA Station Logo"
            width={180}
            height={50}
          />
        </div>

        {/* ──────────── ログインボタン ──────────── */}
        <h2 className="text-xl font-semibold mb-6 text-center">
          ログインページを選択
        </h2>

        <div className="flex flex-col space-y-4">
          <Link
            href="/api/auth/corporate-login"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
          >
            企業ログイン
          </Link>

          <Link
            href="/api/auth/investor-login"
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-center"
          >
            投資家ログイン
          </Link>

          <Link
            href="/auth/login?screen_hint=signup"
            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 text-center"
          >
            ゲストログイン
          </Link>
        </div>

        {/* 会社概要 */}
        <div className="mt-8 text-center">
          <Link href="/about" className="text-blue-500 hover:underline">
            会社概要
          </Link>
        </div>
      </div>
    </main>
  );
}




