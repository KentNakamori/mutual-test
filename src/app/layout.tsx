// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Mutual Finance Platform',
  description: 'IR Communication Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased bg-gray-50 text-gray-900 min-h-screen`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
