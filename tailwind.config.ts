import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan':   '#00FFFF',
        'neon-purple': '#BF00FF',
        'neon-pink':   '#FF0099',
        'neon-green':  '#00FF88',
        'neon-yellow': '#FFE500',
        'neon-orange': '#FF6B00',
        'bg-void':     '#050510',
        'bg-deep':     '#0A0A1A',
        'bg-card':     '#0F0F22',
        'bg-elevated': '#14142A',
      },
      fontFamily: {
        mono:   ['Space Mono', 'Courier New', 'monospace'],
        arcade: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'gradient-shift': 'gradientShift 4s ease infinite',
        'neon-pulse':     'neonPulse 2s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        neonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
