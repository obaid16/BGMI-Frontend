import React from 'react';

export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center font-display font-bold tracking-wider uppercase rounded-full transition-all';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-0.5 text-[11px]',
    lg: 'px-3 py-1 text-xs',
  };

  const variants = {
    default: 'bg-[#F0ECE4] dark:bg-[#1E2638] text-slate-700 dark:text-slate-300 border border-[#E7E3DA] dark:border-[#2C364F]',
    live: 'bg-red-500/15 text-bgmi-red border border-red-500/30 animate-pulse font-black',
    gold: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold',
    cyan: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/30 font-bold',
    green: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-bold',
    pending: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold',
    rejected: 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30 font-bold',
    approved: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-bold',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
