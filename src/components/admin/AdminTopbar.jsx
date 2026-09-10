'use client';

import React from 'react';

export default function AdminTopbar({ title = 'Overview' }) {
  return (
    <header className="h-20 bg-premium-background/80 backdrop-blur-xl border-b border-premium-border px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-2xl text-premium-text tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Live Admin Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-700 tracking-widest uppercase shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Online
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-premium-border">
          <div className="w-10 h-10 rounded-[14px] bg-premium-surface border border-premium-border flex items-center justify-center text-premium-text-secondary font-bold text-sm shadow-sm">
            AD
          </div>
          <div className="hidden md:block">
            <p className="font-bold text-premium-text text-sm leading-tight">Head Admin</p>
            <p className="text-[11px] text-premium-text-secondary font-medium">Tournament Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
