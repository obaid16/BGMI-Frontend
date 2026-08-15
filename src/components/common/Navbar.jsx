'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { Menu, X, Crosshair, ArrowRight } from 'lucide-react';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const headerRef = useRef(null);
  const navContainerRef = useRef(null);

  // GSAP Scroll Transition Effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      setScrolled(isScrolled);
      const isDark = document.documentElement.classList.contains('dark');

      if (navContainerRef.current) {
        if (isScrolled) {
          gsap.to(navContainerRef.current, {
            backgroundColor: isDark ? 'rgba(11, 14, 20, 0.94)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            borderColor: isDark ? 'rgba(30, 38, 56, 0.85)' : 'rgba(226, 232, 240, 0.9)',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            boxShadow: isDark ? '0 10px 30px -10px rgba(0, 0, 0, 0.6)' : '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
            duration: 0.3,
            ease: 'power2.out',
          });
        } else {
          gsap.to(navContainerRef.current, {
            backgroundColor: isDark ? 'rgba(11, 14, 20, 0.45)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.6)',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [theme]);

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
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 w-full">
      <div
        ref={navContainerRef}
        className="w-full border-b transition-colors duration-300 bg-white/85 dark:bg-[#0B0E14]/45 backdrop-blur-md border-slate-200/80 dark:border-white/10 py-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* LEFT: BRANDING LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 dark:bg-[#121620] border border-slate-300 dark:border-slate-700/60 rounded p-0.5 clip-badge group-hover:border-bgmi-red transition-colors flex-shrink-0">
                <div className="w-full h-full bg-white dark:bg-[#0B0E14] flex items-center justify-center">
                  <Crosshair className="w-5 h-5 text-bgmi-red group-hover:rotate-90 transition-transform duration-500" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-broadcast font-black text-base sm:text-lg tracking-wider text-slate-900 dark:text-white uppercase leading-none">
                  <span>NIT</span>
                  <span className="text-bgmi-red">BGMI</span>
                </div>
                <p className="text-[9px] tracking-[0.22em] text-slate-600 dark:text-slate-400 font-mono font-bold uppercase mt-1">
                  ESPORTS CHAMPIONSHIP
                </p>
              </div>
            </Link>

            {/* CENTER: DESKTOP OPEN-SPACED NAVIGATION LINKS */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative py-1 text-xs sm:text-sm font-broadcast font-bold uppercase tracking-wider transition-colors duration-200 ${
                      active
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-bgmi-red rounded-full shadow-red-glow animate-in fade-in zoom-in-75 duration-200" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT: THEME TOGGLE & CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle />
              <Link href="/register">
                <Button variant="primary" size="sm" className="px-5 py-2 text-xs font-black">
                  <span>REGISTER YOUR SQUAD</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* MOBILE HAMBURGER TOGGLE */}
            <div className="flex lg:hidden items-center gap-3">
              <ThemeToggle className="scale-90" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/60 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-bgmi-red" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE FULLSCREEN OVERLAY MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] bg-white/98 dark:bg-[#0B0E14]/98 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 p-6 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2 mb-2">
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
                      : 'bg-slate-100 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-bgmi-red/40'
                  }`}
                >
                  <span>{link.name}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-white shadow-red-glow" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">Theme Mode</span>
              <ThemeToggle />
            </div>

            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="primary" size="lg" className="w-full text-xs font-black">
                <span>REGISTER YOUR SQUAD →</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}



