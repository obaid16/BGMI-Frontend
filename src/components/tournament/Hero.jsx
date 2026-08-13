'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Swords, ShieldCheck, Activity, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import HeroVideo from '../hero/HeroVideo';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const tickerRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // GSAP Timeline Reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        leftColRef.current?.children ? Array.from(leftColRef.current.children) : [],
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, delay: 0.2 }
      )
        .fromTo(
          rightColRef.current,
          { x: 50, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          tickerRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-10 overflow-hidden bg-slate-950 text-white select-none"
    >
      {/* Background Video Layer */}
      <HeroVideo />

      {/* Main Asymmetric Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: EDITORIAL TYPOGRAPHY & BRANDING (7 COLS) */}
          <div ref={leftColRef} className="lg:col-span-7 space-y-6 text-left">
            
            {/* BADGE */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-bgmi-red/50 shadow-red-glow backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bgmi-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bgmi-red"></span>
              </span>
              <span className="text-xs font-black tracking-[0.2em] text-white uppercase">
                NIT COLLEGE ESPORTS EDITION 2026
              </span>
            </div>

            {/* TYPOGRAPHY TITLE STACK */}
            <div className="space-y-1 pl-4 border-l-4 border-bgmi-red">
              <span className="text-xs font-black tracking-[0.3em] text-bgmi-gold uppercase block">
                OFFICIAL CHAMPIONSHIP ARENA
              </span>
              <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-white uppercase leading-[0.9] drop-shadow-2xl">
                NIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-bgmi-red via-rose-500 to-amber-500">BGMI</span>
              </h1>
              <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase leading-none">
                CHAMPIONSHIP
              </h2>
            </div>

            {/* TAGLINE */}
            <div className="space-y-3 max-w-xl">
              <p className="text-base sm:text-xl font-display tracking-[0.18em] text-bgmi-gold font-black uppercase">
                "ONE COLLEGE. ONE BATTLEGROUND. ONE CHAMPION."
              </p>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                Drop into Erangel, Miramar & Sanhok custom rooms. Represent your branch, secure WWCD placement points, and battle for total campus dominance.
              </p>
            </div>

            {/* ACTION CTAS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/register">
                <Button variant="primary" size="lg" icon={Trophy} className="px-8 py-4 text-xs font-black shadow-red-glow">
                  REGISTER YOUR SQUAD
                </Button>
              </Link>
              <Link href="/matches">
                <Button variant="secondary" size="lg" icon={Swords} className="px-8 py-4 text-xs font-bold">
                  EXPLORE TOURNAMENT
                </Button>
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: FLOATING LIVE MATCH RADAR CARD (5 COLS) */}
          <div ref={rightColRef} className="lg:col-span-5">
            <div className="relative bg-slate-950/90 border-2 border-bgmi-red/60 rounded-2xl p-6 sm:p-7 clip-tactical shadow-red-glow space-y-6">
              
              {/* CARD TOP HEADER */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-display font-black text-xs text-emerald-400 uppercase tracking-widest">
                    LIVE MATCH RADAR
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  PING: 18ms
                </span>
              </div>

              {/* SPOTLIGHT MATCH DETAILS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-bgmi-gold uppercase tracking-wider block">SPOTLIGHT BATTLE</span>
                    <h3 className="font-display font-black text-xl text-white uppercase">MATCH #4 — ERANGEL</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-bgmi-red/20 text-bgmi-red font-black text-xs border border-bgmi-red/40 uppercase">
                    GRAND FINALS
                  </span>
                </div>

                {/* COUNTDOWN TIMER DISPLAY */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                    CUSTOM ROOM LAUNCH COUNTDOWN
                  </span>
                  <div className="flex items-center justify-center gap-2 font-display font-black text-3xl text-bgmi-red">
                    <span className="bg-slate-950 px-3 py-1 rounded border border-slate-800 text-white">
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </span>
                    <span>:</span>
                    <span className="bg-slate-950 px-3 py-1 rounded border border-slate-800 text-white">
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </span>
                    <span>:</span>
                    <span className="bg-slate-950 px-3 py-1 rounded border border-slate-800 text-bgmi-red">
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                </div>

                {/* MATCH QUICK STATS ROW */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">CAPACITY</span>
                    <span className="font-display font-black text-white">24 / 24 SQUADS</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">MAP</span>
                    <span className="font-display font-black text-bgmi-cyan">ERANGEL</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">ROOM CODE</span>
                    <span className="font-display font-black text-bgmi-gold">DROP @ 10:15</span>
                  </div>
                </div>
              </div>

              {/* FOOTER LINK */}
              <div className="pt-2">
                <Link
                  href="/matches"
                  className="w-full py-3 bg-bgmi-red/15 hover:bg-bgmi-red/25 border border-bgmi-red/40 rounded-xl text-bgmi-red font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <span>ENTER MATCH LOBBY HUB</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM TICKER BAR */}
      <div ref={tickerRef} className="relative z-20 mt-8 border-y border-slate-800 bg-slate-950 py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-bgmi-gold">
              <Trophy className="w-4 h-4 text-bgmi-gold" />
              <span>24 SQUADS REGISTERED</span>
            </span>
            <span className="hidden sm:flex items-center gap-2 text-bgmi-cyan">
              <Activity className="w-4 h-4 text-bgmi-cyan" />
              <span>96 VERIFIED PLAYERS</span>
            </span>
            <span className="hidden md:flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ANTI-CHEAT SYSTEM ACTIVE</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-bgmi-red text-[11px] uppercase tracking-widest font-black">
            <span>CHAMPIONSHIP 2026 EDITION</span>
          </div>
        </div>
      </div>

    </section>
  );
}
