'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowUpRight, Swords, Radio, Shield, MapPin, Users } from 'lucide-react';
import HeroVideo from '../hero/HeroVideo';

export default function Hero() {
  const heroRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(leftColRef.current?.children ? Array.from(leftColRef.current.children) : [], 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2 }
      ).fromTo(rightColRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 },
        '-=0.3'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] sm:min-h-screen flex flex-col justify-center pt-32 pb-16 overflow-hidden bg-[#0B0E14] text-white select-none"
    >
      {/* BACKGROUND VIDEO & COMPOSITE OVERLAYS */}
      <HeroVideo />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT EDITORIAL COLUMN (7 COLS) */}
          <div ref={leftColRef} className="lg:col-span-7 space-y-6 text-left">
            
            {/* SUBTITLE KICKER */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-bgmi-red border-l-2 border-bgmi-red pl-3 py-0.5">
                NIT ESPORTS // 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase tracking-wider">
                <Radio className="w-3 h-3 animate-pulse" /> TOURNAMENT ACTIVE
              </span>
            </div>

            {/* HIGH-IMPACT EDITORIAL HEADLINE STACK */}
            <div className="space-y-1">
              <h1 className="font-broadcast font-black text-6xl sm:text-8xl md:text-9xl text-white uppercase tracking-tighter leading-none drop-shadow-2xl">
                BGMI
              </h1>
              <h2 className="font-broadcast font-black text-4xl sm:text-6xl md:text-7xl text-bgmi-red uppercase tracking-tight leading-none">
                CHAMPIONSHIP
              </h2>
            </div>

            {/* EDITORIAL TAGLINE */}
            <div className="space-y-2 max-w-xl">
              <p className="font-broadcast font-bold text-base sm:text-xl text-slate-200 uppercase tracking-widest border-l-2 border-amber-500 pl-3">
                IN-HOUSE COLLEGE TOURNAMENT
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
                24 verified squads from our campus competing across custom room matches. Dominate the circle and claim ultimate glory.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/register"
                className="px-8 py-3.5 bg-bgmi-red hover:bg-bgmi-red-hover text-white font-broadcast font-black text-xs uppercase tracking-wider clip-technical-btn shadow-red-glow transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>REGISTER SQUAD</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/matches"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-broadcast font-bold text-xs uppercase tracking-wider clip-technical-btn transition-all flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4 text-bgmi-red" />
                <span>EXPLORE MATCHES</span>
              </Link>
            </div>

            {/* TELEMETRY METADATA STRIP */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              <span>ORGANIZER: NIT ESPORTS CLUB</span>
              <span>•</span>
              <span>FORMAT: TPP SQUAD BATTLE ROYALE</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">ANTI-CHEAT MOSAC ENABLED</span>
            </div>

          </div>

          {/* RIGHT LIVE MATCH TELEMETRY WIDGET (5 COLS) */}
          <div ref={rightColRef} className="lg:col-span-5">
            <div className="bg-[#121620]/95 border-2 border-bgmi-red/60 rounded-2xl p-6 clip-tactical shadow-2xl space-y-5 relative backdrop-blur-xl">
              <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />

              {/* WIDGET HEADER */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-bgmi-red uppercase tracking-wider">
                  <Radio className="w-4 h-4 animate-pulse" /> LIVE MATCH SPOTLIGHT
                </div>
                <span className="px-2.5 py-0.5 rounded bg-bgmi-red/20 text-bgmi-red border border-bgmi-red/40 font-mono text-[10px] font-bold uppercase">
                  MATCH 01
                </span>
              </div>

              {/* MAP SPECS DISPLAY */}
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 uppercase font-bold">
                    <MapPin className="w-4 h-4 text-bgmi-red" /> MAP ARENA
                  </span>
                  <span className="font-broadcast font-black text-xl text-white uppercase">ERANGEL</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-[#0B0E14] rounded border border-white/10 space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase">CAPACITY</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-sky-400" /> 24 SQUADS
                    </span>
                  </div>
                  <div className="p-3 bg-[#0B0E14] rounded border border-white/10 space-y-0.5">
                    <span className="text-[9px] text-slate-400 block uppercase">STAGE</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-amber-400" /> GRAND FINALS
                    </span>
                  </div>
                </div>
              </div>

              {/* RADAR BEAM GRAPHIC */}
              <div className="h-28 bg-[#0B0E14] rounded border border-bgmi-red/30 relative flex items-center justify-center p-3 overflow-hidden">
                <div className="absolute inset-0 bg-tactical-grid opacity-30" />
                <div className="w-20 h-20 rounded-full border border-bgmi-red/30 absolute" />
                <div className="w-12 h-12 rounded-full border border-bgmi-red/50 absolute" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-bgmi-red/25 to-transparent animate-spin origin-center duration-3000 pointer-events-none" />

                <div className="relative z-10 text-center space-y-0.5">
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                    ● ROOM LOBBY READY
                  </span>
                  <span className="text-xs font-broadcast font-bold text-white uppercase tracking-wider block">
                    CUSTOM LOBBY CODE ACTIVE
                  </span>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono relative z-10">
                <span className="text-slate-400">ROOM ID DROPS @ 10:15 AM</span>
                <Link href="/matches" className="text-bgmi-red font-bold hover:underline">
                  LOBBY PASS →
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
