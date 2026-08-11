'use client';

import React from 'react';
import Link from 'next/link';
import { Crosshair, Shield, Award, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-bgmi-surface border-t border-bgmi-border/80 pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-bgmi-border/60">
          
          {/* COL 1: BRAND */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-bgmi-gold rounded-lg p-0.5 clip-tactical flex items-center justify-center text-slate-950 font-bold shadow-gold-glow">
                <Crosshair className="w-5 h-5" />
              </div>
              <span className="font-display font-black text-xl text-white uppercase tracking-wider">
                NIT <span className="text-bgmi-gold">BGMI</span> CHAMPIONSHIP
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Official NIT BGMI Esports Championship 2026. An exclusive in-house esports tournament for student squads to compete, survive, and dominate.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-bgmi-gold bg-bgmi-gold/10 px-2.5 py-1 rounded border border-bgmi-gold/30">
                <Shield className="w-3.5 h-3.5" /> Fair Play Verified
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-bgmi-cyan bg-bgmi-cyan/10 px-2.5 py-1 rounded border border-bgmi-cyan/30">
                <Award className="w-3.5 h-3.5" /> Exclusive In-House
              </span>
            </div>
          </div>

          {/* COL 2: QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white">Tournament</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/teams" className="hover:text-bgmi-gold transition-colors">Our College Squads</Link></li>
              <li><Link href="/matches" className="hover:text-bgmi-gold transition-colors">Schedule & Lobbies</Link></li>
              <li><Link href="/standings" className="hover:text-bgmi-gold transition-colors">Leaderboard Standings</Link></li>
              <li><Link href="/results" className="hover:text-bgmi-gold transition-colors">Match Results & Proofs</Link></li>
              <li><Link href="/rules" className="hover:text-bgmi-gold transition-colors">Official Rulebook</Link></li>
            </ul>
          </div>

          {/* COL 3: REGISTRATION & MEDIA */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white">Portal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/register" className="hover:text-bgmi-gold transition-colors text-bgmi-gold font-semibold">Register Squad</Link></li>
              <li><Link href="/media" className="hover:text-bgmi-gold transition-colors">POV Clips & Media</Link></li>
              <li><a href="#announcements" className="hover:text-bgmi-gold transition-colors">Announcements</a></li>
            </ul>
          </div>

          {/* COL 4: SUPPORT & COMMUNITY */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-widest text-white">Community</h4>
            <p className="text-xs text-slate-400">Join our Discord server and WhatsApp group for lobby credentials & alerts.</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 rounded-lg text-xs font-bold transition-all clip-tactical"
              >
                <span>Join Official Discord</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://chat.whatsapp.com/E8vPQ1JZOPV4BNPF9FPLKG?s=cl&p=a&ilr=4"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-bold transition-all clip-tactical"
              >
                <span>Join WhatsApp Group</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 NIT BGMI Esports Championship. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Play</span>
            <span>Anti-Cheat Policy</span>
            <span>Privacy Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
