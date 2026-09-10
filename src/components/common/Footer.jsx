'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-premium-surface border-t border-premium-border pt-16 pb-10 text-premium-text-secondary transition-all">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-premium-border">
          
          {/* COL 1: BRAND */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-12 w-12 bg-white rounded-xl border border-premium-border flex items-center justify-center shadow-premium-soft">
                <img
                  src="/images/nit-logo-icon.png"
                  alt="NIT Esports"
                  className="h-7 w-auto object-contain opacity-80"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-premium-text text-lg tracking-tight leading-none mb-1">
                  BGMI Portal
                </span>
                <span className="text-[11px] font-medium text-premium-text-secondary uppercase tracking-widest">
                  NIT Championship 2026
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Official NIT BGMI Esports Championship 2026 organized by Nexcore Institute of Technology. A premium platform for campus squads to compete and claim ultimate victory.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-premium-text bg-premium-surface-soft px-3 py-1.5 rounded-full border border-premium-border">
                <Award className="w-4 h-4 text-premium-sage" /> Nexcore Campus Event
              </span>
            </div>
          </div>

          {/* COL 2: QUICK LINKS */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-premium-text">Tournament</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/teams" className="hover:text-premium-text transition-colors">Participating Squads</Link></li>
              <li><Link href="/matches?tab=schedule" className="hover:text-premium-text transition-colors">Match Schedule & Lobbies</Link></li>
              <li><Link href="/matches?tab=standings" className="hover:text-premium-text transition-colors">Leaderboard Standings</Link></li>
              <li><Link href="/matches?tab=results" className="hover:text-premium-text transition-colors">Verified Results</Link></li>
              <li><Link href="/matches?tab=mvp" className="hover:text-premium-text transition-colors">MVP & Top Fraggers</Link></li>
            </ul>
          </div>

          {/* COL 3: REGISTRATION & MEDIA */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-premium-text">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/register" className="text-premium-text font-medium hover:text-black transition-colors">Register Squad</Link></li>
              <li><Link href="/media" className="hover:text-premium-text transition-colors">Media Gallery</Link></li>
              <li><Link href="/rules" className="hover:text-premium-text transition-colors">Official Rulebook</Link></li>
            </ul>
          </div>

          {/* COL 4: SUPPORT & COMMUNITY */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-premium-text">Community Lobbies</h4>
            <p className="text-sm">Join the official WhatsApp lobby for instant room credentials and schedule updates.</p>
            <div className="pt-2">
              <a
                href="https://chat.whatsapp.com/E8vPQ1JZOPV4BNPF9FPLKG?s=cl&p=a&ilr=4"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-premium-sage-soft text-premium-text border border-transparent hover:border-premium-sage/30 rounded-xl text-sm font-medium transition-all w-full sm:w-auto shadow-sm"
              >
                <span>Join WhatsApp Group</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Nexcore Institute of Technology — NIT BGMI Esports Championship. All Rights Reserved.</p>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/rules" className="hover:text-premium-text transition-colors">Rules & Code of Conduct</Link>
            <span className="hover:text-premium-text transition-colors cursor-pointer">Anti-Cheat Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
