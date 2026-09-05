'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, MapPin, ArrowRight, User, CheckCircle2 } from 'lucide-react';

export default function ResultCard({ result }) {
  if (!result) return null;

  const matchNum = String(result.matchNumber || 1).padStart(2, '0');
  const winnerName = (typeof result.winner === 'string' ? result.winner : result.winner?.teamName || result.winner?.name) || result.winnerTeam || 'CHAMPION SQUAD';
  const winnerKills = result.winner?.kills !== undefined ? result.winner.kills : (result.totalKills || 0);
  const mvpName = (typeof result.mvp === 'string' ? result.mvp : result.mvp?.ign || result.mvp?.name) || result.mvpName || 'MVP Player';
  const mvpKills = result.mvp?.kills !== undefined ? result.mvp.kills : 0;

  return (
    <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 rounded-3xl p-5 sm:p-6 group shadow-editorial-sm hover:shadow-editorial flex flex-col justify-between font-sans space-y-4">
      
      {/* 1. MATCH NUMBER & STATUS HEADER */}
      <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-3">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-xs px-2.5 py-0.5 bg-slate-950 text-white rounded-lg">
            MATCH #{matchNum}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold uppercase rounded-full">
            <CheckCircle2 className="w-3 h-3 text-amber-500" /> COMPLETED
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold uppercase">
          {result.round || 'Grand Finals'}
        </span>
      </div>

      {/* 2. WINNER SHOWCASE */}
      <div className="p-4 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 border border-amber-400 flex items-center justify-center text-xl shrink-0 shadow-editorial font-display font-black">
            🍗
          </div>
          <div>
            <span className="text-[10px] font-mono font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider block">
              ★ WWCD VICTOR
            </span>
            <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1 group-hover:text-bgmi-red transition-colors">
              {winnerName}
            </h3>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="font-display font-black text-lg text-bgmi-red flex items-center justify-end gap-1">
            <Flame className="w-4 h-4 text-bgmi-red" /> {winnerKills}
          </span>
          <span className="text-[10px] font-mono text-slate-400 uppercase font-medium block">
            MATCH KILLS
          </span>
        </div>
      </div>

      {/* 3. MVP PLAYER INFO */}
      {result.mvp && (
        <div className="px-3.5 py-2 bg-white dark:bg-[#181E2C] rounded-xl border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 font-bold flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-500" /> MVP:
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {mvpName} <span className="text-bgmi-red">({mvpKills} Frags)</span>
          </span>
        </div>
      )}

      {/* 4. MAP & FOOTER CTA */}
      <div className="pt-3 border-t border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-bgmi-red" /> {result.map || 'Erangel'}
        </div>

        <Link
          href={`/results/${result.id || result.matchNumber}`}
          className="px-4 py-1.5 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 active:scale-95 shadow-editorial-sm"
        >
          <span>Scorecard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
