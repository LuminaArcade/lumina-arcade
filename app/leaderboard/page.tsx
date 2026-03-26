'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, TrendingUp, Users } from 'lucide-react';
import { RARITY_COLORS } from '@/lib/xp';

interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username?: string;
    twitter_handle?: string;
    total_xp: number;
    level: number;
    total_fees_earned: number;
  };
  character?: {
    name: string;
    image_url?: string;
    rarity: string;
  };
  total_pledged: number;
  pools_launched: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(({ data }) => setEntries(data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-arcade text-3xl font-black mb-2">
          <span className="gradient-text">KOL RANKINGS</span>
        </h1>
        <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
          Leaderboard em tempo real. Ordenado por XP + fees ganhas + pools lançadas.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{
              borderColor: 'var(--neon-cyan)',
              borderTopColor: 'transparent',
            }}
          />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-arcade text-lg mb-4" style={{ color: 'var(--text-muted)' }}>
            AINDA SEM JOGADORES
          </p>
          <Link
            href="/pools/create"
            className="text-sm font-mono"
            style={{ color: 'var(--neon-cyan)' }}
          >
            Sê o primeiro a criar uma pool →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="arcade-card p-4 flex items-center gap-4"
            >
              {/* Rank */}
              <div
                className="font-arcade font-black text-lg w-10 text-center flex-shrink-0"
                style={{
                  color:
                    i === 0 ? '#FFD700' :
                    i === 1 ? '#C0C0C0' :
                    i === 2 ? '#CD7F32' :
                    'var(--text-muted)',
                }}
              >
                #{entry.rank}
              </div>

              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{
                  border: `2px solid ${entry.character ? RARITY_COLORS[entry.character.rarity] : 'var(--border-subtle)'}`,
                  background: 'var(--bg-elevated)',
                }}
              >
                {entry.character?.image_url ? (
                  <img
                    src={entry.character.image_url}
                    alt={entry.character.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Zap size={20} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-arcade font-bold text-sm truncate">
                    {entry.user.twitter_handle
                      ? `@${entry.user.twitter_handle}`
                      : entry.user.username ?? 'Anónimo'}
                  </span>
                  {entry.character && (
                    <span
                      className="text-xs font-mono truncate"
                      style={{ color: RARITY_COLORS[entry.character.rarity] }}
                    >
                      {entry.character.name}
                    </span>
                  )}
                </div>
                <div
                  className="flex items-center gap-4 text-xs font-mono"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span className="flex items-center gap-1">
                    <Zap size={10} style={{ color: 'var(--neon-cyan)' }} />
                    {entry.user.total_xp.toLocaleString()} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp size={10} style={{ color: 'var(--neon-green)' }} />
                    {entry.total_pledged.toFixed(2)} SOL
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={10} style={{ color: 'var(--neon-purple)' }} />
                    {entry.pools_launched} lançadas
                  </span>
                </div>
              </div>

              {/* Level badge */}
              <div
                className="font-arcade font-black text-sm px-3 py-1 rounded flex-shrink-0"
                style={{
                  background: 'rgba(0,255,255,0.08)',
                  color: 'var(--neon-cyan)',
                  border: '1px solid rgba(0,255,255,0.2)',
                }}
              >
                LVL {entry.user.level}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
