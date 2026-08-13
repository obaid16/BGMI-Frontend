'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Flame, Crown } from 'lucide-react';

export default function Top3Leaderboard({ standings = [] }) {
  const top3 = standings.slice(0, 3);
  if (top3.length === 0) return null;

  const [first, second, third] = [
    top3[0] || null,
    top3[1] || null,
    top3[2] || null
  ];

  return (
    <div className="w-full space-y-6 py-4 my-2">
      
      {/* 3D STAGE PODIUM ARENA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end max-w-5xl mx-auto">

        {/* #2 SILVER PODIUM (LEFT STAGE) */}
        {second ? (
          <div className="order-2 md:order-1 relative bg-white dark:bg-bgmi-surface/95 border-2 border-slate-300 dark:border-slate-400/80 rounded-2xl p-6 clip-tactical shadow-lg dark:shadow-xl flex flex-col justify-between group hover:border-slate-400 dark:hover:border-white transition-all">
            
            <div className="space-y-4 text-center">
              {/* Stage Rank Badge inside padding flow */}
              <div className="inline-flex items-center justify-center gap-1 px-4 py-1.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-display font-black text-xs uppercase tracking-wider shadow-sm">
                RANK #2 • SILVER
              </div>

              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-bgmi-dark border-2 border-slate-300 p-1 mx-auto flex items-center justify-center flex-shrink-0 shadow-md">
                {second.logo ? (
                  <img src={second.logo} alt={second.teamName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="font-display font-black text-2xl text-slate-700 dark:text-slate-300">{second.teamName?.charAt(0)}</span>
                )}
              </div>

              <div>
                <h4 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">
                  {second.teamName}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">{second.collegeName || 'NIT Roster'}</p>
              </div>

              {/* Stats Split Grid */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-bgmi-dark/90 rounded-xl p-3 text-center border border-slate-200 dark:border-bgmi-border/60 text-xs">
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">WWCD</p>
                  <p className="font-black text-slate-800 dark:text-slate-200 text-sm">🍗 {second.wwcd || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Kills</p>
                  <p className="font-black text-sky-600 dark:text-bgmi-cyan text-sm">{second.kills || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Points</p>
                  <p className="font-black text-slate-900 dark:text-white text-sm">{second.totalPoints || second.points || 0}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-bgmi-border/40 text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                SILVER CONTENDER SPOTLIGHT
              </span>
            </div>
          </div>
        ) : null}

        {/* #1 GOLD CHAMPION PODIUM (CENTER OVERSIZED STAGE) */}
        {first ? (
          <div className="order-1 md:order-2 relative bg-white dark:bg-gradient-to-b dark:from-bgmi-red/25 dark:via-bgmi-surface dark:to-bgmi-surface border-2 border-amber-500 dark:border-bgmi-gold rounded-2xl p-7 clip-tactical shadow-gold-glow flex flex-col justify-between group hover:border-amber-400 transition-all z-20 scale-105">
            
            <div className="space-y-4 text-center">
              {/* Champion Badge inside padding flow */}
              <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 dark:bg-bgmi-gold text-slate-950 font-display font-black text-xs uppercase tracking-widest shadow-gold-glow">
                <Crown className="w-4 h-4 fill-slate-950" /> #1 GOLD CHAMPION
              </div>

              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-bgmi-dark border-2 border-amber-500 dark:border-bgmi-gold p-1.5 mx-auto flex items-center justify-center flex-shrink-0 shadow-gold-glow relative">
                {first.logo ? (
                  <img src={first.logo} alt={first.teamName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="font-display font-black text-3xl text-amber-600 dark:text-bgmi-gold">{first.teamName?.charAt(0)}</span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-black text-amber-600 dark:text-bgmi-gold uppercase tracking-[0.2em] block">
                  LEADERBOARD CHAMPION
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">
                  {first.teamName}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">{first.collegeName || 'NIT Roster'}</p>
              </div>

              {/* Champion Points Display */}
              <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-bgmi-dark/95 rounded-xl p-3.5 text-center border border-amber-400/40 dark:border-bgmi-gold/40 text-xs">
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">WWCD</p>
                  <p className="font-black text-amber-600 dark:text-bgmi-gold text-base">🍗 {first.wwcd || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Kills</p>
                  <p className="font-black text-sky-600 dark:text-bgmi-cyan text-base">{first.kills || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Total Pts</p>
                  <p className="font-black text-slate-900 dark:text-white text-base">{first.totalPoints || first.points || 0}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-300 dark:border-bgmi-gold/40 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-bgmi-gold">
                GOLD LEADERBOARD SPOTLIGHT
              </span>
            </div>
          </div>
        ) : null}

        {/* #3 BRONZE PODIUM (RIGHT STAGE) */}
        {third ? (
          <div className="order-3 relative bg-white dark:bg-bgmi-surface/95 border-2 border-amber-600 dark:border-amber-700/80 rounded-2xl p-6 clip-tactical shadow-lg dark:shadow-xl flex flex-col justify-between group hover:border-amber-500 transition-all">
            
            <div className="space-y-4 text-center">
              {/* Stage Rank Badge inside padding flow */}
              <div className="inline-flex items-center justify-center gap-1 px-4 py-1.5 rounded-full bg-amber-700 text-amber-100 font-display font-black text-xs uppercase tracking-wider shadow-sm">
                RANK #3 • BRONZE
              </div>

              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-bgmi-dark border-2 border-amber-600 p-1 mx-auto flex items-center justify-center flex-shrink-0 shadow-md">
                {third.logo ? (
                  <img src={third.logo} alt={third.teamName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="font-display font-black text-2xl text-amber-600 dark:text-amber-500">{third.teamName?.charAt(0)}</span>
                )}
              </div>

              <div>
                <h4 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">
                  {third.teamName}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">{third.collegeName || 'NIT Roster'}</p>
              </div>

              {/* Stats Split Grid */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-bgmi-dark/90 rounded-xl p-3 text-center border border-slate-200 dark:border-bgmi-border/60 text-xs">
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">WWCD</p>
                  <p className="font-black text-amber-600 dark:text-amber-500 text-sm">🍗 {third.wwcd || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Kills</p>
                  <p className="font-black text-sky-600 dark:text-bgmi-cyan text-sm">{third.kills || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Points</p>
                  <p className="font-black text-slate-900 dark:text-white text-sm">{third.totalPoints || third.points || 0}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-bgmi-border/40 text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                BRONZE CONTENDER SPOTLIGHT
              </span>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
}
