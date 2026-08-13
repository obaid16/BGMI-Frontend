'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Users, Swords, Trophy, ShieldCheck } from 'lucide-react';

function AnimatedCounter({ target, duration = 1500, suffix = '' }) {
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
    <span ref={ref} className="font-display font-black tabular-nums">
      {value}{suffix}
    </span>
  );
}

export default function TournamentStats({
  registeredSquads = 24,
  verifiedPlayers = 96,
  totalMatches = 4,
  currentRound = 4
}) {
  const stats = [
    {
      icon: Users,
      value: registeredSquads,
      label: 'Registered Squads',
      color: 'text-slate-900 dark:text-white',
      iconColor: 'text-bgmi-red',
      bg: 'bg-white border-slate-200 dark:bg-bgmi-surface/90 dark:border-bgmi-border hover:border-bgmi-red/50 shadow-md dark:shadow-lg',
    },
    {
      icon: ShieldCheck,
      value: verifiedPlayers,
      label: 'Verified Players',
      color: 'text-bgmi-red',
      iconColor: 'text-bgmi-red',
      bg: 'bg-white border-slate-200 dark:bg-bgmi-surface/90 dark:border-bgmi-border hover:border-bgmi-red/50 shadow-md dark:shadow-lg',
    },
    {
      icon: Swords,
      value: totalMatches,
      label: 'Total Matches',
      color: 'text-sky-600 dark:text-bgmi-cyan',
      iconColor: 'text-sky-600 dark:text-bgmi-cyan',
      bg: 'bg-white border-slate-200 dark:bg-bgmi-surface/90 dark:border-bgmi-border hover:border-bgmi-cyan/50 shadow-md dark:shadow-lg',
    },
    {
      icon: Trophy,
      value: currentRound,
      label: 'Current Round',
      color: 'text-amber-600 dark:text-bgmi-gold',
      iconColor: 'text-amber-600 dark:text-bgmi-gold',
      bg: 'bg-white border-slate-200 dark:bg-bgmi-surface/90 dark:border-bgmi-border hover:border-bgmi-gold/50 shadow-md dark:shadow-lg',
    },
  ];

  return (
    <section className="py-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`relative border rounded-xl p-5 sm:p-6 clip-tactical overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${stat.bg}`}
            >
              <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-bgmi-dark border border-slate-200 dark:border-bgmi-border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className={`text-3xl sm:text-4xl ${stat.color}`}>
                    <AnimatedCounter target={stat.value} />
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
