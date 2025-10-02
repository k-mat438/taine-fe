import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MobileNavbar } from '@/components/mobile-navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Taine - タスク管理アプリ',
  description: 'シンプルで使いやすいタスク管理アプリ',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Taine',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <main className="pb-16 min-h-screen">
          {children}
        </main>
        <MobileNavbar />
      </body>
    </html>
  );
}
