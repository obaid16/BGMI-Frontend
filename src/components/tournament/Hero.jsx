'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Trophy, Swords, ShieldCheck, Activity } from 'lucide-react';
import Button from '../common/Button';
import HeroVideo from '../hero/HeroVideo';

export default function Hero() {
  const heroRef = useRef(null);
  const labelRef = useRef(null);
  const statusRef = useRef(null);
  const nitRef = useRef(null);
  const bgmiRef = useRef(null);
  const champRef = useRef(null);
  const yearRef = useRef(null);
  const taglineRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const detailsRef = useRef(null);
  const bottomBarRef = useRef(null);

  // 11-Step GSAP Cinematic Entrance Sequence
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(labelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.3 })
        .fromTo(statusRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 }, '-=0.2')
        .fromTo(nitRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2')
        .fromTo(bgmiRef.current, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
        .fromTo(champRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
        .fromTo(yearRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4 }, '-=0.2')
        .fromTo(taglineRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2')
        .fromTo(descRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2')
        .fromTo(
          buttonsRef.current?.children ? Array.from(buttonsRef.current.children) : [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.15 },
          '-=0.2'
        )
        .fromTo(
          detailsRef.current?.children ? Array.from(detailsRef.current.children) : [],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
          '-=0.2'
        )
        .fromTo(bottomBarRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-between pt-32 sm:pt-36 pb-8 overflow-hidden bg-[#0a0b0e] text-white select-none"
    >
      {/* 1. BACKGROUND VIDEO & COMPOSITE OVERLAY */}
      <HeroVideo />

      {/* 2. MAIN CINEMATIC LEFT-ALIGNED HERO CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 my-auto w-full">
        <div className="max-w-3xl space-y-6 sm:space-y-8 text-left">
          
          {/* HEADER TAG & STATUS ROW */}
          <div className="flex flex-wrap items-center gap-3 text-xs tracking-wider">
            {/* SMALL LABEL */}
            <span
              ref={labelRef}
              className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-400 border-l-2 border-slate-600 pl-2.5 py-0.5"
            >
              NIT ESPORTS PRESENTS
            </span>

            {/* STATUS BADGE */}
            <div
              ref={statusRef}
              className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#12141c]/90 border border-white/10 text-slate-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bgmi-red opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-bgmi-red"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-slate-200">
                REGISTRATION OPEN
              </span>
            </div>
          </div>

          {/* MAIN TITLE STACK */}
          <div className="space-y-1 sm:space-y-2">
            {/* "NIT" - LARGE BUT NOT OVERPOWERING */}
            <div ref={nitRef} className="overflow-hidden">
              <span className="block font-broadcast font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight text-slate-300 uppercase leading-none">
                NIT
              </span>
            </div>

            {/* "BGMI ESPORTS" - MAIN VISUAL FOCUS */}
            <div ref={bgmiRef} className="overflow-hidden">
              <h1 className="font-broadcast font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter text-white uppercase leading-[0.88] drop-shadow-2xl">
                BGMI <span className="text-bgmi-red">ESPORTS</span>
              </h1>
            </div>

            {/* "CHAMPIONSHIP" & "2026" */}
            <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 overflow-hidden pt-1">
              <div ref={champRef}>
                <h2 className="font-broadcast font-bold text-2xl sm:text-4xl md:text-5xl tracking-tight text-slate-300 uppercase leading-none">
                  CHAMPIONSHIP
                </h2>
              </div>
              <div ref={yearRef}>
                <span className="inline-block font-mono font-bold text-sm sm:text-xl text-bgmi-gold px-2.5 py-0.5 border border-bgmi-gold/30 bg-bgmi-gold/10 rounded uppercase tracking-widest">
                  2026
                </span>
              </div>
            </div>
          </div>

          {/* TAGLINE & DESCRIPTION */}
          <div className="space-y-3 max-w-2xl pt-2">
            {/* TAGLINE */}
            <p
              ref={taglineRef}
              className="font-broadcast font-bold text-sm sm:text-lg md:text-xl text-slate-200 uppercase tracking-[0.15em] border-l-2 border-bgmi-red pl-3"
            >
              ONE COLLEGE. ONE BATTLEGROUND. ONE CHAMPION.
            </p>

            {/* DESCRIPTION */}
            <p
              ref={descRef}
              className="text-xs sm:text-base text-slate-400 font-normal leading-relaxed max-w-xl"
            >
              Compete against the best squads from our college.
            </p>
          </div>

          {/* BROADCAST CTA BUTTONS */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
                <span>REGISTER YOUR SQUAD</span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/matches" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                <span>EXPLORE TOURNAMENT</span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* SUBTLE ESPORTS BROADCAST DETAILS */}
          <div
            ref={detailsRef}
            className="flex flex-wrap items-center gap-2 sm:gap-4 pt-4 text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest border-t border-white/10"
          >
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded">
              SEASON 01 / 2026
            </span>
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded">
              IN-HOUSE CHAMPIONSHIP
            </span>
            <span className="px-2.5 py-1 bg-bgmi-red/10 border border-bgmi-red/30 text-bgmi-red rounded">
              REGISTRATION OPEN
            </span>
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded">
              NIT // BGMI // 2026
            </span>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM BROADCAST TICKER BAR */}
      <div ref={bottomBarRef} className="relative z-20 mt-8 border-t border-white/10 bg-[#0a0b0e]/90 backdrop-blur-md py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2 text-slate-300 font-bold">
              <Trophy className="w-4 h-4 text-bgmi-gold" />
              <span>24 SQUADS REGISTERED</span>
            </span>
            <span className="hidden sm:flex items-center gap-2 text-slate-300">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>96 VERIFIED PLAYERS</span>
            </span>
            <span className="hidden md:flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ANTI-CHEAT SYSTEM ACTIVE</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono uppercase tracking-widest">
            <span>OFFICIAL NIT ARENA</span>
          </div>
        </div>
      </div>

    </section>
  );
}

