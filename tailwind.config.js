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
          // Dark theme variables
          dark: '#08090d',
          surface: '#0f121a',
          card: '#151924',
          border: '#222838',
          'border-bright': '#343d54',
          
          // Primary Accents
          red: '#e6193c',
          'red-hover': '#cf1333',
          'red-glow': 'rgba(230, 25, 60, 0.4)',
          gold: '#ffb703',
          'gold-hover': '#e6a400',
          cyan: '#00f0ff',
          green: '#10b981',
          muted: '#8e96a8',
          text: '#f1f5f9',

          // Light theme explicit colors
          'light-bg': '#f8fafc',
          'light-surface': '#ffffff',
          'light-card': '#f1f5f9',
          'light-border': '#e2e8f0',
          'light-text': '#0f172a',
          'light-muted': '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'red-glow': '0 0 25px rgba(230, 25, 60, 0.35)',
        'gold-glow': '0 0 25px rgba(255, 183, 3, 0.25)',
        'cyan-glow': '0 0 25px rgba(0, 240, 255, 0.25)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'tactical': '0 0 0 1px rgba(230, 25, 60, 0.3), 0 10px 25px -5px rgba(0, 0, 0, 0.8)',
        'light-card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'light-glow': '0 0 20px rgba(230, 25, 60, 0.15)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 10px rgba(230, 25, 60, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(230, 25, 60, 0.6)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
