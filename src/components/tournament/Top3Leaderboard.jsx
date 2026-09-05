'use client';

import React from 'react';
import { Crown, Trophy, Flame } from 'lucide-react';

export default function Top3Leaderboard({ standings = [] }) {
  const top3 = standings.slice(0, 3);
  if (top3.length === 0) return null;

  const [first, second, third] = [
    top3[0] || null,
    top3[1] || null,
    top3[2] || null
  ];

  return (
    <div className="w-full space-y-4 my-6 font-sans">
      
      {/* #1 GOLD CHAMPION FEATURE CARD */}
      {first && (
        <div className="relative bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 rounded-3xl p-6 sm:p-8 shadow-editorial-lg overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 p-1.5 border-2 border-slate-950 shadow-editorial flex items-center justify-center shrink-0 relative">
                <div className="absolute -top-2.5 -left-2.5 w-8 h-8 bg-slate-950 text-amber-400 rounded-xl flex items-center justify-center font-black shadow-md">
                  <Crown className="w-4 h-4" />
                </div>
                {first.logo ? (
                  <img src={first.logo} alt={first.teamName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="font-display font-black text-3xl sm:text-4xl text-amber-400">{first.teamName?.charAt(0)}</span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-slate-950 text-amber-400 px-3 py-1 rounded-full inline-block">
                  ★ LEADERBOARD CHAMPION ★
                </span>
                <h3 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-slate-950">
                  {first.teamName}
                </h3>
                <p className="text-xs font-mono font-bold text-slate-900">{first.collegeName || 'NEXCORE BGMI ROSTER'}</p>
              </div>

            </div>

            {/* STATS PILL */}
            <div className="flex items-center gap-3 bg-slate-950 text-white p-3.5 sm:p-4 rounded-2xl border border-slate-900 font-mono text-center shadow-editorial">
              <div className="px-3">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">WWCD</span>
                <span className="font-display font-black text-amber-400 text-lg sm:text-xl">🍗 {first.wwcd || 0}</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="px-3">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">KILLS</span>
                <span className="font-display font-black text-red-400 text-lg sm:text-xl">{first.kills || first.killPoints || 0}</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="px-3">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">TOTAL</span>
                <span className="font-display font-black text-white text-xl sm:text-2xl">{first.totalPoints !== undefined ? first.totalPoints : first.points || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* #2 SILVER & #3 BRONZE CONTENDER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* #2 SILVER */}
        {second && (
          <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl p-5 shadow-editorial-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-display font-black text-base text-slate-600 dark:text-slate-300 px-3 py-1 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl">
                #02
              </span>
              <div>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">RUNNER UP</span>
                <h4 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">
                  {second.teamName}
                </h4>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="font-display font-black text-lg text-slate-900 dark:text-white block">
                {second.totalPoints !== undefined ? second.totalPoints : second.points || 0} PTS
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">🍗 {second.wwcd || 0} WWCD</span>
            </div>
          </div>
        )}

        {/* #3 BRONZE */}
        {third && (
          <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl p-5 shadow-editorial-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-display font-black text-base text-amber-700 dark:text-amber-500 px-3 py-1 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl">
                #03
              </span>
              <div>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">3RD PLACE</span>
                <h4 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">
                  {third.teamName}
                </h4>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="font-display font-black text-lg text-slate-900 dark:text-white block">
                {third.totalPoints !== undefined ? third.totalPoints : third.points || 0} PTS
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">🍗 {third.wwcd || 0} WWCD</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
