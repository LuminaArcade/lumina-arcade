'use client';

import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';

const NAV_LINKS = [
  { href: '/pools',       label: 'POOLS' },
  { href: '/leaderboard', label: 'RANKINGS' },
];

export function Navbar() {
  const { login, logout, authenticated, user } = usePrivy();
  const pathname = usePathname();

  const twitterHandle = user?.twitter?.username;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16"
      style={{
        background: 'rgba(5, 5, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,255,255,0.1)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            boxShadow: '0 0 12px rgba(0,255,255,0.4)',
          }}
        >
          <Zap size={14} color="#000" fill="#000" />
        </div>
        <span
          className="font-arcade font-bold text-sm tracking-widest"
          style={{ color: 'var(--neon-cyan)' }}
        >
          LUMINA
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono text-xs tracking-wider transition-colors"
            style={{
              color: pathname.startsWith(link.href)
                ? 'var(--neon-cyan)'
                : 'var(--text-secondary)',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Auth */}
      <div className="flex items-center gap-3">
        {authenticated ? (
          <>
            {twitterHandle && (
              <span
                className="hidden md:block text-xs font-mono"
                style={{ color: 'var(--text-secondary)' }}
              >
                @{twitterHandle}
              </span>
            )}
            <button
              onClick={() => logout()}
              className="px-4 py-1.5 rounded text-xs font-mono transition-all hover:scale-105"
              style={{
                border: '1px solid rgba(255,0,153,0.3)',
                color: 'var(--neon-pink)',
              }}
            >
              LOGOUT
            </button>
          </>
        ) : (
          <button
            onClick={() => login()}
            className="px-5 py-1.5 rounded text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              color: '#000',
              boxShadow: '0 0 15px rgba(0,255,255,0.25)',
            }}
          >
            CONNECT
          </button>
        )}
      </div>
    </nav>
  );
}
