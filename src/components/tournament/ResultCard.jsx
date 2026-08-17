'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, MapPin, ArrowRight, User, Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';

export default function ResultCard({ result }) {
  if (!result) return null;

  const matchNum = String(result.matchNumber || 1).padStart(2, '0');
  const winnerName = result.winner?.teamName || result.winner?.name || result.winnerTeam || 'CHAMPION SQUAD';
  const winnerKills = result.winner?.kills !== undefined ? result.winner.kills : (result.totalKills || 14);
  const mvpName = result.mvp?.name || result.mvpName || 'Top Fragger';
  const mvpKills = result.mvp?.kills !== undefined ? result.mvp.kills : 5;

  return (
    <div className="bg-white dark:bg-[#121620] border-2 border-slate-200 dark:border-white/10 hover:border-bgmi-red transition-all duration-200 rounded-xl p-5 clip-tactical group shadow-md hover:shadow-xl flex flex-col justify-between font-sans space-y-4">
      
      {/* 1. MATCH NUMBER & STATUS HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-broadcast font-black text-sm px-2.5 py-0.5 bg-slate-900 text-white rounded border border-bgmi-red/40">
            MATCH #{matchNum}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase rounded">
            <CheckCircle2 className="w-3 h-3" /> COMPLETED
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold uppercase">
          {result.round || 'Grand Finals'}
        </span>
      </div>

      {/* 2. WINNER SHOWCASE (MOST PROMINENT IN HIERARCHY) */}
      <div className="p-4 bg-slate-50 dark:bg-[#0B0E14] border border-amber-500/40 rounded-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-slate-900 text-amber-400 border border-amber-500 flex items-center justify-center text-xl shrink-0 shadow-md font-broadcast font-black">
            🍗
          </div>
          <div>
            <span className="text-[9px] font-mono font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider block">
              ★ WWCD VICTOR
            </span>
            <h3 className="font-broadcast font-black text-lg sm:text-xl text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1 group-hover:text-bgmi-red transition-colors">
              {winnerName}
            </h3>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="font-broadcast font-black text-lg text-sky-600 dark:text-sky-400 flex items-center justify-end gap-1">
            <Flame className="w-4 h-4 text-sky-600 dark:text-sky-400" /> {winnerKills}
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold block">
            MATCH KILLS
          </span>
        </div>
      </div>

      {/* 3. MVP PLAYER INFO */}
      {result.mvp && (
        <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-900/80 rounded-lg border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-600 dark:text-slate-400 font-bold flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-500" /> MVP FRAGGER:
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {mvpName} <span className="text-bgmi-red">({mvpKills} Frags)</span>
          </span>
        </div>
      )}

      {/* 4. MAP & FOOTER CTA */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-bgmi-red" /> {result.map || 'Erangel'}
          </span>
          {result.date && (
            <span className="hidden sm:flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3" /> {result.date}
            </span>
          )}
        </div>

        <Link
          href={`/results/${result.id || result.matchNumber}`}
          className="px-4 py-1.5 bg-bgmi-red hover:bg-bgmi-red-hover text-white font-broadcast font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1 active:scale-95"
        >
          <span>VIEW SCORECARD</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
