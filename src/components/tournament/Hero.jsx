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
      className="relative min-h-[90vh] sm:min-h-screen flex flex-col justify-center pt-24 sm:pt-28 pb-16 overflow-hidden bg-[#0B0E14] text-white select-none"
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
                NEXCORE ESPORTS // 2026
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
                NEXCORE INSTITUTE OF TECHNOLOGY
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
                Official campus squads competing across custom room matches. Dominate the circle and claim ultimate glory.
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
              <span>ORGANIZER: NEXCORE INSTITUTE OF TECHNOLOGY</span>
              <span>•</span>
              <span>FORMAT: TPP SQUAD BATTLE ROYALE</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">ANTI-CHEAT MOSAC ENABLED</span>
            </div>

          </div>

          {/* RIGHT LIVE MATCH SPOTLIGHT CARD (5 COLS) */}
          <div ref={rightColRef} className="lg:col-span-5">
            <div className="bg-[#121620]/90 border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5 relative backdrop-blur-md">
              
              {/* CARD HEADER */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-bgmi-red uppercase tracking-wider">
                  <Radio className="w-3.5 h-3.5 animate-pulse" /> NEXT MATCH SPOTLIGHT
                </div>
                <span className="px-2.5 py-0.5 rounded bg-bgmi-red/20 text-bgmi-red font-mono text-[10px] font-bold uppercase">
                  MATCH 01
                </span>
              </div>

              {/* MAP & MATCH SPECS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">BATTLEGROUND MAP</span>
                    <span className="font-broadcast font-black text-2xl text-white uppercase">ERANGEL</span>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-xs font-mono font-bold uppercase">
                    GRAND FINALS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-[#0B0E14] rounded-lg border border-white/10">
                    <span className="text-[10px] text-slate-400 block uppercase mb-0.5">MODE</span>
                    <span className="font-bold text-white">TPP SQUAD (4v4)</span>
                  </div>
                  <div className="p-3 bg-[#0B0E14] rounded-lg border border-white/10">
                    <span className="text-[10px] text-slate-400 block uppercase mb-0.5">CAPACITY</span>
                    <span className="font-bold text-sky-400">24 SQUADS (96 PLAYERS)</span>
                  </div>
                </div>

                <div className="p-3 bg-[#0B0E14] rounded-lg border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-broadcast font-bold text-white uppercase">CUSTOM ROOM PREPARED</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">10:15 AM</span>
                </div>
              </div>

              {/* CARD FOOTER CTA */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">NEXCORE ESPORTS OFFICIAL LOBBY</span>
                <Link href="/matches" className="text-bgmi-red font-bold hover:underline flex items-center gap-1">
                  <span>ROOM SCHEDULE</span>
                  <span>→</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
