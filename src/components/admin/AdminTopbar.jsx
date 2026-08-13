'use client';

import React from 'react';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminTopbar({ title = 'Tournament Control Center' }) {
  return (
    <header className="h-16 bg-[#12141c]/90 dark:bg-[#12141c]/90 light:bg-white backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="font-broadcast font-bold text-lg text-white dark:text-white light:text-slate-900 uppercase tracking-wide">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle className="scale-90" />

        {/* Live Admin Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-950/80 border border-white/10 rounded text-[10px] font-mono text-bgmi-red font-bold tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          COMMAND SYSTEM ONLINE
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10 dark:border-white/10 light:border-slate-200">
          <div className="w-8 h-8 rounded bg-bgmi-red/20 border border-bgmi-red/40 flex items-center justify-center text-bgmi-red font-mono font-bold text-xs">
            AD
          </div>
          <div className="hidden md:block text-xs font-mono">
            <p className="font-bold text-white dark:text-white light:text-slate-900 leading-tight">Head Admin</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600">Chief Referee</p>
          </div>
        </div>
      </div>
    </header>
  );
}

