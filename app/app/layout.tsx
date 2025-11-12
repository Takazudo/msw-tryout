import type { Metadata } from 'next';
import './globals.css';

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
        {children}
      </body>
    </html>
  );
}
