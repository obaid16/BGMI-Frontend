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
  Award,
  Video,
  Bell,
  BookOpen,
  LogOut,
  Crosshair,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Registrations', href: '/admin/registrations', icon: ClipboardList },
    { name: 'Teams', href: '/admin/teams', icon: Users },
    { name: 'Players', href: '/admin/players', icon: UserCheck },
    { name: 'Matches', href: '/admin/matches', icon: Swords },
    { name: 'Results Entry', href: '/admin/results', icon: Trophy },
    { name: 'Media Queue', href: '/admin/media', icon: Video },
    { name: 'Announcements', href: '/admin/announcements', icon: Bell },
    { name: 'Rules Manager', href: '/admin/rules', icon: BookOpen },
  ];

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-bgmi-surface border-r border-bgmi-border min-h-screen flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        {/* BRANDING LOGO */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-bgmi-border/60">
          <div className="w-9 h-9 bg-bgmi-gold rounded-lg p-0.5 clip-tactical flex items-center justify-center text-slate-950 font-bold shadow-gold-glow">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-sm text-white uppercase tracking-wider">
              TOURNAMENT <span className="text-bgmi-gold">ADMIN</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Control Center 2026</p>
          </div>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? 'bg-bgmi-gold/15 text-bgmi-gold border border-bgmi-gold/40 shadow-gold-glow'
                    : 'text-slate-400 hover:text-white hover:bg-bgmi-dark/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-bgmi-gold' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER EXIT LINK */}
      <div className="pt-4 border-t border-bgmi-border/60">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 text-bgmi-red" /> Exit to Public Platform
        </Link>
      </div>
    </aside>
  );
}
