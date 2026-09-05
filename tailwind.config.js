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
          // Dark Theme (Tactical Graphite / Steel Navy)
          dark: '#0B0E14',
          surface: '#121620',
          card: '#181E2C',
          border: '#1E2638',
          'border-bright': '#2C364F',

          // Light Theme (Editorial Ivory & Warm Neutrals from Reference)
          ivory: '#FAF8F5',
          'warm-surface': '#FFFFFF',
          'warm-card': '#FFFFFF',
          'warm-muted-card': '#F5F2EB',
          'warm-border': '#E7E3DA',
          'warm-border-subtle': '#EFECE6',
          'warm-text': '#0F172A',
          'warm-muted': '#526071',
          'warm-dim': '#798797',

          // Primary Esports Brand Accents
          red: '#E5383B',
          'red-hover': '#C52225',
          'red-glow': 'rgba(229, 56, 59, 0.25)',
          gold: '#C5A059',
          'gold-hover': '#AD8944',
          'gold-muted': '#B8934A',
          'gold-glow': 'rgba(197, 160, 89, 0.2)',
          'gold-soft': '#FBF8F2',

          // Neutral Tokens
          muted: '#94A3B8',
          dim: '#64748B',
          text: '#F8F9FA',

          // Light mode legacy aliases
          'light-bg': '#FAF8F5',
          'light-surface': '#FFFFFF',
          'light-card': '#FFFFFF',
          'light-border': '#E7E3DA',
          'light-text': '#0F172A',
          'light-muted': '#526071',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Chakra Petch', 'Outfit', 'Inter', 'sans-serif'],
        broadcast: ['Chakra Petch', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'editorial-sm': '0 2px 8px rgba(15, 23, 42, 0.04)',
        'editorial': '0 6px 20px -4px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'editorial-lg': '0 16px 36px -6px rgba(15, 23, 42, 0.09), 0 6px 16px -2px rgba(15, 23, 42, 0.04)',
        'red-glow': '0 0 25px rgba(229, 56, 59, 0.28)',
        'gold-glow': '0 0 25px rgba(197, 160, 89, 0.22)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'tactical': '0 0 0 1px rgba(229, 56, 59, 0.3), 0 10px 25px -5px rgba(0, 0, 0, 0.8)',
        'light-card': '0 10px 25px -5px rgba(15, 23, 42, 0.04), 0 8px 10px -6px rgba(15, 23, 42, 0.02)',
        'light-glow': '0 0 20px rgba(229, 56, 59, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
