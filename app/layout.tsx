import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Lumina Arcade | GameFi + SocialFi on Bags.fm',
  description: 'AI-powered gamified community token launches on Bags.fm. Create pools, pledge SOL, earn XP, and level up your unique arcade character.',
  openGraph: {
    title: 'Lumina Arcade',
    description: 'Launch tokens together. Earn fees forever.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LuminaArcade',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
