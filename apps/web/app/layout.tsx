import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: {
    default: 'PriceLens Nigeria — Smart Retail Price Intelligence',
    template: '%s | PriceLens Nigeria',
  },
  description:
    'Compare grocery prices across markets and supermarkets in Lagos, Abuja, Enugu, Rivers, Kano & Kaduna. AI-powered basket optimisation to save you money.',
  keywords: [
    'price comparison Nigeria',
    'Lagos grocery prices',
    'Abuja market prices',
    'supermarket prices Nigeria',
    'PriceLens Nigeria',
    'compare food prices',
    'shopping list optimizer',
    'Nigeria price index',
  ],
  authors: [{ name: 'PriceLens Nigeria' }],
  creator: 'PriceLens Nigeria',
  metadataBase: new URL('https://pricelens.com.ng'),
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://pricelens.com.ng',
    siteName: 'PriceLens Nigeria',
    title: 'PriceLens Nigeria — Smart Retail Price Intelligence',
    description:
      'Compare grocery prices across markets and supermarkets in Nigeria. AI-powered basket optimisation to save you money.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PriceLens Nigeria',
    description: 'Compare grocery prices across Nigeria. Save money on every shop.',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#059669' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}