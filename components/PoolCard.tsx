'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Users, TrendingUp, Clock } from 'lucide-react';
import type { Pool } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  pool: Pool;
  index?: number;
}

export function PoolCard({ pool, index = 0 }: Props) {
  const progress =
    pool.threshold_type === 'sol'
      ? Math.min(100, (pool.sol_raised / pool.threshold_value) * 100)
      : Math.min(100, (pool.contributor_count / pool.threshold_value) * 100);

  const statusColors = {
    open:     'var(--neon-cyan)',
    launched: 'var(--neon-green)',
    failed:   '#FF4444',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <Link href={`/pools/${pool.id}`}>
        <div className="arcade-card p-5 cursor-pointer group">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-arcade text-sm font-bold mb-1 group-hover:text-cyan-400 transition-colors">
                {pool.name}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{
                    background: `${statusColors[pool.status]}18`,
                    color: statusColors[pool.status],
                    border: `1px solid ${statusColors[pool.status]}33`,
                  }}
                >
                  ${pool.token_symbol}
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: statusColors[pool.status] }}
                >
                  ● {pool.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div
                className="font-arcade font-bold text-lg"
                style={{ color: 'var(--neon-cyan)' }}
              >
                {pool.sol_raised.toFixed(2)}
                <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>
                  SOL
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div
              className="flex justify-between text-xs font-mono mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>Progresso</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="xp-bar">
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                style={{
                  background:
                    pool.status === 'launched'
                      ? 'linear-gradient(90deg, var(--neon-green), #00FF88)'
                      : 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))',
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between text-xs font-mono"
            style={{ color: 'var(--text-secondary)' }}
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users size={11} />
                {pool.contributor_count}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp size={11} />
                {pool.threshold_value}{' '}
                {pool.threshold_type === 'sol' ? 'SOL' : 'members'}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatDistanceToNow(new Date(pool.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
