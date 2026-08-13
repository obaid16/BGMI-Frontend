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
  const baseStyles = 'inline-flex items-center justify-center font-display font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-7 py-3.5 text-sm gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-bgmi-red hover:bg-bgmi-red-hover text-white font-black shadow-red-glow hover:shadow-xl active:scale-[0.98] border border-rose-400/30 clip-tactical',
    gold: 'bg-bgmi-gold hover:bg-bgmi-gold-hover text-slate-950 font-black shadow-gold-glow hover:shadow-xl active:scale-[0.98] border border-amber-300 clip-tactical',
    secondary: 'bg-bgmi-surface hover:bg-bgmi-card text-white border border-bgmi-border hover:border-bgmi-red/50 clip-tactical active:scale-[0.98]',
    cyan: 'bg-bgmi-cyan text-slate-950 font-black shadow-cyan-glow hover:bg-cyan-300 active:scale-[0.98] clip-tactical',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-400 active:scale-[0.98] clip-tactical',
    outline: 'bg-transparent text-bgmi-red border border-bgmi-red/60 hover:bg-bgmi-red/10 hover:border-bgmi-red active:scale-[0.98] clip-tactical',
    'outline-gold': 'bg-transparent text-bgmi-gold border border-bgmi-gold/60 hover:bg-bgmi-gold/10 hover:border-bgmi-gold active:scale-[0.98] clip-tactical',
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

