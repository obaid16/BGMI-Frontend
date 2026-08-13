'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UserCheck,
  Swords,
  Trophy,
  Video,
  Bell,
  BookOpen,
  LogOut,
  Crosshair,
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Registrations', href: '/admin/registrations', icon: ClipboardList },
    { name: 'Squads & Teams', href: '/admin/teams', icon: Users },
    { name: 'Player Rosters', href: '/admin/players', icon: UserCheck },
    { name: 'Match Schedules', href: '/admin/matches', icon: Swords },
    { name: 'Scorecard Entry', href: '/admin/results', icon: Trophy },
    { name: 'Media Approvals', href: '/admin/media', icon: Video },
    { name: 'Announcements', href: '/admin/announcements', icon: Bell },
    { name: 'Rules Manager', href: '/admin/rules', icon: BookOpen },
  ];

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-bgmi-surface/95 dark:bg-bgmi-surface/95 light:bg-white border-r border-bgmi-border dark:border-bgmi-border light:border-slate-200 min-h-screen flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        {/* BRANDING LOGO */}
        <div className="flex items-center justify-between px-2 py-3 border-b border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-bgmi-red rounded-lg p-0.5 clip-tactical flex items-center justify-center text-white font-bold shadow-red-glow">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-sm text-white dark:text-white light:text-slate-900 uppercase tracking-wider">
                TOURNAMENT <span className="text-bgmi-red">ADMIN</span>
              </h2>
              <p className="text-[9px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-extrabold uppercase tracking-widest">NIT Esports Command</p>
            </div>
          </div>
          <ThemeToggle className="scale-90" />
        </div>

        {/* SIDEBAR NAVIGATION LINKS */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? 'bg-bgmi-red/15 text-bgmi-red border border-bgmi-red/40 shadow-red-glow font-black'
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-bgmi-dark/60 dark:hover:bg-bgmi-dark/60 light:hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-bgmi-red' : 'text-slate-400 dark:text-slate-400 light:text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER EXIT LINK */}
      <div className="pt-4 border-t border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-bgmi-red transition-colors"
        >
          <LogOut className="w-4 h-4 text-bgmi-red" /> Public Main Site →
        </Link>
      </div>
    </aside>
  );
}
