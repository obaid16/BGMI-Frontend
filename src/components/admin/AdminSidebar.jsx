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
  Shield,
  Crown,
  X,
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { logoutAdmin } from '@/services/api';

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Registrations', href: '/admin/registrations', icon: ClipboardList },
    { name: 'Tournaments & Teams', href: '/admin/teams', icon: Users },
    { name: 'Participants & Rosters', href: '/admin/players', icon: UserCheck },
    { name: 'Matches', href: '/admin/matches', icon: Swords },
    { name: 'Results', href: '/admin/results', icon: Trophy },
    { name: 'Announcements', href: '/admin/announcements', icon: Bell },
    { name: 'Media Moderation', href: '/admin/media', icon: Video },
    { name: 'Rules', href: '/admin/rules', icon: BookOpen },
  ];

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const [adminUser, setAdminUser] = React.useState(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('bgmi_esports_admin_user');
      if (stored) {
        setAdminUser(JSON.parse(stored));
      }
    } catch (_) {}
  }, []);

  const adminName = adminUser?.name || adminUser?.username || 'Tournament Director';
  const adminRole = adminUser?.role || 'Administrator';
  const initials = adminName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <aside className="w-64 bg-[#0B0E14] text-white border-r border-[#1E2638] min-h-screen flex flex-col justify-between p-4 flex-shrink-0 font-sans select-none">
      <div className="space-y-5">
        
        {/* BRANDING HEADER */}
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <Link href="/admin" onClick={() => onClose?.()} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#181E2C] border border-[#2C364F] flex items-center justify-center text-[#C5A059]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-display font-extrabold text-base tracking-tight text-white uppercase">
              BGMI Esports
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle className="scale-85" />
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
                aria-label="Close Sidebar"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            )}
          </div>
        </div>

        {/* AUTHENTIC USER PROFILE BADGE */}
        <div className="flex items-center gap-3 p-3 bg-[#121620] border border-[#1E2638] rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-[#181E2C] border border-[#2C364F] flex items-center justify-center font-display font-bold text-xs text-[#C5A059]">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="font-display font-bold text-xs text-white truncate">
              {adminName}
            </p>
            <p className="text-[10px] text-slate-400 font-mono uppercase">
              {adminRole}
            </p>
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
                onClick={() => onClose?.()}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                  active
                    ? 'bg-[#FAF8F5] text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* BOTTOM BANNER CARD (AS IN REFERENCE) */}
      <div className="space-y-3 pt-4 border-t border-[#1E2638]">
        <div className="p-3.5 bg-[#121620] border border-[#1E2638] rounded-2xl space-y-1 flex items-center justify-between">
          <div>
            <p className="font-display font-black text-xs text-white uppercase tracking-wider">
              Manage. Organize. Grow.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">BGMI Esports</p>
          </div>
          <Crown className="w-5 h-5 text-amber-400 shrink-0" />
        </div>

        <div className="space-y-1">
          <Link
            href="/"
            onClick={() => onClose?.()}
            className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium rounded-lg hover:bg-white/5"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Exit to Public Site</span>
          </Link>
          <button
            onClick={() => {
              if (window.confirm('Sign out from tournament console?')) {
                onClose?.();
                logoutAdmin();
              }
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-400 hover:text-red-300 transition-colors font-medium rounded-lg hover:bg-red-500/10 text-left"
          >
            <LogOut className="w-3.5 h-3.5 text-[#E5383B]" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>

    </aside>
  );
}
