/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bgmi: {
          // Dark theme variables (Deep Graphite & Dark Steel Navy) - KEEPING FOR NOW
          dark: '#0B0E14',
          surface: '#121620',
          card: '#181E2C',
          border: '#1E2638',
          'border-bright': '#2C364F',
          
          // Primary Accents - KEEPING FOR NOW
          red: '#E5383B',
          'red-hover': '#C52225',
          'red-glow': 'rgba(229, 56, 59, 0.35)',
          gold: '#D4AF37',
          'gold-hover': '#B89320',
          'gold-muted': '#C5A059',
          'gold-glow': 'rgba(212, 175, 55, 0.25)',
          cyan: '#00f0ff',
          green: '#10b981',
          muted: '#94A3B8',
          dim: '#64748B',
          text: '#F8F9FA',

          // Light theme explicit colors - KEEPING FOR NOW
          'light-bg': '#F4F6F8',
          'light-surface': '#FFFFFF',
          'light-card': '#F8FAFC',
          'light-border': '#E2E8F0',
          'light-text': '#0F172A',
          'light-muted': '#475569',
        },
        // NEW PREMIUM TOKENS
        premium: {
          background: '#F7F5EF',
          surface: '#FFFFFF',
          'surface-soft': '#EEE9DE',
          text: '#17201F',
          'text-secondary': '#66706B',
          sage: '#7D8D78',
          'sage-soft': '#E1E6DC',
          champagne: '#C9B28A',
          border: '#E2DED4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'], // Overwriting Chakra Petch temporarily as per request to use Inter exclusively
        broadcast: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 25px rgba(229, 56, 59, 0.35)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'tactical': '0 0 0 1px rgba(229, 56, 59, 0.3), 0 10px 25px -5px rgba(0, 0, 0, 0.8)',
        'light-card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'light-glow': '0 0 20px rgba(229, 56, 59, 0.15)',
        // NEW PREMIUM SHADOWS
        'premium-soft': '0 8px 30px rgba(23, 32, 31, 0.06)',
        'premium-float': '0 12px 40px rgba(23, 32, 31, 0.08)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 10px rgba(229, 56, 59, 0.2)' },
          '100%': { boxShadow: '0 0 28px rgba(229, 56, 59, 0.55)' },
        },
      },
    },
  },
  plugins: [],
};

