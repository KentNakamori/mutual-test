import { auth0 } from '@/lib/auth0';
import Link from 'next/link';
import './globals.css';


export default async function Home() {
  const session = await auth0.getSession();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      {!session ? (
        <>
          <Link href="/auth/login?screen_hint=signup"><button>Sign up</button></Link>
          <Link href="/auth/login"><button>Log in</button></Link>
        </>
      ) : (
        <>
          <h1>Welcome, {session.user?.name ?? session.user?.email}!</h1>
          <Link href="/auth/logout"><button>Log out</button></Link>
        </>
      )}
    </main>
  );
}
