'use client';

import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Users, TrendingUp, Shield } from 'lucide-react';

const STATS = [
  { label: 'Pools Live',      value: '12+',   color: 'var(--neon-cyan)' },
  { label: 'SOL Pledged',     value: '420',   color: 'var(--neon-purple)' },
  { label: 'Tokens Launched', value: '8',     color: 'var(--neon-pink)' },
  { label: 'Active Players',  value: '1,337', color: 'var(--neon-green)' },
];

const FEATURES = [
  {
    icon: <Users size={20} />,
    title: 'Community Pools',
    desc: 'Coordena com a tua tribo. Define um threshold de SOL ou contribuidores e lança juntos.',
    color: 'var(--neon-cyan)',
  },
  {
    icon: <Zap size={20} />,
    title: 'Auto-Launch via Bags.fm',
    desc: 'Quando o threshold é atingido, o token lança automaticamente no Bags.fm.',
    color: 'var(--neon-purple)',
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Fee Share Proporcional',
    desc: 'Cada pledger ganha fees on-chain proporcionais à sua contribuição. Para sempre.',
    color: 'var(--neon-pink)',
  },
  {
    icon: <Shield size={20} />,
    title: 'AI Arcade Characters',
    desc: 'Recebe um personagem neon único gerado pelo Claude. Sobe de nível com XP.',
    color: 'var(--neon-green)',
  },
];

export default function HomePage() {
  const { login, authenticated } = usePrivy();
  const router = useRouter();

  return (
    <div className="relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono"
          style={{
            background: 'rgba(0,255,255,0.08)',
            border: '1px solid rgba(0,255,255,0.2)',
            color: 'var(--neon-cyan)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          BUILT ON BAGS.FM · POWERED BY SOLANA
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-arcade text-5xl md:text-7xl font-black mb-6 leading-none"
          style={{ maxWidth: 800 }}
        >
          <span className="gradient-text">LUMINA</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>ARCADE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl mb-10 max-w-xl"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
        >
          Pool SOL com a tua comunidade. Lança tokens no Bags.fm automaticamente.
          Ganha fees on-chain para sempre. Evolui o teu personagem arcade com IA.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => authenticated ? router.push('/pools/create') : login()}
            className="px-8 py-3 font-arcade font-bold text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
              color: '#000',
              boxShadow: '0 0 30px rgba(0,255,255,0.3)',
            }}
          >
            CRIAR POOL
          </button>
          <Link
            href="/pools"
            className="px-8 py-3 font-arcade font-bold text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 text-center"
            style={{
              background: 'transparent',
              border: '1px solid rgba(0,255,255,0.3)',
              color: 'var(--neon-cyan)',
            }}
          >
            EXPLORAR POOLS
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-2xl"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-arcade text-3xl font-black mb-1"
                style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}` }}
              >
                {stat.value}
              </div>
              <div className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-arcade text-2xl text-center mb-12"
          style={{ color: 'var(--text-primary)' }}
        >
          COMO FUNCIONA
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="arcade-card p-6"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${f.color}18`, color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="font-arcade font-bold text-sm mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
