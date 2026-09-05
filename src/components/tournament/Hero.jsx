'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Swords, Radio, Shield, MapPin, Users, Flame, Trophy } from 'lucide-react';

export default function Hero({ nextMatch = null, registeredSquads = 0 }) {
  const matchNum = nextMatch ? String(nextMatch.matchNumber || 1).padStart(2, '0') : null;

  return (
    <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT EDITORIAL COLUMN (7 COLS) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* SUBTITLE KICKER PILL */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] shadow-editorial-sm">
              <span className="w-2 h-2 rounded-full bg-bgmi-red animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                OFFICIAL BGMI TOURNAMENT PLATFORM
              </span>
            </div>

            {/* HIGH-IMPACT EDITORIAL HEADLINE */}
            <div className="space-y-1">
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-slate-900 dark:text-white uppercase tracking-tight leading-[1.05]">
                BGMI <br />
                <span className="text-bgmi-red">CHAMPIONSHIP</span>
              </h1>
            </div>

            {/* EDITORIAL SUBTITLE & DESCRIPTION */}
            <div className="space-y-2 max-w-xl">
              <p className="font-display font-bold text-sm sm:text-base text-amber-600 dark:text-bgmi-gold uppercase tracking-wider">
                NEXCORE INSTITUTE OF TECHNOLOGY
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                Official campus squads competing across custom room matches. Dominate the circle and claim ultimate glory.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/register"
                className="px-6 sm:px-7 py-3 sm:py-3.5 bg-slate-950 hover:bg-slate-800 dark:bg-bgmi-red dark:hover:bg-bgmi-red-hover text-white font-display font-bold text-xs uppercase tracking-wider rounded-2xl shadow-editorial hover:shadow-editorial-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Register Squad</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/matches"
                className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white dark:bg-[#121620] hover:bg-slate-50 dark:hover:bg-[#181E2C] text-slate-900 dark:text-white border border-[#E7E3DA] dark:border-[#1E2638] font-display font-bold text-xs uppercase tracking-wider rounded-2xl shadow-editorial-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Swords className="w-4 h-4 text-bgmi-red" />
                <span>Explore Matches</span>
              </Link>
            </div>

            {/* TELEMETRY QUICK METADATA STRIP */}
            <div className="pt-4 border-t border-[#E7E3DA] dark:border-[#1E2638] flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-bgmi-gold" />
                <span>NEXCORE INSTITUTE OF TECHNOLOGY</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-bgmi-red" />
                <span>BATTLE ROYALE TOURNAMENT</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>CAMPUS SQUAD LEAGUE</span>
              </div>
            </div>

          </motion.div>

          {/* RIGHT CINEMATIC BGMI COMPOSITION CARD (5 COLS) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-[#E7E3DA] dark:border-[#1E2638] shadow-editorial-lg bg-white dark:bg-[#121620] group">
              
              {/* CINEMATIC HERO IMAGE */}
              <div className="relative h-72 sm:h-84 lg:h-96 w-full overflow-hidden">
                <img
                  src="/images/bgmi-hero-bg.jpg"
                  alt="BGMI Championship"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* OVERLAYS */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* BADGE OVERLAYS */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                    #BGMI CHAMPIONSHIP
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/90 text-slate-950 font-display font-black text-[10px] uppercase tracking-wider">
                    SEASON 2026
                  </span>
                </div>

                {/* HERO CARD BOTTOM TITLE */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                    NEXCORE INSTITUTE OF TECHNOLOGY
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight leading-tight">
                    BGMI CHAMPIONSHIP
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium line-clamp-1">
                    Official College Battlegrounds Tournament
                  </p>
                </div>
              </div>

              {/* RADAR / NEXT MATCH TELEMETRY DRAWER */}
              <div className="p-5 bg-white dark:bg-[#121620] border-t border-[#E7E3DA] dark:border-[#1E2638] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-bgmi-red animate-pulse" />
                    {nextMatch ? 'NEXT MATCH SPOTLIGHT' : 'TOURNAMENT RADAR'}
                  </span>
                  {nextMatch ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-bgmi-red font-mono text-[10px] font-bold">
                      MATCH #{matchNum}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                      REGISTRATION OPEN
                    </span>
                  )}
                </div>

                {nextMatch ? (
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">MAP</span>
                      <span className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">
                        {nextMatch.map || 'ERANGEL'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">TIME</span>
                      <span className="font-mono font-bold text-sm text-bgmi-gold dark:text-amber-400">
                        {nextMatch.time || nextMatch.date || 'TBA'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">ACTIVE SQUADS</span>
                      <span className="font-display font-black text-lg text-slate-900 dark:text-white">
                        {registeredSquads} Registered
                      </span>
                    </div>
                    <Link
                      href="/register"
                      className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-bgmi-red dark:hover:bg-bgmi-red dark:hover:text-white transition-colors"
                    >
                      Enter Arena →
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
