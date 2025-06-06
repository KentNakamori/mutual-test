import { auth0 } from '@/lib/auth0';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth0.getSession();

  // ログイン済みの場合、ロールに応じてリダイレクト
  if (session?.user) {
    const userRole = session.user['https://salt2.dev/role'];
    if (userRole === 'corporate') {
      redirect('/corporate/dashboard');
    } else if (userRole === 'investor') {
      redirect('/investor/companies');
    } else if (userRole === 'admin') {
      redirect('/admin');
    }
  }

  // 未ログインの場合は、ゲストとして投資家ページにリダイレクト
  redirect('/investor/companies');
}




