import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ThreeFocus',
  description: '오늘 가장 중요한 3가지에 집중하세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
