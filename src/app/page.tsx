import { redirect } from 'next/navigation';

export default function Home() {
  // ホームページアクセス時は投資家向けページにリダイレクト
  redirect('/investor');
}




