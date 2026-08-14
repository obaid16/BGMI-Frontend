'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Crosshair, Trophy, Shield, Radio, ArrowRight } from 'lucide-react';
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
      


      {/* 2. MAIN NAVIGATION BAR */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0b0e]/95 dark:bg-[#0a0b0e]/95 light:bg-white/95 backdrop-blur-xl border-b border-white/10 dark:border-white/10 light:border-slate-200 shadow-2xl py-3'
            : 'bg-[#0a0b0e]/80 dark:bg-[#0a0b0e]/80 light:bg-white/90 backdrop-blur-md border-b border-white/10 dark:border-white/10 light:border-slate-200 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* BRANDING LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 border border-white/15 rounded p-0.5 clip-tactical group-hover:border-bgmi-red/60 transition-colors flex-shrink-0">
                <div className="w-full h-full bg-[#0a0b0e] flex items-center justify-center">
                  <Crosshair className="w-5 h-5 text-bgmi-red group-hover:rotate-90 transition-transform duration-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-broadcast font-bold text-base sm:text-lg tracking-wider text-white dark:text-white light:text-slate-900 uppercase leading-none">
                  <span>NIT</span>
                  <span className="text-bgmi-red">BGMI</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-bgmi-red/10 text-bgmi-red font-mono font-bold rounded border border-bgmi-red/30">2026</span>
                </div>
                <p className="text-[9px] tracking-[0.2em] text-slate-300 dark:text-slate-300 light:text-slate-600 font-broadcast font-bold uppercase mt-1">
                  ESPORTS CHAMPIONSHIP
                </p>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION LINKS */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 p-1.5 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200 backdrop-blur-md">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-1.5 text-xs font-broadcast font-bold uppercase tracking-wider rounded transition-all duration-200 ${
                      active
                        ? 'bg-bgmi-red text-white shadow-md'
                        : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-200'
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
                <Button variant="primary" size="sm" className="px-5 py-2 text-xs font-black">
                  <span>REGISTER SQUAD</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>


            {/* MOBILE HAMBURGER BUTTON */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle className="scale-90" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded bg-slate-900 text-slate-200 border border-white/15 focus:outline-none"
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
        <div className="lg:hidden fixed inset-0 top-[88px] bg-[#0a0b0e]/98 backdrop-blur-2xl border-b border-white/10 p-6 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 mb-2">
              TOURNAMENT NAVIGATION
            </div>
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-broadcast font-bold uppercase tracking-wider rounded border transition-all flex items-center justify-between ${
                    active
                      ? 'bg-bgmi-red text-white border-bgmi-red shadow-md'
                      : 'bg-slate-900/80 text-slate-200 border-white/10 hover:text-white hover:border-bgmi-red/50'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-white" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-white/10 rounded">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Theme Mode</span>
              <ThemeToggle />
            </div>

            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="primary" size="lg" className="w-full text-xs font-black">
                <span>REGISTER YOUR SQUAD NOW</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}

