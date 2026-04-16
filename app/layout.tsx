import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0052FE',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Tax Loss Harvesting — KoinX',
  description:
    'Reduce your crypto tax liability by harvesting unrealised losses to offset capital gains.',
  keywords: ['crypto tax', 'tax loss harvesting', 'capital gains', 'KoinX', 'bitcoin tax'],
  authors: [{ name: 'KoinX' }],
  robots: { index: true, follow: true },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Tax Loss Harvesting — KoinX',
    description: 'Reduce your crypto tax liability by harvesting unrealised losses to offset capital gains.',
    type: 'website',
    locale: 'en_US',
    siteName: 'KoinX',
  },
  twitter: {
    card: 'summary',
    title: 'Tax Loss Harvesting — KoinX',
    description: 'Reduce your crypto tax liability by harvesting unrealised losses to offset capital gains.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-text antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
