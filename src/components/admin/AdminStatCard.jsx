'use client';

import React from 'react';

export default function AdminStatCard({ title, value, subtext, icon: Icon, color = 'gold' }) {
  const colorStyles = {
    gold: 'border-amber-200 text-amber-700 bg-amber-50',
    cyan: 'border-sky-200 text-sky-700 bg-sky-50',
    green: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    red: 'border-rose-200 text-rose-700 bg-rose-50',
    amber: 'border-orange-200 text-orange-700 bg-orange-50',
  };

  return (
    <div className="p-6 bg-premium-surface border border-premium-border rounded-[20px] flex items-center justify-between shadow-sm transition-all hover:shadow-md hover:border-premium-text/20">
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest">{title}</p>
        <p className="font-bold text-3xl text-premium-text tracking-tight">{value}</p>
        {subtext && <p className="text-[11px] font-medium text-premium-text-secondary">{subtext}</p>}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-[14px] border flex items-center justify-center p-2.5 ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
