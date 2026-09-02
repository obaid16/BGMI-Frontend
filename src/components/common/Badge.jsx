import React from 'react';

export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wider uppercase rounded clip-badge transition-all';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs',
  };

  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    live: 'bg-bgmi-red/15 text-bgmi-red border border-bgmi-red/40 animate-pulse-fast shadow-red-glow font-black',
    gold: 'bg-amber-500/15 text-amber-700 dark:text-bgmi-gold border border-amber-500/40 shadow-gold-glow font-bold',
    cyan: 'bg-amber-500/15 text-amber-700 dark:text-bgmi-gold border border-amber-500/40 shadow-gold-glow font-bold',
    green: 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700',
    pending: 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30',
    rejected: 'bg-bgmi-red/15 text-bgmi-red border border-bgmi-red/30',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

