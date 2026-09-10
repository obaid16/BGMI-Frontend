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
  Target
} from 'lucide-react';

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
    <aside className="w-[280px] bg-[#111215] border-r border-[#1f2127] min-h-screen flex flex-col justify-between p-5 flex-shrink-0">
      <div className="space-y-8">
        {/* BRANDING LOGO */}
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 bg-[#1c1e24] border border-[#2b2d35] rounded-xl flex items-center justify-center text-white shadow-sm">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white tracking-tight">
              Championship Admin
            </h2>
            <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest mt-0.5">
              Control Center
            </p>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION LINKS */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-[12px] text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-white text-[#111215] shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-[#1c1e24]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#111215]' : 'text-white/50'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER EXIT LINK */}
      <div className="pt-5 border-t border-[#1f2127]">
        <Link
          href="/"
          className="flex items-center justify-between px-4 py-3 text-xs font-medium text-white/50 hover:text-white hover:bg-[#1c1e24] rounded-[12px] transition-all"
        >
          <span className="flex items-center gap-3">
            <LogOut className="w-4 h-4" /> Exit Admin
          </span>
        </Link>
      </div>
    </aside>
  );
}
