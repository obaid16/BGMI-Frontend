'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

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
    { name: 'Home', href: '/' },
    { name: 'Matches', href: '/matches' },
    { name: 'Teams', href: '/teams' },
    { name: 'Rules', href: '/rules' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
    <header className="sticky top-0 z-30 w-full bg-premium-background/80 backdrop-blur-xl border-b border-premium-border transition-all">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* BRAND IDENTITY */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="h-10 w-10 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src="/images/bgmi-portal-logo.png"
              alt="BGMI Portal"
              className="h-10 w-10 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-premium-text text-sm tracking-tight leading-tight">
              BGMI Portal
            </span>
            <span className="text-[10px] text-premium-text-secondary uppercase tracking-wider font-medium">
              NIT Championship
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 justify-center flex-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${
                  active
                    ? 'bg-premium-sage-soft text-premium-text'
                    : 'text-premium-text-secondary hover:text-premium-text hover:bg-premium-surface-soft'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT CONTROLS & CTA */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <Link
            href="/register"
            className="px-5 py-2.5 bg-premium-text hover:bg-black text-white text-sm font-medium rounded-full shadow-premium-soft transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
          >
            <span>Register Squad</span>
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </Link>
        </div>

        {/* MOBILE HAMBURGER TOGGLE */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-premium-text bg-premium-surface border border-premium-border rounded-xl focus:outline-none shadow-sm"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </header>

      {/* MOBILE NAVIGATION — rendered outside header to avoid z-index stacking issues */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-premium-background z-[999] p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="text-[11px] text-premium-text-secondary uppercase tracking-widest border-b border-premium-border pb-3 font-semibold">
              Menu
            </div>
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-4 text-base font-medium rounded-2xl flex items-center justify-between transition-all ${
                      active
                        ? 'bg-premium-sage-soft text-premium-text'
                        : 'bg-transparent text-premium-text hover:bg-premium-surface-soft'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-8 mt-auto">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex justify-center items-center w-full py-4 bg-premium-text text-white font-medium text-base rounded-2xl shadow-premium-float"
            >
              Register Squad
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
