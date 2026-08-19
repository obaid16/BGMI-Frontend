'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Crosshair, ArrowUpRight } from 'lucide-react';
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

  if ((pathname.startsWith('/admin') && pathname !== '/admin/login') || pathname === '/media/submit') {
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
    <header className={`sticky top-0 w-full bg-white/95 dark:bg-[#0B0E14]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm transition-all ${mobileMenuOpen ? 'z-[90]' : 'z-30'}`}>
      {/* MAIN EDITORIAL NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* BRAND IDENTITY */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="h-9 sm:h-11 px-2 sm:px-2.5 py-1 bg-white rounded-lg border border-slate-200 dark:border-white/30 flex items-center justify-center shadow-md group-hover:border-bgmi-red transition-all group-hover:scale-105">
            <img
              src="/images/nit-logo-icon.png"
              alt="NIT Esports Logo"
              className="h-7 sm:h-9 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col border-l border-slate-300 dark:border-white/15 pl-2 sm:pl-3">
            <span className="font-broadcast font-black text-[10px] sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider leading-tight">
              BGMI <span className="text-bgmi-red">CHAMPIONSHIP</span>
            </span>
            <span className="text-[7px] sm:text-[9px] font-mono font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest mt-0.5">
              OFFICIAL 2026
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
                className={`px-3 py-2 text-xs font-broadcast font-bold tracking-wider transition-all relative whitespace-nowrap ${
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
            className="px-5 py-2.5 bg-bgmi-red hover:bg-bgmi-red-hover text-white font-broadcast font-black text-xs uppercase tracking-wider clip-technical-btn shadow-red-glow transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span>REGISTER SQUAD</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* MOBILE HAMBURGER TOGGLE */}
        <div className="flex lg:hidden items-center gap-2 sm:gap-3">
          <ThemeToggle className="scale-90" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-bgmi-red" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE FULLSCREEN NAVIGATION MATRIX */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-white dark:bg-[#0B0E14] z-[90] p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 border-t border-slate-200 dark:border-white/10 shadow-2xl">
          <div className="space-y-4">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-white/10 pb-2 flex items-center justify-between">
              <span>TOURNAMENT SECTIONS</span>
              <span className="text-[9px] text-bgmi-red font-bold">NAV MATRIX</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3.5 text-xs sm:text-sm font-broadcast font-bold uppercase tracking-wider flex items-center justify-between rounded-xl border transition-all ${
                      active
                        ? 'bg-bgmi-red text-white border-bgmi-red shadow-red-glow font-black'
                        : 'bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-white/10 hover:border-bgmi-red/50'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-3 mt-6">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3.5 text-center bg-bgmi-red hover:bg-bgmi-red-hover text-white font-broadcast font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-red-glow transition-all active:scale-95"
            >
              REGISTER SQUAD →
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
