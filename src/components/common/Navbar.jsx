'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Crosshair, ArrowUpRight, Activity, ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'MATCHES', href: '/matches' },
    { name: 'TEAMS', href: '/teams' },
    { name: 'STANDINGS', href: '/standings' },
    { name: 'RESULTS', href: '/results' },
    { name: 'MVP', href: '/mvp' },
    { name: 'MEDIA', href: '/media' },
    { name: 'RULES', href: '/rules' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full font-sans border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0B0E14]/95 backdrop-blur-md">
      
      {/* TOP BROADCAST TICKER STRIP */}
      <div className="w-full bg-slate-900 text-white text-[10px] font-mono py-1 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-bgmi-red font-bold uppercase tracking-wider">
            <Activity className="w-3 h-3 animate-pulse" /> LIVE BROADCAST
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300 tracking-widest uppercase">
            NIT COLLEGE ESPORTS CHAMPIONSHIP 2026
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-3 h-3" /> VERIFIED ROSTERS ONLY
          </span>
          <span className="hidden md:inline text-amber-400 font-bold">STAGE: GRAND FINALS</span>
        </div>
      </div>

      {/* MAIN EDITORIAL NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* BRAND IDENTITY */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-bgmi-red text-white flex items-center justify-center font-broadcast font-black text-lg clip-badge shadow-red-glow">
            <Crosshair className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-broadcast font-black text-lg sm:text-xl text-slate-900 dark:text-white uppercase tracking-tight leading-none">
              NIT <span className="text-bgmi-red">BGMI</span>
            </span>
            <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
              CHAMPIONSHIP 2026
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-broadcast font-bold tracking-wider transition-all relative ${
                  active
                    ? 'text-bgmi-red font-black'
                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-bgmi-red shadow-red-glow" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT CONTROLS & CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/register"
            className="px-5 py-2 bg-bgmi-red hover:bg-bgmi-red-hover text-white font-broadcast font-black text-xs uppercase tracking-wider clip-technical-btn shadow-red-glow transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>REGISTER SQUAD</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* MOBILE HAMBURGER TOGGLE */}
        <div className="flex lg:hidden items-center gap-3">
          <ThemeToggle className="scale-90" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-bgmi-red" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE FULLSCREEN NAVIGATION MATRIX */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[90px] bg-white dark:bg-[#0B0E14] z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-4">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">
              TOURNAMENT SECTIONS
            </div>
            <div className="grid grid-cols-1 gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3.5 text-sm font-broadcast font-bold uppercase tracking-wider flex items-center justify-between border transition-all ${
                      active
                        ? 'bg-bgmi-red text-white border-bgmi-red shadow-red-glow'
                        : 'bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-slate-200 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 text-center bg-bgmi-red text-white font-broadcast font-black text-sm uppercase tracking-wider clip-technical-btn shadow-red-glow"
            >
              REGISTER SQUAD →
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
