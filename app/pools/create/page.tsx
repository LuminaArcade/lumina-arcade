'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import toast from 'react-hot-toast';

const POOL_TYPES = [
  { value: 'solo',      label: 'SOLO',      desc: 'Só tu. 100% das fees são tuas.' },
  { value: 'community', label: 'COMMUNITY', desc: 'Chama a tua tribo. Fees partilhadas proporcionalmente.' },
] as const;

const THRESHOLD_TYPES = [
  { value: 'sol',          label: 'SOL Target',         desc: 'Auto-lança quando SOL arrecadado ≥ threshold' },
  { value: 'contributors', label: 'Contributor Target', desc: 'Auto-lança quando pledgers únicos ≥ threshold' },
] as const;

export default function CreatePoolPage() {
  const { authenticated, login, getAccessToken } = usePrivy();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:            '',
    description:     '',
    token_name:      '',
    token_symbol:    '',
    pool_type:       'community' as 'solo' | 'community',
    threshold_type:  'sol'       as 'sol' | 'contributors',
    threshold_value: 5,
    creator_wallet:  '',
  });

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 className="font-arcade text-2xl" style={{ color: 'var(--neon-cyan)' }}>
          CONNECT TO CREATE
        </h1>
        <button
          onClick={login}
          className="px-8 py-3 font-arcade font-bold rounded-lg"
          style={{
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            color: '#000',
          }}
        >
          CONNECT WALLET
        </button>
      </div>
    );
  }

  const field = (key: keyof typeof form, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('A criar a tua pool...');

    try {
      const token = await getAccessToken();
      const res = await fetch('/api/pools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          token_symbol: form.token_symbol.toUpperCase(),
          creator_wallet: form.creator_wallet || 'placeholder_wallet',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Falha ao criar pool');
      }

      const { data } = await res.json();
      toast.success('Pool criada! Partilha para começar a arrecadar SOL.', { id: toastId });
      router.push(`/pools/${data.id}`);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Algo correu mal',
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-arcade text-3xl font-black mb-2">
          <span className="gradient-text">CRIAR POOL</span>
        </h1>
        <p className="text-sm font-mono mb-10" style={{ color: 'var(--text-secondary)' }}>
          Define o threshold → comunidade faz pledge de SOL → token lança no Bags.fm
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Pool type */}
          <div>
            <label className="block text-xs font-arcade mb-3" style={{ color: 'var(--neon-cyan)' }}>
              TIPO DE POOL
            </label>
            <div className="grid grid-cols-2 gap-3">
              {POOL_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => field('pool_type', pt.value)}
                  className="arcade-card p-4 text-left transition-all"
                  style={form.pool_type === pt.value ? {
                    borderColor: 'var(--neon-cyan)',
                    boxShadow: '0 0 15px rgba(0,255,255,0.15)',
                  } : {}}
                >
                  <div className="font-arcade font-bold text-sm mb-1">{pt.label}</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {pt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-arcade mb-2" style={{ color: 'var(--neon-cyan)' }}>
                NOME DA POOL
              </label>
              <input
                required
                value={form.name}
                onChange={e => field('name', e.target.value)}
                placeholder="ex: Degen Cabal Season 3"
                className="w-full px-4 py-3 rounded-lg font-mono text-sm outline-none transition-all"
                style={{
                  border: '1px solid rgba(0,255,255,0.2)',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-card)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--neon-cyan)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(0,255,255,0.2)')}
              />
            </div>
            <div>
              <label className="block text-xs font-arcade mb-2" style={{ color: 'var(--neon-cyan)' }}>
                DESCRIÇÃO
              </label>
              <textarea
                required
                value={form.description}
                onChange={e => field('description', e.target.value)}
                placeholder="Qual é a visão desta pool?"
                rows={3}
                className="w-full px-4 py-3 rounded-lg font-mono text-sm resize-none outline-none transition-all"
                style={{
                  border: '1px solid rgba(0,255,255,0.2)',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-card)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--neon-cyan)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(0,255,255,0.2)')}
              />
            </div>
          </div>

          {/* Token info */}
          <div>
            <label className="block text-xs font-arcade mb-3" style={{ color: 'var(--neon-purple)' }}>
              TOKEN
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Nome do Token
                </label>
                <input
                  required
                  value={form.token_name}
                  onChange={e => field('token_name', e.target.value)}
                  placeholder="Degen Cabal"
                  className="w-full px-4 py-3 rounded-lg font-mono text-sm outline-none transition-all"
                  style={{
                    border: '1px solid rgba(191,0,255,0.2)',
                    color: 'var(--text-primary)',
                    background: 'var(--bg-card)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--neon-purple)')}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(191,0,255,0.2)')}
                />
              </div>
              <div>
                <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Ticker
                </label>
                <input
                  required
                  value={form.token_symbol}
                  onChange={e => field('token_symbol', e.target.value.toUpperCase().slice(0, 8))}
                  placeholder="DEGEN"
                  maxLength={8}
                  className="w-full px-4 py-3 rounded-lg font-arcade text-sm outline-none transition-all"
                  style={{
                    border: '1px solid rgba(191,0,255,0.2)',
                    color: 'var(--neon-purple)',
                    background: 'var(--bg-card)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--neon-purple)')}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(191,0,255,0.2)')}
                />
              </div>
            </div>
          </div>

          {/* Threshold */}
          <div>
            <label className="block text-xs font-arcade mb-3" style={{ color: 'var(--neon-pink)' }}>
              THRESHOLD DE LANÇAMENTO
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {THRESHOLD_TYPES.map((tt) => (
                <button
                  key={tt.value}
                  type="button"
                  onClick={() => field('threshold_type', tt.value)}
                  className="arcade-card p-3 text-left"
                  style={form.threshold_type === tt.value ? {
                    borderColor: 'var(--neon-pink)',
                    boxShadow: '0 0 15px rgba(255,0,153,0.15)',
                  } : {}}
                >
                  <div className="font-arcade font-bold text-xs mb-1">{tt.label}</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {tt.desc}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                required
                min={0.1}
                step={0.1}
                value={form.threshold_value}
                onChange={e => field('threshold_value', parseFloat(e.target.value))}
                className="flex-1 px-4 py-3 rounded-lg font-arcade text-xl outline-none"
                style={{
                  border: '1px solid rgba(255,0,153,0.3)',
                  color: 'var(--neon-pink)',
                  background: 'var(--bg-card)',
                }}
              />
              <span className="font-arcade font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>
                {form.threshold_type === 'sol' ? 'SOL' : 'MEMBERS'}
              </span>
            </div>
          </div>

          {/* Fee share note */}
          <div
            className="flex gap-3 p-4 rounded-lg"
            style={{
              background: 'rgba(0,255,136,0.06)',
              border: '1px solid rgba(0,255,136,0.2)',
            }}
          >
            <Info size={16} style={{ color: 'var(--neon-green)', flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--neon-green)' }}>
              No lançamento, o fee share é configurado automaticamente no Bags.fm:{' '}
              <strong>90% proporcional aos pledgers</strong> (por SOL contribuído),{' '}
              <strong>10% plataforma</strong>. Todos os claimers ganham para sempre.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-arcade font-black text-sm rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{
              background: loading
                ? 'var(--bg-elevated)'
                : 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              color: '#000',
              boxShadow: loading ? 'none' : '0 0 30px rgba(0,255,255,0.3)',
            }}
          >
            {loading ? 'A CRIAR...' : '⚡ LANÇAR POOL'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
