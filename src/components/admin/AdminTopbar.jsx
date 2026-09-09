'use client';

import React, { useState, useEffect } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import { getStoredAdminUser, logoutAdmin } from '@/services/api';
import { LogOut, ShieldCheck, Shield } from 'lucide-react';

export default function AdminTopbar({ title = 'Tournament Control Center' }) {
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const user = getStoredAdminUser();
    if (user) {
      setAdminUser(user);
    }
  }, []);

  const initials = adminUser?.name
    ? adminUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD';

  const roleLabel = adminUser?.role === 'SUPER_ADMIN' 
    ? 'Director' 
    : adminUser?.role === 'ADMIN'
    ? 'Referee'
    : 'Admin';

  return (
    <header className="h-16 bg-white dark:bg-[#12141c]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <h1 className="font-broadcast font-bold text-lg text-slate-900 dark:text-white uppercase tracking-wide">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle className="scale-90" />

        {/* Live Admin Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/10 rounded text-[10px] font-mono text-bgmi-red font-bold tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping"></span>
          COMMAND ONLINE
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
          <div className="w-8 h-8 rounded bg-bgmi-red/10 dark:bg-bgmi-red/20 border border-bgmi-red/30 dark:border-bgmi-red/40 flex items-center justify-center text-bgmi-red font-mono font-bold text-xs">
            {initials}
          </div>
          <div className="hidden md:block text-xs font-mono">
            <p className="font-bold text-slate-900 dark:text-white leading-tight">
              {adminUser?.name || 'Tournament Admin'}
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" />
              {roleLabel} ({adminUser?.email || 'admin@bgmi.esports'})
            </p>
          </div>

          {/* Logout Action */}
          <button
            onClick={() => {
              if (window.confirm('Sign out from tournament console?')) {
                logoutAdmin();
              }
            }}
            title="Sign Out"
            className="p-1.5 ml-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

