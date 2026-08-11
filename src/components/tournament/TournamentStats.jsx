'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Users, Swords, Trophy, Target } from 'lucide-react';

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
            // Ease-out cubic
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
      suffix: '',
      color: 'text-bgmi-gold',
      iconColor: 'text-bgmi-gold',
      bg: 'bg-bgmi-gold/10 border-bgmi-gold/30',
    },
    {
      icon: Target,
      value: verifiedPlayers,
      label: 'Verified Players',
      suffix: '',
      color: 'text-bgmi-cyan',
      iconColor: 'text-bgmi-cyan',
      bg: 'bg-bgmi-cyan/10 border-bgmi-cyan/30',
    },
    {
      icon: Swords,
      value: totalMatches,
      label: 'Total Matches',
      suffix: '',
      color: 'text-emerald-400',
      iconColor: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      icon: Trophy,
      value: currentRound,
      label: 'Current Round',
      suffix: '',
      color: 'text-amber-400',
      iconColor: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
    },
  ];

  return (
    <section className="py-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`relative bg-bgmi-surface border rounded-2xl p-5 sm:p-6 clip-tactical overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${stat.bg}`}
            >
              {/* Background texture */}
              <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-start gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.bg} flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className={`text-3xl sm:text-4xl ${stat.color}`}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
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
