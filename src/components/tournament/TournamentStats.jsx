'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Users, Swords, Trophy, ShieldCheck } from 'lucide-react';

function AnimatedCounter({ target, duration = 1000 }) {
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
  registeredSquads = 0,
  verifiedPlayers = 0,
  totalMatches = 0,
  currentRound = 0,
}) {
  return (
    <section className="w-full py-4 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 sm:p-8 shadow-editorial-sm">
          
          {/* STAT 1: SQUADS */}
          <div className="space-y-1.5 p-2">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <Users className="w-4 h-4 text-bgmi-red" />
              <span>Registered Squads</span>
            </div>
            <p className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-baseline gap-1.5">
              <AnimatedCounter target={registeredSquads} />
              <span className="text-xs font-mono text-bgmi-red font-bold">TEAMS</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Verified campus entries</p>
          </div>

          {/* STAT 2: PLAYERS */}
          <div className="space-y-1.5 p-2">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Player Roster</span>
            </div>
            <p className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-baseline gap-1.5">
              <AnimatedCounter target={verifiedPlayers} />
              <span className="text-xs font-mono text-slate-400 font-bold">PLAYERS</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total registered roster</p>
          </div>

          {/* STAT 3: MATCHES */}
          <div className="space-y-1.5 p-2">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <Swords className="w-4 h-4 text-bgmi-red" />
              <span>Tournament Matches</span>
            </div>
            <p className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-baseline gap-1.5">
              <AnimatedCounter target={totalMatches} />
              <span className="text-xs font-mono text-bgmi-red font-bold">ROOMS</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Official custom lobbies</p>
          </div>

          {/* STAT 4: ROUND */}
          <div className="space-y-1.5 p-2">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <Trophy className="w-4 h-4 text-bgmi-gold" />
              <span>Tournament Stage</span>
            </div>
            <p className="text-2xl sm:text-3xl font-display font-black text-amber-600 dark:text-bgmi-gold uppercase tracking-tight">
              STAGE {currentRound || 1}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Grand finals qualifier</p>
          </div>

        </div>
      </div>
    </section>
  );
}
