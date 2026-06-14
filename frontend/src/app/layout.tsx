import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { RevealInit } from '@/components/home/RevealInit';
import { PageTransition } from '@/components/ui/PageTransition';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'SapphireVibes — Considered Décor for the Australian Home',
  description:
    'Shop curated home décor for the Australian home. Wall art, mirrors, statues, planters and more — with AR preview, Afterpay, and free shipping over $150.',
  keywords: 'home decor australia, wall art, mirrors, planters, diwali decor, luxury home',
  openGraph: {
    title: 'SapphireVibes',
    description: 'Considered home décor for the Australian home.',
    type: 'website',
    locale: 'en_AU',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0e1116" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="pt-[66px] pb-16 md:pb-0">
        <Providers>
          <RevealInit />
          <PageTransition>{children}</PageTransition>
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
