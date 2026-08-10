'use client';

import React from 'react';
import { Search, Bell, Shield, User } from 'lucide-react';

export default function AdminTopbar({ title = 'Tournament Control Center' }) {
  return (
    <header className="h-16 bg-bgmi-surface/90 backdrop-blur-md border-b border-bgmi-border/60 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="font-display font-black text-lg text-white uppercase tracking-wide">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Admin Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-bgmi-dark border border-bgmi-gold/40 rounded-full text-xs text-bgmi-gold font-bold">
          <span className="w-2 h-2 rounded-full bg-bgmi-green animate-ping"></span>
          ADMIN SYSTEM ONLINE
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-bgmi-border/60">
          <div className="w-8 h-8 rounded-lg bg-bgmi-gold/20 border border-bgmi-gold flex items-center justify-center text-bgmi-gold font-black text-xs">
            AD
          </div>
          <div className="hidden md:block text-xs">
            <p className="font-bold text-white leading-tight">Tournament Admin</p>
            <p className="text-[10px] text-slate-400">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
