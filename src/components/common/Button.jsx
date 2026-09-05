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
  const baseStyles = 'group relative inline-flex items-center justify-center font-display font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-7 py-3 sm:py-3.5 text-xs sm:text-sm gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-slate-950 hover:bg-slate-800 dark:bg-bgmi-red dark:hover:bg-bgmi-red-hover text-white shadow-editorial hover:shadow-editorial-lg',
    red: 'bg-bgmi-red hover:bg-bgmi-red-hover text-white shadow-editorial shadow-red-500/20',
    gold: 'bg-bgmi-gold hover:bg-amber-500 text-slate-950 font-black shadow-editorial shadow-amber-500/20',
    secondary: 'bg-white dark:bg-[#181E2C] text-slate-900 dark:text-white border border-[#E7E3DA] dark:border-[#1E2638] hover:border-slate-400 dark:hover:border-slate-600 shadow-editorial-sm',
    cyan: 'bg-slate-900 hover:bg-slate-800 dark:bg-bgmi-red dark:hover:bg-bgmi-red-hover text-white shadow-editorial',
    danger: 'bg-bgmi-red hover:bg-bgmi-red-hover text-white shadow-editorial',
    outline: 'bg-transparent text-slate-800 dark:text-slate-200 border border-[#E7E3DA] dark:border-[#1E2638] hover:border-slate-400 dark:hover:border-white/40',
    'outline-gold': 'bg-transparent text-amber-700 dark:text-bgmi-gold border border-amber-400/60 dark:border-bgmi-gold/60 hover:bg-amber-500/10',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.primary} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />}
      <span>{children}</span>
    </button>
  );
}
