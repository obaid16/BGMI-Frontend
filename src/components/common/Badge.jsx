import React from 'react';

export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide uppercase rounded-full transition-all border';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs',
  };

  const variants = {
    default: 'bg-premium-surface-soft text-premium-text-secondary border-premium-border',
    live: 'bg-red-50 text-red-600 border-red-200 shadow-sm',
    gold: 'bg-amber-50 text-amber-700 border-amber-200',
    cyan: 'bg-sky-50 text-sky-700 border-sky-200',
    green: 'bg-premium-sage-soft text-premium-sage border-premium-sage/30',
    pending: 'bg-orange-50 text-orange-700 border-orange-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
