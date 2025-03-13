// app/layout.tsx (サーバーコンポーネントのまま)
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from 'next/font/google'
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: "SALT2 - 投資プラットフォーム",
  description: "企業と投資家をつなぐ革新的な投資プラットフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased bg-gray-50 text-gray-900 min-h-screen`}>
        <Providers>
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}