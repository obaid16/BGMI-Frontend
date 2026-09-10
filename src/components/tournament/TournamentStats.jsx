'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Users, Swords, Trophy, ShieldCheck } from 'lucide-react';

function AnimatedCounter({ target, duration = 1200 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="font-semibold tabular-nums">
      {value}
    </span>
  );
}

export default function TournamentStats({
  registeredSquads = 5,
  verifiedPlayers = 20,
  totalMatches = 4,
  currentRound = 4,
  maxSquads = 24,
  maxPlayers = 96
}) {
  return (
    <section className="w-full bg-premium-surface border-y border-premium-border py-12 my-8">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center divide-y md:divide-y-0 md:divide-x divide-premium-border">
          
          {/* STAT 1: REGISTRATION */}
          <div className="flex flex-col pt-6 md:pt-0 md:px-8 first:pt-0 first:px-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-premium-surface-soft flex items-center justify-center text-premium-sage">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-premium-text-secondary uppercase tracking-widest">
                Registered
              </span>
            </div>
            <p className="text-4xl lg:text-5xl font-bold text-premium-text tracking-tight flex items-baseline gap-2">
              <AnimatedCounter target={registeredSquads} />
            </p>
            <p className="text-sm text-premium-text-secondary mt-1">Campus Squads</p>
          </div>

          {/* STAT 2: PLAYERS */}
          <div className="flex flex-col pt-6 md:pt-0 md:px-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-premium-surface-soft flex items-center justify-center text-premium-sage">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-premium-text-secondary uppercase tracking-widest">
                Verified
              </span>
            </div>
            <p className="text-4xl lg:text-5xl font-bold text-premium-text tracking-tight flex items-baseline gap-2">
              <AnimatedCounter target={verifiedPlayers} />
            </p>
            <p className="text-sm text-premium-text-secondary mt-1">Student Players</p>
          </div>

          {/* STAT 3: MATCHES */}
          <div className="flex flex-col pt-6 md:pt-0 md:px-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-premium-surface-soft flex items-center justify-center text-premium-sage">
                <Swords className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-premium-text-secondary uppercase tracking-widest">
                Matches
              </span>
            </div>
            <p className="text-4xl lg:text-5xl font-bold text-premium-text tracking-tight flex items-baseline gap-2">
              <AnimatedCounter target={totalMatches} />
            </p>
            <p className="text-sm text-premium-text-secondary mt-1">Played Custom Lobbies</p>
          </div>

          {/* STAT 4: ROUND */}
          <div className="flex flex-col pt-6 md:pt-0 md:pl-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-premium-surface-soft flex items-center justify-center text-premium-sage">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-premium-text-secondary uppercase tracking-widest">
                Current Stage
              </span>
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-premium-text tracking-tight leading-tight">
              Finals
            </p>
            <p className="text-sm text-premium-text-secondary mt-1">Stage {currentRound} Progress</p>
          </div>

        </div>
      </div>
    </section>
  );
}
