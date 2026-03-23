import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI 에이전트 마켓플레이스',
  description: '전문 AI 에이전트를 발견하고, 사용하고, 수익을 창출하세요.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-950`}>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-white text-lg">
              <span className="text-purple-400">AI</span> Marketplace
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/browse" className="text-gray-400 hover:text-white text-sm transition-colors">
                탐색
              </Link>
              <Link
                href="/register"
                className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                등록하기
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
