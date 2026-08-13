'use client';

import React from 'react';
import Link from 'next/link';

export default function RankingCard({ standing }) {
  if (!standing) return null;

  const isTop1 = standing.rank === 1;

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isTop1
        ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
        : 'bg-white dark:bg-bgmi-surface/90 border-slate-200 dark:border-bgmi-border'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-sm ${
            isTop1
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-100 dark:bg-bgmi-dark text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-bgmi-border'
          }`}>
            #{standing.rank}
          </span>

          <div>
            <Link href={`/teams/${standing.teamId}`}>
              <h4 className="font-display font-black text-base text-slate-900 dark:text-white hover:text-bgmi-red transition-colors">
                {standing.teamName}
              </h4>
            </Link>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{standing.collegeName || 'NIT Roster'}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-display font-black text-lg text-slate-900 dark:text-white">
            {standing.totalPoints !== undefined ? standing.totalPoints : standing.points || 0} <span className="text-[10px] text-slate-500 font-normal">PTS</span>
          </p>
          <p className="text-[10px] text-amber-600 dark:text-bgmi-gold font-bold">
            {standing.wwcd > 0 ? `🍗 ${standing.wwcd} WWCD` : '0 WWCD'}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-bgmi-border/40 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <span className="text-[9px] text-slate-500 uppercase font-bold block">Matches</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{standing.matchesPlayed || standing.played || 4}</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 uppercase font-bold block">Placement</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{standing.placementPoints || 0}</span>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 uppercase font-bold block">Kills</span>
          <span className="font-bold text-sky-600 dark:text-bgmi-cyan">{standing.killPoints || standing.kills || 0}</span>
        </div>
      </div>
    </div>
  );
}
