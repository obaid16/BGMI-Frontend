'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, ArrowDown } from 'lucide-react';
import Button from '../common/Button';
import HeroVideo from '../hero/HeroVideo';

export default function Hero() {
  const heroRef = useRef(null);
  const labelRef = useRef(null);
  const statusRef = useRef(null);
  const nitRef = useRef(null);
  const bgmiRef = useRef(null);
  const esportsRef = useRef(null);
  const champRef = useRef(null);
  const yearRef = useRef(null);
  const taglineRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const detailsRef = useRef(null);

  // 12-Step GSAP Cinematic Broadcast Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(labelRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, delay: 0.2 })
        .fromTo(statusRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35 }, '-=0.15')
        .fromTo(nitRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.15')
        .fromTo(bgmiRef.current, { y: 25, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.5 }, '-=0.2')
        .fromTo(esportsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.25')
        .fromTo(champRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2')
        .fromTo(yearRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.35 }, '-=0.15')
        .fromTo(taglineRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, '-=0.15')
        .fromTo(descRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, '-=0.15')
        .fromTo(
          buttonsRef.current?.children ? Array.from(buttonsRef.current.children) : [],
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.12 },
          '-=0.15'
        )
        .fromTo(
          detailsRef.current?.children ? Array.from(detailsRef.current.children) : [],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.08 },
          '-=0.15'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-center pt-28 sm:pt-36 pb-12 overflow-hidden bg-[#0B0E14] text-white select-none"
    >
      {/* 1. BACKGROUND VIDEO & COLOR-GRADED OVERLAYS */}
      <HeroVideo />

      {/* 2. MAIN CINEMATIC HERO CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 my-auto w-full">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16">
          
          {/* LEFT-SIDE EDITORIAL CONTENT */}
          <div className="max-w-3xl space-y-5 sm:space-y-6 text-left w-full">
            
            {/* HEADER TAG & REGISTRATION STATUS */}
            <div className="flex flex-wrap items-center gap-3 text-xs tracking-wider">
              {/* TOP SMALL LABEL */}
              <span
                ref={labelRef}
                className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-600 dark:text-slate-300 border-l-2 border-slate-400 dark:border-slate-500 pl-2.5 py-0.5"
              >
                NIT ESPORTS PRESENTS
              </span>

              {/* LIVE REGISTRATION STATUS */}
              <div
                ref={statusRef}
                className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/90 dark:bg-[#121620]/90 border border-slate-300 dark:border-white/10 backdrop-blur-md shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bgmi-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-bgmi-red"></span>
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
                  REGISTRATION OPEN
                </span>
              </div>
            </div>

            {/* MAIN TYPOGRAPHY TITLE STACK */}
            <div className="space-y-0.5 sm:space-y-1">
              
              {/* "NIT" - SMALL / MEDIUM */}
              <div ref={nitRef} className="overflow-hidden">
                <span className="block font-broadcast font-bold text-xl sm:text-3xl md:text-4xl tracking-wider text-slate-600 dark:text-slate-400 uppercase leading-none">
                  NIT
                </span>
              </div>

              {/* "BGMI" - VERY LARGE */}
              <div ref={bgmiRef} className="overflow-hidden">
                <h1 className="font-broadcast font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter text-slate-900 dark:text-white uppercase leading-[0.88] drop-shadow-2xl">
                  BGMI
                </h1>
              </div>

              {/* "ESPORTS" - LARGE BUT SLIGHTLY SMALLER THAN BGMI */}
              <div ref={esportsRef} className="overflow-hidden">
                <span className="block font-broadcast font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-bgmi-red uppercase leading-none">
                  ESPORTS
                </span>
              </div>

              {/* "CHAMPIONSHIP" & "2026" BADGE */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 overflow-hidden pt-1.5 sm:pt-2">
                <div ref={champRef}>
                  <h2 className="font-broadcast font-bold text-xl sm:text-3xl md:text-4xl tracking-tight text-slate-700 dark:text-slate-300 uppercase leading-none">
                    CHAMPIONSHIP
                  </h2>
                </div>
                <div ref={yearRef}>
                  <span className="inline-block font-mono font-bold text-xs sm:text-base text-amber-600 dark:text-bgmi-gold px-3 py-0.5 border border-amber-500/40 dark:border-bgmi-gold/40 bg-amber-500/10 dark:bg-bgmi-gold/15 rounded uppercase tracking-widest shadow-gold-glow">
                    2026
                  </span>
                </div>
              </div>

            </div>

            {/* TAGLINE & DESCRIPTION */}
            <div className="space-y-2.5 max-w-2xl pt-1 sm:pt-2">
              {/* TAGLINE */}
              <p
                ref={taglineRef}
                className="font-broadcast font-bold text-xs sm:text-base md:text-lg text-slate-800 dark:text-slate-200 uppercase tracking-[0.15em] border-l-2 border-bgmi-red pl-3"
              >
                ONE COLLEGE. ONE BATTLEGROUND. ONE CHAMPION.
              </p>

              {/* DESCRIPTION */}
              <p
                ref={descRef}
                className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-lg"
              >
                Compete against the best squads from our college.
              </p>
            </div>

            {/* BUTTONS ROW */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
                  <span>REGISTER YOUR SQUAD</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/matches" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                  <span>EXPLORE TOURNAMENT</span>
                  <ArrowDown className="w-4 h-4 ml-1 transition-transform group-hover:translate-y-0.5" />
                </Button>
              </Link>
            </div>

            {/* SUBTLE BROADCAST METADATA */}
            <div
              ref={detailsRef}
              className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 sm:pt-6 text-[10px] sm:text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-widest border-t border-slate-300 dark:border-white/10"
            >
              <span className="px-2.5 py-1 bg-slate-200/70 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded">
                SEASON 01 / 2026
              </span>
              <span className="px-2.5 py-1 bg-slate-200/70 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded">
                IN-HOUSE CHAMPIONSHIP
              </span>
              <span className="px-2.5 py-1 bg-bgmi-red/10 border border-bgmi-red/30 text-bgmi-red font-bold rounded">
                REGISTRATION OPEN
              </span>
            </div>

          </div>

          {/* RIGHT-SIDE ATMOSPHERIC TOURNAMENT BADGE (DESKTOP) */}
          <div className="hidden lg:flex flex-col items-end justify-center self-center max-w-xs space-y-4 text-right opacity-80">
            <div className="p-4 rounded-xl bg-white/80 dark:bg-[#121620]/60 border border-slate-300 dark:border-white/10 backdrop-blur-md space-y-2">
              <div className="text-[10px] font-mono text-amber-600 dark:text-bgmi-gold font-bold uppercase tracking-widest">
                OFFICIAL COLLEGE ESPORTS
              </div>
              <div className="text-xs font-broadcast font-bold text-slate-800 dark:text-slate-200 uppercase">
                BATTLEGROUNDS MOBILE INDIA
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
                Verified college rosters, live match brackets, standings & real-time tournament highlights.
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}


