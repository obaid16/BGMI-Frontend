'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Swords } from 'lucide-react';
import Button from '../common/Button';
import HeroVideo from '../hero/HeroVideo';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main entrance timeline (MATCH START SEQUENCE)
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(badgeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.8 })
        .fromTo(line1Ref.current, { y: 40, opacity: 0, skewY: 1 }, { y: 0, opacity: 1, skewY: 0, duration: 0.8 }, '-=0.2')
        .fromTo(line2Ref.current, { y: 40, opacity: 0, skewY: 1 }, { y: 0, opacity: 1, skewY: 0, duration: 0.8 }, '-=0.5')
        .fromTo(subtitleRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .fromTo(
          ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
          '-=0.3'
        )
        .fromTo(
          statsRef.current?.children ? Array.from(statsRef.current.children) : [],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
          '-=0.2'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[88vh] flex items-center justify-center pt-8 pb-20 overflow-hidden bg-bgmi-dark select-none"
    >
      {/* Cinematic Esports Video Background */}
      <HeroVideo />

      {/* Tactical HUD overlays */}
      <div className="absolute top-24 left-8 z-20 pointer-events-none font-mono text-[9px] text-slate-400 uppercase tracking-widest space-y-1.5 select-none hidden md:block">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-bgmi-gold rounded-full animate-pulse" />
          <span>Sector: 04 / Grid</span>
        </div>
        <div>Squads: 24 / Alive</div>
        <div>Players: 96 / Combat</div>
      </div>

      <div className="absolute top-24 right-8 z-20 pointer-events-none font-mono text-[9px] text-slate-400 uppercase tracking-widest space-y-1.5 select-none text-right hidden md:block">
        <div className="flex items-center justify-end gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="text-emerald-400 font-bold">Safe Zone: Active</span>
        </div>
        <div>Zone Timer: <span className="font-bold text-bgmi-cyan">01:45</span></div>
      </div>

      <div className="absolute bottom-24 left-8 z-20 pointer-events-none font-mono text-[9px] text-slate-400 uppercase tracking-widest select-none hidden md:block">
        <span>BATTLEFIELD: READY</span>
      </div>

      <div className="absolute bottom-24 right-8 z-20 pointer-events-none font-mono text-[9px] text-slate-400 uppercase tracking-widest select-none text-right hidden md:block">
        <span>MATCH #07 — FINALS</span>
      </div>

      {/* Decorative corner brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-bgmi-gold/20 pointer-events-none" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-bgmi-gold/20 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-bgmi-gold/20 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-bgmi-gold/20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* TOURNAMENT STATUS BADGE */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-bgmi-surface/80 border border-bgmi-gold/50 shadow-gold-glow backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bgmi-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bgmi-gold"></span>
          </span>
          <span className="text-xs font-bold tracking-[0.2em] text-bgmi-gold uppercase">
            REGISTRATION OPEN — SEASON 2026
          </span>
        </div>

        {/* CINEMATIC TITLE */}
        <div className="space-y-1 mb-6">
          <h1 ref={line1Ref} className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-none">
            [COLLEGE NAME]
          </h1>
          <h2 ref={line2Ref} className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-bgmi-gold via-amber-400 to-orange-500 uppercase leading-none mt-2">
            BGMI ESPORTS CHAMPIONSHIP{' '}
            <span className="text-bgmi-cyan">2026</span>
          </h2>
        </div>

        {/* TAGLINE */}
        <div ref={subtitleRef} className="space-y-2 mb-12">
          <p className="text-base sm:text-xl md:text-2xl font-display tracking-[0.2em] text-bgmi-gold font-black uppercase max-w-3xl mx-auto">
            ONE COLLEGE. ONE BATTLEGROUND. ONE CHAMPION.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Compete against the best squads from our college.
          </p>
        </div>

        {/* CALL TO ACTION BUTTONS */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/register">
            <Button variant="primary" size="lg" icon={Trophy} className="w-full sm:w-auto px-10 py-4 text-sm">
              REGISTER YOUR SQUAD
            </Button>
          </Link>
          <Link href="/matches">
            <Button variant="secondary" size="lg" icon={Swords} className="w-full sm:w-auto px-10 py-4 text-sm">
              VIEW TOURNAMENT
            </Button>
          </Link>
        </div>

        {/* HERO STATS OVERVIEW BAR */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bgmi-border/40 rounded-2xl overflow-hidden max-w-3xl mx-auto border border-bgmi-border/60 shadow-2xl"
        >
          <div className="bg-bgmi-surface/90 backdrop-blur-sm p-5 text-center">
            <p className="text-3xl sm:text-4xl font-black font-display text-white">24</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registered Squads</p>
          </div>
          <div className="bg-bgmi-surface/90 backdrop-blur-sm p-5 text-center">
            <p className="text-3xl sm:text-4xl font-black font-display text-bgmi-gold">96</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Players</p>
          </div>
          <div className="bg-bgmi-surface/90 backdrop-blur-sm p-5 text-center">
            <p className="text-3xl sm:text-4xl font-black font-display text-bgmi-cyan">12</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Matches</p>
          </div>
          <div className="bg-bgmi-surface/90 backdrop-blur-sm p-5 text-center">
            <p className="text-3xl sm:text-4xl font-black font-display text-emerald-400">4</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Current Round</p>
          </div>
        </div>

      </div>
    </section>
  );
}
