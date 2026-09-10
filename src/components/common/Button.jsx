import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
}) {
  const baseStyles = 'group relative inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-full hover:-translate-y-0.5 active:translate-y-0 shadow-sm';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-premium-text hover:bg-black text-white shadow-premium-soft',
    gold: 'bg-premium-champagne hover:opacity-90 text-premium-text shadow-premium-soft',
    secondary: 'bg-premium-surface-soft text-premium-text border border-premium-border hover:bg-premium-border',
    cyan: 'bg-premium-sage hover:opacity-90 text-white shadow-premium-soft',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-premium-soft',
    outline: 'bg-transparent text-premium-text border border-premium-border hover:border-premium-text',
    'outline-gold': 'bg-transparent text-premium-champagne border border-premium-champagne hover:bg-premium-champagne/10',
    ghost: 'bg-transparent hover:bg-premium-surface-soft text-premium-text-secondary hover:text-premium-text shadow-none hover:shadow-none',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5" />}
      <span>{children}</span>
    </button>
  );
}



