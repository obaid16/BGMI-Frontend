'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowUpRight, PlayCircle } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const heroRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(leftColRef.current?.children ? Array.from(leftColRef.current.children) : [], 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.2 }
      ).fromTo(rightColRef.current,
        { scale: 0.95, opacity: 0, x: 20 },
        { scale: 1, opacity: 1, x: 0, duration: 0.8 },
        '-=0.6'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] sm:min-h-screen flex flex-col justify-center pt-24 sm:pt-28 pb-16 bg-premium-background text-premium-text"
    >
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8 relative z-20 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT EDITORIAL COLUMN (6 COLS) */}
          <div ref={leftColRef} className="lg:col-span-6 space-y-8 text-left max-w-2xl">
            
            {/* SUBTITLE KICKER */}
            <div className="inline-flex items-center gap-2">
              <span className="font-semibold text-xs uppercase tracking-[0.2em] text-premium-text-secondary border-l-2 border-premium-sage pl-3 py-1">
                Official BGMI Tournament Platform
              </span>
            </div>

            {/* HIGH-IMPACT EDITORIAL HEADLINE STACK */}
            <div className="space-y-2">
              <h1 className="font-bold text-6xl sm:text-7xl lg:text-[80px] text-premium-text tracking-tighter leading-[1.05]">
                More Than a Game.
              </h1>
              <h2 className="font-bold text-5xl sm:text-6xl lg:text-[72px] text-premium-sage tracking-tighter leading-[1.05]">
                A Stronger Community.
              </h2>
            </div>

            {/* EDITORIAL TAGLINE */}
            <p className="text-base sm:text-lg text-premium-text-secondary leading-relaxed max-w-xl">
              Join tournaments, showcase your skills, and be part of a growing BGMI community across campuses. The official Nexcore Institute of Technology esports platform.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-premium-text hover:bg-black text-white font-medium text-sm rounded-full shadow-premium-float transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <span>Register Your Squad</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </Link>
              <Link
                href="/matches"
                className="px-8 py-4 bg-premium-surface hover:bg-premium-surface-soft text-premium-text border border-premium-border font-medium text-sm rounded-full transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <PlayCircle className="w-4 h-4 text-premium-text-secondary" />
                <span>View Tournament Schedule</span>
              </Link>
            </div>
          </div>

          {/* RIGHT CINEMATIC IMAGE SPOTLIGHT (6 COLS) */}
          <div ref={rightColRef} className="lg:col-span-6 relative w-full aspect-[4/5] lg:aspect-square">
            <div className="absolute inset-0 bg-premium-champagne/10 rounded-[30px] translate-x-4 translate-y-4 -z-10"></div>
            <div className="relative w-full h-full rounded-[28px] overflow-hidden shadow-premium-float border border-premium-border bg-premium-surface group">
              {/* Warm Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-premium-background/40 to-transparent z-10 mix-blend-overlay pointer-events-none"></div>
              
              <Image 
                src="/images/hero_poster.png"
                alt="BGMI Cinematic"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
              />
              
              {/* Subtle badge on image */}
              <div className="absolute bottom-6 left-6 z-20 backdrop-blur-md bg-white/70 px-4 py-2 rounded-xl border border-white/50 shadow-sm flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-premium-sage animate-pulse"></div>
                 <span className="text-xs font-semibold tracking-wide text-premium-text">Registrations Open</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
