'use client';

import React from 'react';
import Link from 'next/link';
import { Crosshair, Shield, Award, ExternalLink, Flame } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-100 dark:bg-bgmi-surface/90 border-t border-slate-200 dark:border-bgmi-border/80 pt-16 pb-10 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-bgmi-border/60">
          
          {/* COL 1: BRAND */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-bgmi-red rounded-lg p-0.5 clip-tactical flex items-center justify-center text-white font-black shadow-red-glow">
                <Crosshair className="w-5 h-5" />
              </div>
              <span className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-wider">
                NIT <span className="text-bgmi-red">BGMI</span> CHAMPIONSHIP
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Official NIT BGMI Esports Championship 2026. An exclusive tournament platform for college squads to compete, survive, and claim ultimate victory.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-bgmi-red bg-bgmi-red/10 px-2.5 py-1 rounded border border-bgmi-red/30">
                <Shield className="w-3.5 h-3.5" /> Anti-Cheat Verified
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-bgmi-gold bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                <Award className="w-3.5 h-3.5" /> Official Campus Event
              </span>
            </div>
          </div>

          {/* COL 2: QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white">Tournament</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/teams" className="hover:text-bgmi-red transition-colors">College Squads</Link></li>
              <li><Link href="/matches" className="hover:text-bgmi-red transition-colors">Match Schedule & Lobbies</Link></li>
              <li><Link href="/standings" className="hover:text-bgmi-red transition-colors">Leaderboard Standings</Link></li>
              <li><Link href="/results" className="hover:text-bgmi-red transition-colors">Verified Results</Link></li>
              <li><Link href="/mvp" className="hover:text-bgmi-red transition-colors">MVP & Top Fraggers</Link></li>
            </ul>
          </div>

          {/* COL 3: REGISTRATION & MEDIA */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white">Portal</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/register" className="hover:text-bgmi-red transition-colors text-bgmi-red font-bold flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-bgmi-red" /> Register Squad</Link></li>
              <li><Link href="/media" className="hover:text-bgmi-red transition-colors">POV Clips & Media</Link></li>
              <li><Link href="/rules" className="hover:text-bgmi-red transition-colors">Official Rulebook</Link></li>
              <li><Link href="/admin/login" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors text-slate-500">Admin Portal</Link></li>
            </ul>
          </div>

          {/* COL 4: SUPPORT & COMMUNITY */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-slate-900 dark:text-white">Community Lobbies</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Join the official WhatsApp lobby for instant room credentials, schedule drops, and alerts.</p>
            <div className="pt-1">
              <a
                href="https://chat.whatsapp.com/E8vPQ1JZOPV4BNPF9FPLKG?s=cl&p=a&ilr=4"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold transition-all clip-tactical w-full"
              >
                <span>Join WhatsApp Group</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© 2026 NIT BGMI Esports Championship. All Rights Reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/rules" className="hover:text-bgmi-red">Rules & Code of Conduct</Link>
            <span className="hover:text-bgmi-red cursor-pointer">Anti-Cheat Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
