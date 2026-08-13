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
  const baseStyles = 'group relative inline-flex items-center justify-center font-broadcast font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none clip-broadcast-btn';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-2',
    md: 'px-6 py-3 text-xs gap-2.5',
    lg: 'px-8 py-3.5 sm:py-4 text-xs sm:text-sm gap-3',
  };

  const variantStyles = {
    primary: 'bg-bgmi-red hover:bg-bgmi-red-hover text-white font-black border border-red-500/40 shadow-lg hover:border-red-400/80 active:scale-[0.98]',
    gold: 'bg-bgmi-gold hover:bg-amber-500 text-slate-950 font-black border border-amber-300 active:scale-[0.98]',
    secondary: 'bg-slate-900/90 hover:bg-slate-800/90 text-white border border-slate-700/80 hover:border-slate-500 active:scale-[0.98]',
    cyan: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-black border border-sky-300 active:scale-[0.98]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500 active:scale-[0.98]',
    outline: 'bg-transparent text-slate-200 border border-slate-700 hover:border-bgmi-red hover:text-white hover:bg-bgmi-red/10 active:scale-[0.98]',
    'outline-gold': 'bg-transparent text-bgmi-gold border border-bgmi-gold/60 hover:bg-bgmi-gold/10 hover:border-bgmi-gold active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />}
      <span>{children}</span>
    </button>
  );
}


