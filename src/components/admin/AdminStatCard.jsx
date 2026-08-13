'use client';

import React from 'react';

export default function AdminStatCard({ title, value, subtext, icon: Icon, color = 'gold' }) {
  const colorStyles = {
    gold: 'border-amber-500/30 text-bgmi-gold bg-amber-500/10',
    cyan: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
    green: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    red: 'border-bgmi-red/30 text-bgmi-red bg-bgmi-red/10',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  };

  return (
    <div className="p-5 bg-[#12141c] dark:bg-[#12141c] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 rounded-lg clip-tactical flex items-center justify-between shadow-lg">
      <div className="space-y-1">
        <p className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">{title}</p>
        <p className="font-broadcast font-bold text-3xl text-white dark:text-white light:text-slate-900">{value}</p>
        {subtext && <p className="text-[10px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">{subtext}</p>}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded border flex items-center justify-center p-2 clip-tactical ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

