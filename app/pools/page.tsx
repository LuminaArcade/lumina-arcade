'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PoolCard } from '@/components/PoolCard';
import type { Pool } from '@/lib/types';

type StatusFilter = 'open' | 'launched';

export default function PoolsPage() {
  const [pools, setPools]   = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<StatusFilter>('open');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pools?status=${filter}&limit=20`)
      .then(r => r.json())
      .then(({ data }) => setPools(data ?? []))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-arcade text-3xl font-black mb-1">
            <span className="gradient-text">POOLS</span>
          </h1>
          <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
            Junta-te a uma pool ou cria a tua própria.
          </p>
        </div>
        <Link
          href="/pools/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-arcade font-bold text-xs transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            color: '#000',
            boxShadow: '0 0 20px rgba(0,255,255,0.2)',
          }}
        >
          <Plus size={14} />
          CRIAR POOL
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        {(['open', 'launched'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded font-mono text-xs transition-all"
            style={
              filter === s
                ? {
                    background: 'rgba(0,255,255,0.12)',
                    color: 'var(--neon-cyan)',
                    border: '1px solid rgba(0,255,255,0.3)',
                  }
                : {
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }
            }
          >
            {s === 'open' ? '⚡ ABERTAS' : '🚀 LANÇADAS'}
          </button>
        ))}
      </div>

      {/* Pool grid */}
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
      ) : pools.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="font-arcade text-lg mb-4" style={{ color: 'var(--text-muted)' }}>
            NENHUMA POOL {filter === 'open' ? 'ABERTA' : 'LANÇADA'}
          </p>
          <Link
            href="/pools/create"
            className="text-sm font-mono"
            style={{ color: 'var(--neon-cyan)' }}
          >
            Sê o primeiro a criar uma →
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pools.map((pool, i) => (
            <PoolCard key={pool.id} pool={pool} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
