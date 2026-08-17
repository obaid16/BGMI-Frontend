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
    <span ref={ref} className="font-mono font-black tabular-nums">
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
    <section className="w-full bg-slate-900 text-white border-y-2 border-bgmi-red py-6 my-8 font-sans shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {/* TICKER 1: REGISTRATION */}
          <div className="space-y-1 pt-4 md:pt-0 md:px-6 first:pt-0">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              <Users className="w-3.5 h-3.5 text-bgmi-red" /> REGISTRATION STATUS
            </div>
            <p className="text-3xl sm:text-4xl font-broadcast font-black text-white uppercase tracking-tight flex items-baseline gap-2">
              <AnimatedCounter target={registeredSquads} />
              <span className="text-xs font-mono text-bgmi-red font-bold">SQUADS</span>
            </p>
            <p className="text-[10px] text-slate-400 font-mono uppercase font-bold">REGISTERED CAMPUS TEAMS</p>
          </div>

          {/* TICKER 2: ROSTER */}
          <div className="space-y-1 pt-4 md:pt-0 md:px-6">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PLAYER ROSTER
            </div>
            <p className="text-3xl sm:text-4xl font-broadcast font-black text-emerald-400 uppercase tracking-tight flex items-baseline gap-2">
              <AnimatedCounter target={verifiedPlayers} />
              <span className="text-xs font-mono text-slate-400 font-bold">PLAYERS</span>
            </p>
            <p className="text-[10px] text-slate-400 font-mono uppercase font-bold">VERIFIED STUDENT PLAYERS</p>
          </div>

          {/* TICKER 3: MATCHES */}
          <div className="space-y-1 pt-4 md:pt-0 md:px-6">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              <Swords className="w-3.5 h-3.5 text-sky-400" /> MATCHES
            </div>
            <p className="text-3xl sm:text-4xl font-broadcast font-black text-sky-400 uppercase tracking-tight flex items-baseline gap-2">
              <AnimatedCounter target={totalMatches} />
              <span className="text-xs font-mono text-slate-400 font-bold">MATCHES PLAYED</span>
            </p>
            <p className="text-[10px] text-slate-400 font-mono uppercase font-bold">CUSTOM LOBBIES</p>
          </div>

          {/* TICKER 4: ROUND */}
          <div className="space-y-1 pt-4 md:pt-0 md:px-6">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> STAGE ROUND
            </div>
            <p className="text-2xl sm:text-3xl font-broadcast font-black text-amber-400 uppercase tracking-tight">
              GRAND FINALS
            </p>
            <p className="text-[10px] text-slate-400 font-mono uppercase font-bold">Stage {currentRound} Progress</p>
          </div>

        </div>
      </div>
    </section>
  );
}
