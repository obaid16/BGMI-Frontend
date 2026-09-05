'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';
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

  // Don't render public navbar on admin pages or standalone media submit
  if ((pathname.startsWith('/admin') && pathname !== '/admin/login') || pathname === '/media/submit') {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Matches', href: '/matches' },
    { name: 'Teams', href: '/teams' },
    { name: 'Standings', href: '/standings' },
    { name: 'Results', href: '/results' },
    { name: 'MVP', href: '/mvp' },
    { name: 'Media', href: '/media' },
    { name: 'Rules', href: '/rules' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 dark:bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#E7E3DA] dark:border-[#1E2638] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* BRAND IDENTITY */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="h-9 sm:h-11 px-2.5 py-1 bg-white dark:bg-[#121620] rounded-xl border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center shadow-editorial-sm group-hover:border-bgmi-red/50 transition-all group-hover:scale-105">
              <img
                src="/images/nit-logo-icon.png"
                alt="NIT Esports Logo"
                className="h-6 sm:h-8 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col border-l border-[#E7E3DA] dark:border-[#1E2638] pl-3">
              <span className="font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider leading-tight flex items-center gap-1.5">
                BGMI <span className="text-bgmi-red">ESPORTS</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-bgmi-gold dark:text-amber-400 uppercase tracking-widest mt-0.5">
                NEXCORE CHAMPIONSHIP
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
                  className={`px-3 py-1.5 text-xs font-semibold tracking-wide transition-all relative rounded-lg ${
                    active
                      ? 'text-slate-950 dark:text-white font-bold bg-[#F0ECE4]/80 dark:bg-white/10'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-[#F5F2EB]/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute -bottom-2 left-3 right-3 h-[2px] bg-bgmi-red rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT CONTROLS & CTA (AS IN REFERENCE HEADER) */}
          <div className="hidden lg:flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/register"
              className="px-5 py-2 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all active:scale-95"
            >
              <span>Register</span>
            </Link>
          </div>

          {/* MOBILE HAMBURGER TOGGLE */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            <ThemeToggle className="scale-90" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-900 dark:text-white bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl shadow-editorial-sm focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-bgmi-red" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE FULLSCREEN NAVIGATION OVERLAY (OUTSIDE OF BACKDROP BLUR HEADER) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 sm:top-20 z-50 bg-[#FAF8F5] dark:bg-[#0B0E14] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto border-t border-[#E7E3DA] dark:border-[#1E2638] shadow-2xl">
          <div className="space-y-4">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-[#E7E3DA] dark:border-[#1E2638] pb-2 flex items-center justify-between">
              <span>TOURNAMENT SECTIONS</span>
              <span className="text-[9px] text-[#C5A059] font-bold">NAVIGATION</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3.5 text-xs sm:text-sm font-display font-bold uppercase tracking-wider flex items-center justify-between rounded-xl border transition-all ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-bgmi-red dark:border-bgmi-red font-black shadow-editorial'
                        : 'bg-white dark:bg-[#121620] text-slate-900 dark:text-slate-100 border-[#E7E3DA] dark:border-[#1E2638] hover:border-bgmi-gold'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-[#E7E3DA] dark:border-[#1E2638] space-y-2.5 mt-6">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3.5 text-center bg-slate-950 dark:bg-bgmi-red text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-editorial transition-all active:scale-95"
            >
              Register Squad →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
