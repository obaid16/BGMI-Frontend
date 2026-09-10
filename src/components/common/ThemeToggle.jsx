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

  return null; // Disabled for premium unified theme
}
