'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Swords, Radio, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero({ nextMatch = null, registeredSquads = 0 }) {
  const matchNum = nextMatch ? String(nextMatch.matchNumber || 1).padStart(2, '0') : null;

  return (
    <section className="relative pt-6 sm:pt-10 pb-10 sm:pb-14 overflow-hidden select-none font-sans">
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] shadow-sm">
              <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                NEXCORE ESPORTS CHAMPIONSHIP
              </span>
              <span className="text-slate-400 text-[10px]">▾</span>
            </div>

            {/* HIGH-IMPACT EDITORIAL HEADLINE */}
            <div className="space-y-1">
              <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-slate-900 dark:text-white tracking-tight leading-[1.05]">
                BGMI <br />
                <span className="text-[#C5A059]">CHAMPIONSHIP</span>
              </h1>
            </div>

            {/* EDITORIAL DESCRIPTION */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg font-normal leading-relaxed">
              Official campus squads competing across custom room matches. Dominate the circle and claim ultimate glory.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/register"
                className="px-7 py-3.5 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-full shadow-editorial hover:shadow-editorial-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Register Squad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/matches"
                className="px-7 py-3.5 bg-[#FAF8F5] dark:bg-[#121620] hover:bg-white dark:hover:bg-[#181E2C] text-slate-900 dark:text-white border border-[#E7E3DA] dark:border-[#1E2638] font-display font-bold text-xs uppercase tracking-wider rounded-full shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Swords className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>View Schedule</span>
              </Link>
            </div>

          </motion.div>

          {/* RIGHT CINEMATIC BGMI COMPOSITION CARD (5 COLS) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[32px] overflow-hidden border border-[#E7E3DA] dark:border-[#1E2638] shadow-2xl bg-white dark:bg-[#121620] group">
              
              {/* CINEMATIC HERO IMAGE WITH STENCILS */}
              <div className="relative h-80 sm:h-96 lg:h-[420px] w-full overflow-hidden">
                <img
                  src="/images/bgmi-hero-bg.jpg"
                  alt="BGMI Level 3 Soldier"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* DARK GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* TOP-LEFT KICKER */}
                {/* TOP-LEFT KICKER */}
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] font-mono tracking-widest text-[#C5A059] font-bold uppercase block opacity-95">
                    CAMPUS TOURNAMENT
                  </span>
                </div>

                {/* #BGMI BIG STENCIL OVERLAY */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <span className="font-display font-black text-6xl sm:text-7xl text-white/15 tracking-widest select-none">
                    #BGMI
                  </span>
                </div>

                {/* NEXT MATCH STATUS PILL */}
                <div className="absolute top-5 right-5 z-20">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                    {nextMatch ? `Match #${matchNum} • ${nextMatch.status || 'Upcoming'}` : 'Season 2026'}
                  </span>
                </div>

                {/* BOTTOM-LEFT TOURNAMENT TITLE */}
                <div className="absolute bottom-5 left-5 text-white space-y-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] font-bold block">
                    NEXCORE INSTITUTE OF TECHNOLOGY
                  </span>
                  <h3 className="font-display font-black text-xl uppercase tracking-tight">
                    BGMI CHAMPIONSHIP
                  </h3>
                </div>
              </div>

              {/* RADAR / NEXT MATCH TELEMETRY DRAWER */}
              <div className="p-4 sm:p-5 bg-white dark:bg-[#121620] border-t border-[#E7E3DA] dark:border-[#1E2638] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-[#E5383B] animate-pulse" />
                    {nextMatch ? 'NEXT MATCH SPOTLIGHT' : 'TOURNAMENT RADAR'}
                  </span>
                  {nextMatch ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-[#E5383B] font-mono text-[10px] font-bold">
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
                      <span className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white uppercase">
                        {nextMatch.map || 'ERANGEL'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">TIME</span>
                      <span className="font-mono font-bold text-sm text-[#C5A059]">
                        {nextMatch.time || nextMatch.date || 'TBA'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">ACTIVE SQUADS</span>
                      <span className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white">
                        {registeredSquads} Registered
                      </span>
                    </div>
                    <Link
                      href="/register"
                      className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#E5383B] dark:hover:bg-[#E5383B] dark:hover:text-white transition-colors shadow-sm"
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
