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
    <div className="w-full space-y-6 my-6 font-sans">
      
      {/* #1 GOLD CHAMPION FULL-WIDTH FEATURE BANNER */}
      {first && (
        <div className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 rounded-2xl p-6 sm:p-8 clip-tactical shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              
              <div className="w-24 h-24 rounded-2xl bg-slate-950 p-1.5 border-4 border-slate-950 shadow-2xl flex items-center justify-center flex-shrink-0 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-950 text-amber-400 rounded-lg flex items-center justify-center font-black shadow-lg">
                  <Crown className="w-5 h-5" />
                </div>
                {first.logo ? (
                  <img src={first.logo} alt={first.teamName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="font-broadcast font-black text-4xl text-amber-400">{first.teamName?.charAt(0)}</span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] bg-slate-950 text-amber-400 px-3 py-1 rounded">
                  ★ OVERALL LEADERBOARD CHAMPION ★
                </span>
                <h3 className="font-broadcast font-black text-3xl sm:text-5xl uppercase tracking-tight text-slate-950 drop-shadow-md">
                  {first.teamName}
                </h3>
                <p className="text-xs font-mono font-bold text-slate-900">{first.collegeName || 'NIT BGMI ROSTER'}</p>
              </div>

            </div>

            {/* STATS BREAKDOWN */}
            <div className="flex items-center gap-4 bg-slate-950 text-white p-4 rounded-xl border border-slate-900 font-mono text-center">
              <div className="px-3">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">WWCD</span>
                <span className="font-broadcast font-black text-amber-400 text-xl">🍗 {first.wwcd || 0}</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-800" />
              <div className="px-3">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">KILLS</span>
                <span className="font-broadcast font-black text-sky-400 text-xl">{first.kills || first.killPoints || 0}</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-800" />
              <div className="px-3">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">TOTAL PTS</span>
                <span className="font-broadcast font-black text-white text-2xl">{first.totalPoints !== undefined ? first.totalPoints : first.points || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* #2 SILVER & #3 BRONZE SPLIT CONTENDER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* #2 SILVER */}
        {second && (
          <div className="bg-white dark:bg-[#121620] border-2 border-slate-300 dark:border-white/10 rounded-xl p-5 clip-tactical shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-broadcast font-black text-xl text-slate-400 px-3 py-1 bg-slate-100 dark:bg-[#0B0E14] border border-slate-300 dark:border-white/10 rounded">
                #02
              </span>
              <div>
                <span className="text-[9px] font-mono text-slate-500 font-bold uppercase block">RUNNER UP</span>
                <h4 className="font-broadcast font-black text-xl text-slate-900 dark:text-white uppercase">
                  {second.teamName}
                </h4>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="font-broadcast font-black text-xl text-slate-900 dark:text-white block">
                {second.totalPoints !== undefined ? second.totalPoints : second.points || 0} PTS
              </span>
              <span className="text-[10px] text-amber-500 font-bold">🍗 {second.wwcd || 0} WWCD</span>
            </div>
          </div>
        )}

        {/* #3 BRONZE */}
        {third && (
          <div className="bg-white dark:bg-[#121620] border-2 border-amber-800/40 rounded-xl p-5 clip-tactical shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-broadcast font-black text-xl text-amber-600 px-3 py-1 bg-slate-100 dark:bg-[#0B0E14] border border-amber-800/30 rounded">
                #03
              </span>
              <div>
                <span className="text-[9px] font-mono text-slate-500 font-bold uppercase block">3RD PLACE</span>
                <h4 className="font-broadcast font-black text-xl text-slate-900 dark:text-white uppercase">
                  {third.teamName}
                </h4>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="font-broadcast font-black text-xl text-slate-900 dark:text-white block">
                {third.totalPoints !== undefined ? third.totalPoints : third.points || 0} PTS
              </span>
              <span className="text-[10px] text-amber-500 font-bold">🍗 {third.wwcd || 0} WWCD</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
