import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans } from 'next/font/google';
import './globals.css';

// Optimized fonts for Vietnamese
const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter'
});

const notoSans = Noto_Sans({ 
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-noto-sans',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Du lịch miền Nam',
  description: 'Hỏi đáp địa giới hành chính và gợi ý du lịch miền Nam sau sáp nhập 1-7-2025',
  keywords: ['du lịch', 'miền nam', 'AI', 'gợi ý', 'travel', 'sáp nhập 2025'],
  authors: [{ name: 'RAG Tourism Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${notoSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`${notoSans.className} antialiased bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}