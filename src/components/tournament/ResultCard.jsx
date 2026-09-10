'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, MapPin, ArrowRight, User, Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';

export default function ResultCard({ result }) {
  if (!result) return null;

  const matchNum = String(result.matchNumber || 1).padStart(2, '0');
  const winnerName = (typeof result.winner === 'string' ? result.winner : result.winner?.teamName || result.winner?.name) || result.winnerTeam || 'CHAMPION SQUAD';
  const winnerKills = result.winner?.kills !== undefined ? result.winner.kills : (result.totalKills || 14);
  const mvpName = (typeof result.mvp === 'string' ? result.mvp : result.mvp?.ign || result.mvp?.name) || result.mvpName || 'Top Fragger';
  const mvpKills = result.mvp?.kills !== undefined ? result.mvp.kills : 5;

  return (
    <div className="bg-premium-surface border border-premium-border hover:border-premium-text transition-all duration-300 rounded-[24px] p-6 sm:p-8 group shadow-sm hover:shadow-premium-float flex flex-col justify-between space-y-6">
      
      {/* 1. MATCH NUMBER & STATUS HEADER */}
      <div className="flex items-center justify-between border-b border-premium-border pb-4">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm px-3.5 py-1.5 bg-premium-background text-premium-text rounded-lg border border-premium-border">
            Match #{matchNum}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold uppercase tracking-widest rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        </div>
        <span className="text-[11px] font-semibold text-premium-text-secondary uppercase tracking-widest">
          {result.round || 'Grand Finals'}
        </span>
      </div>

      {/* 2. WINNER SHOWCASE (MOST PROMINENT IN HIERARCHY) */}
      <div className="p-5 bg-premium-background border border-amber-200 rounded-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-2xl shrink-0 shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-600 tracking-widest block mb-1">
              WWCD Victor
            </span>
            <h3 className="font-bold text-xl sm:text-2xl text-premium-text uppercase tracking-tight line-clamp-1 group-hover:text-black transition-colors">
              {winnerName}
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-premium-border pt-3 sm:pt-0 sm:pl-5">
          <span className="font-bold text-2xl text-premium-sage flex items-center justify-start sm:justify-end gap-1.5">
            <Flame className="w-5 h-5 text-premium-sage" /> {winnerKills}
          </span>
          <span className="text-[10px] text-premium-text-secondary uppercase font-semibold tracking-widest block mt-0.5">
            Match Kills
          </span>
        </div>
      </div>

      {/* 3. MVP PLAYER INFO */}
      {result.mvp && (
        <div className="px-5 py-3.5 bg-premium-surface-soft rounded-[12px] border border-premium-border flex flex-wrap items-center justify-between text-sm">
          <span className="text-premium-text-secondary font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-amber-500" /> Match MVP:
          </span>
          <span className="font-bold text-premium-text">
            {mvpName} <span className="text-premium-text-secondary font-medium text-xs ml-1">({mvpKills} Frags)</span>
          </span>
        </div>
      )}

      {/* 4. MAP & FOOTER CTA */}
      <div className="pt-4 border-t border-premium-border flex items-center justify-between text-sm font-medium">
        <div className="flex items-center gap-4 text-premium-text-secondary">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> {result.map || 'Erangel'}
          </span>
          {result.date && (
            <span className="hidden sm:flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {result.date}
            </span>
          )}
        </div>

        <Link
          href={`/results/${result.id || result.matchNumber}`}
          className="px-5 py-2 bg-premium-text text-white text-[11px] font-semibold uppercase tracking-widest rounded-lg hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <span>View Scorecard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
