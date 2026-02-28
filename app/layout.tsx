import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gymshark × Method Financial',
  description: 'Method Financial embedded payments demo for Shopify checkout',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
