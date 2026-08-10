/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bgmi: {
          dark: '#080a0f',
          surface: '#11141d',
          card: '#181c28',
          border: '#262b3d',
          gold: '#ffb703',
          'gold-hover': '#e6a400',
          orange: '#ff6b00',
          cyan: '#00f0ff',
          green: '#00e676',
          red: '#ff3366',
          muted: '#8e96a8',
          text: '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(255, 183, 3, 0.25)',
        'cyan-glow': '0 0 25px rgba(0, 240, 255, 0.25)',
        'red-glow': '0 0 25px rgba(255, 51, 102, 0.25)',
        'card-glow': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 10px rgba(255, 183, 3, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 183, 3, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
