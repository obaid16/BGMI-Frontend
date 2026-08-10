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
  const baseStyles = 'inline-flex items-center justify-center font-display font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-7 py-3.5 text-sm gap-2.5 font-bold',
  };

  const variantStyles = {
    primary: 'bg-bgmi-gold hover:bg-bgmi-gold-hover text-slate-950 font-bold shadow-gold-glow hover:shadow-lg active:scale-95 border border-amber-300 clip-tactical',
    secondary: 'bg-bgmi-surface hover:bg-bgmi-card text-white border border-bgmi-border hover:border-bgmi-gold/50 clip-tactical active:scale-95',
    cyan: 'bg-bgmi-cyan text-slate-950 font-bold shadow-cyan-glow hover:bg-cyan-300 active:scale-95 clip-tactical',
    danger: 'bg-bgmi-red/90 hover:bg-bgmi-red text-white border border-rose-400 active:scale-95 clip-tactical',
    outline: 'bg-transparent text-bgmi-gold border border-bgmi-gold/60 hover:bg-bgmi-gold/10 hover:border-bgmi-gold active:scale-95 clip-tactical',
    ghost: 'bg-transparent hover:bg-bgmi-surface text-slate-300 hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {children}
    </button>
  );
}
