import type { Metadata } from 'next';
import type React from 'react';
import './globals.css';
import { MSWProvider } from '../components/msw-provider';

export const metadata: Metadata = {
  title: 'MSW Gallery Tryout',
  description: 'A simple gallery app for MSW testing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  );
}
