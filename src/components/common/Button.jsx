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
  const baseStyles = 'group relative inline-flex items-center justify-center font-broadcast font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none clip-technical-btn hover:-translate-y-0.5 active:translate-y-0';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-2',
    md: 'px-6 py-3 text-xs gap-2.5',
    lg: 'px-8 py-3.5 sm:py-4 text-xs sm:text-sm gap-3',
  };

  const variantStyles = {
    primary: 'bg-bgmi-red hover:bg-bgmi-red-hover text-white font-black border border-red-500/50 shadow-md hover:border-red-400 shadow-red-glow/30',
    gold: 'bg-bgmi-gold hover:bg-amber-500 text-slate-950 font-black border border-amber-300 shadow-gold-glow/30',
    secondary: 'bg-slate-100 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/90',
    cyan: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-black border border-sky-300',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500',
    outline: 'bg-transparent text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-bgmi-red hover:text-white dark:hover:text-white hover:bg-bgmi-red/10',
    'outline-gold': 'bg-transparent text-amber-600 dark:text-bgmi-gold border border-amber-500/60 dark:border-bgmi-gold/60 hover:bg-bgmi-gold/10 hover:border-bgmi-gold',
    ghost: 'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
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



