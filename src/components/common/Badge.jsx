import React from 'react';

export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wider uppercase rounded clip-badge transition-all';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs',
  };

  const variants = {
    default: 'bg-bgmi-border/60 text-slate-300 border border-bgmi-border',
    live: 'bg-bgmi-red/20 text-bgmi-red border border-bgmi-red/40 animate-pulse-fast shadow-red-glow',
    gold: 'bg-bgmi-gold/15 text-bgmi-gold border border-bgmi-gold/40 shadow-gold-glow',
    cyan: 'bg-bgmi-cyan/15 text-bgmi-cyan border border-bgmi-cyan/40 shadow-cyan-glow',
    green: 'bg-bgmi-green/15 text-bgmi-green border border-bgmi-green/40',
    pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    rejected: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
