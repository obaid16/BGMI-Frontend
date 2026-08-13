'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className={`w-9 h-9 rounded-xl bg-bgmi-surface/60 border border-bgmi-border ${className}`} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle Light & Dark Mode"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`relative p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${
        isDark
          ? 'bg-bgmi-surface/90 border-bgmi-border hover:border-bgmi-gold text-bgmi-gold hover:bg-bgmi-card shadow-gold-glow/20'
          : 'bg-white border-slate-200 hover:border-bgmi-red text-amber-500 hover:bg-slate-50 shadow-sm'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-bgmi-gold animate-in spin-in-90 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-800 animate-in spin-in-90 duration-300" />
      )}
    </button>
  );
}
