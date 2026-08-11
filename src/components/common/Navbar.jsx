'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, Crosshair, UserCheck, Trophy } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in admin layout, don't show public navbar
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
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-bgmi-dark/90 backdrop-blur-md border-b border-bgmi-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* BRANDING LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-bgmi-gold via-amber-500 to-orange-600 rounded-lg p-0.5 clip-tactical group-hover:scale-105 transition-transform shadow-gold-glow">
              <div className="w-full h-full bg-bgmi-dark rounded-[5px] flex items-center justify-center">
                <Crosshair className="w-6 h-6 text-bgmi-gold group-hover:rotate-90 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display font-black text-lg tracking-wider text-white uppercase leading-none">
                <span>BGMI</span>
                <span className="text-bgmi-gold">ESPORTS</span>
                <span className="text-xs px-1.5 py-0.5 bg-bgmi-gold/20 text-bgmi-gold rounded border border-bgmi-gold/30">2026</span>
              </div>
              <p className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase mt-0.5">
                NIT CHAMPIONSHIP
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 relative group ${
                    active ? 'text-bgmi-gold font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {active ? (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-bgmi-gold shadow-gold-glow"></span>
                  ) : (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-transparent group-hover:bg-bgmi-border transition-all"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/register">
              <Button variant="primary" size="sm" icon={Trophy}>
                Register Team
              </Button>
            </Link>
          </div>

          {/* MOBILE HAMBURGER TOGGLE */}
          <div className="flex lg:hidden items-center gap-2">
            <Link href="/register">
              <Button variant="primary" size="sm">
                Register
              </Button>
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-bgmi-surface text-slate-300 hover:text-white border border-bgmi-border focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-bgmi-gold" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE ANIMATED MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-bgmi-dark/95 backdrop-blur-xl border-b border-bgmi-border p-6 shadow-2xl animate-in slide-in-from-top-5 duration-200 z-40">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-lg border transition-all ${
                    active
                      ? 'bg-bgmi-gold/15 text-bgmi-gold border-bgmi-gold/40 shadow-gold-glow'
                      : 'bg-bgmi-surface/60 text-slate-300 border-bgmi-border/40 hover:border-bgmi-border hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}


          </div>
        </div>
      )}
    </header>
  );
}
