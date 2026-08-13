'use client';

import React from 'react';

export default function AdminStatCard({ title, value, subtext, icon: Icon, color = 'gold' }) {
  const colorStyles = {
    gold: 'border-bgmi-gold/40 text-bgmi-gold dark:text-bgmi-gold light:text-amber-600 bg-bgmi-gold/10 shadow-gold-glow',
    cyan: 'border-bgmi-cyan/40 text-bgmi-cyan dark:text-bgmi-cyan light:text-sky-600 bg-bgmi-cyan/10 shadow-cyan-glow',
    green: 'border-emerald-500/40 text-emerald-400 dark:text-emerald-400 light:text-emerald-600 bg-emerald-500/10',
    red: 'border-bgmi-red/40 text-bgmi-red bg-bgmi-red/10 shadow-red-glow',
    amber: 'border-amber-500/40 text-amber-400 dark:text-amber-400 light:text-amber-600 bg-amber-500/10',
  };

  return (
    <div className="p-5 bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-white border border-bgmi-border dark:border-bgmi-border light:border-slate-200 rounded-xl clip-tactical flex items-center justify-between shadow-lg">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">{title}</p>
        <p className="font-display font-black text-3xl text-white dark:text-white light:text-slate-900">{value}</p>
        {subtext && <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600">{subtext}</p>}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center p-2 clip-tactical ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
