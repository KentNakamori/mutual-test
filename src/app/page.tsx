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

  // 未ログインの場合は、ゲストとして投資家ページにリダイレクト
  redirect('/investor/companies');
}




