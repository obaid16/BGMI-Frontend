'use client';

import React from 'react';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminTopbar({ title = 'Tournament Control Center' }) {
  return (
    <header className="h-16 bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-white backdrop-blur-md border-b border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="font-display font-black text-lg text-white dark:text-white light:text-slate-900 uppercase tracking-wide">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle className="scale-90" />

        {/* Live Admin Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-bgmi-dark dark:bg-bgmi-dark light:bg-slate-100 border border-bgmi-red/40 rounded-full text-[10px] text-bgmi-red font-black tracking-widest uppercase shadow-red-glow">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          COMMAND SYSTEM ONLINE
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-bgmi-red/20 border border-bgmi-red flex items-center justify-center text-bgmi-red font-black text-xs">
            AD
          </div>
          <div className="hidden md:block text-xs">
            <p className="font-bold text-white dark:text-white light:text-slate-900 leading-tight">Head Admin</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium">Chief Tournament Referee</p>
          </div>
        </div>
      </div>
    </header>
  );
}
