'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Crosshair, Trophy, Shield, Radio } from 'lucide-react';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'Home', href: '/' },
    { name: 'Teams', href: '/teams' },
    { name: 'Matches', href: '/matches' },
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      
      {/* 1. TOP BROADCAST ALERT TICKER BAR */}
      <div className="bg-slate-900 dark:bg-bgmi-dark/95 text-slate-300 text-[10px] sm:text-xs py-1.5 px-4 border-b border-slate-800 dark:border-bgmi-border/60 flex items-center justify-between font-mono">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-bgmi-red/20 text-bgmi-red font-black rounded border border-bgmi-red/40 shrink-0 uppercase tracking-widest">
            <Radio className="w-3 h-3 animate-spin" /> LIVE BROADCAST
          </span>
          <span className="truncate font-bold text-white uppercase tracking-wider">
            NEXT LOBBY: MATCH #4 (ERANGEL) • ROOM CREDS DROP 15M PRIOR • ANTI-CHEAT ENABLED
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Shield className="w-3 h-3" /> VERIFIED CAMPUS EVENT
          </span>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-bgmi-dark/95 backdrop-blur-xl border-b border-slate-200 dark:border-bgmi-border/80 shadow-lg dark:shadow-2xl py-2.5'
            : 'bg-white/90 dark:bg-gradient-to-b dark:from-bgmi-dark/90 dark:via-bgmi-dark/40 dark:to-transparent backdrop-blur-md dark:backdrop-blur-none border-b border-slate-200 dark:border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* BRANDING LOGO WITH TACTICAL FRAME */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-bgmi-red via-rose-600 to-amber-500 rounded-xl p-0.5 clip-tactical group-hover:scale-105 transition-transform shadow-red-glow">
                <div className="w-full h-full bg-white dark:bg-bgmi-dark rounded-[7px] flex items-center justify-center">
                  <Crosshair className="w-5 h-5 text-bgmi-red group-hover:rotate-90 transition-transform duration-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-display font-black text-lg tracking-wider text-slate-900 dark:text-white uppercase leading-none">
                  <span>NIT</span>
                  <span className="text-bgmi-red">BGMI</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-bgmi-red/20 text-bgmi-red font-bold rounded border border-bgmi-red/30">2026</span>
                </div>
                <p className="text-[9px] tracking-[0.2em] text-slate-600 dark:text-slate-400 font-bold uppercase mt-0.5">
                  ESPORTS CHAMPIONSHIP
                </p>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION PILLS */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-bgmi-surface/80 p-1.5 rounded-2xl border border-slate-200 dark:border-bgmi-border/60">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-bgmi-red text-white shadow-red-glow'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-bgmi-dark/40'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <Link href="/register">
                <Button variant="primary" size="sm" icon={Trophy} className="px-5 py-2 text-xs font-black shadow-red-glow">
                  REGISTER SQUAD
                </Button>
              </Link>
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle className="scale-90" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-bgmi-surface text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-bgmi-border focus:outline-none"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-bgmi-red" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE FULLSCREEN OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[90px] bg-slate-50/98 dark:bg-bgmi-dark/98 backdrop-blur-2xl border-b border-slate-200 dark:border-bgmi-border p-6 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-2">
              Championship Navigation
            </div>
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-black uppercase tracking-wider rounded-xl border transition-all flex items-center justify-between ${
                    active
                      ? 'bg-bgmi-red text-white border-bgmi-red shadow-red-glow'
                      : 'bg-white dark:bg-bgmi-surface/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-bgmi-border hover:text-bgmi-red'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && <span className="w-2.5 h-2.5 rounded-full bg-white shadow-md" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-bgmi-border/60 mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-bgmi-surface/60 border border-slate-200 dark:border-bgmi-border rounded-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Theme Mode</span>
              <ThemeToggle />
            </div>

            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="primary" size="lg" icon={Trophy} className="w-full text-xs font-black">
                REGISTER YOUR SQUAD NOW
              </Button>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
