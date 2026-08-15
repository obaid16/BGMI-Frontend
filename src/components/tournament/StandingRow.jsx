'use client';

import React from 'react';
import Link from 'next/link';

export default function StandingRow({ standing }) {
  if (!standing) return null;

  const isTop1 = standing.rank === 1;
  const isTop3 = standing.rank <= 3;

  return (
    <tr className={`border-b border-slate-200 dark:border-bgmi-border/40 hover:bg-slate-100 dark:hover:bg-bgmi-dark/60 transition-colors text-xs font-semibold ${
      isTop1 ? 'bg-amber-500/10 dark:bg-bgmi-gold/10' : ''
    }`}>
      {/* RANK */}
      <td className="py-3.5 px-4 text-center font-display font-black text-sm">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${
          isTop1
            ? 'bg-amber-500 text-slate-950 shadow-md font-black'
            : isTop3
            ? 'bg-slate-200 dark:bg-bgmi-surface text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-bgmi-border'
            : 'text-slate-600 dark:text-slate-400'
        }`}>
          {standing.rank}
        </span>
      </td>

      {/* SQUAD NAME & COLLEGE */}
      <td className="py-3.5 px-4">
        <Link href={`/teams/${standing.shortName || standing.registrationId || standing.teamId}`} className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border flex items-center justify-center text-xs font-black text-bgmi-red group-hover:scale-105 transition-transform flex-shrink-0">
            {standing.logo ? (
              <img src={standing.logo} alt={standing.teamName} className="w-full h-full object-cover rounded-md" />
            ) : (
              standing.teamName?.charAt(0)
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white group-hover:text-bgmi-red transition-colors text-sm line-clamp-1">
              {standing.teamName}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{standing.collegeName || 'NIT Roster'}</p>
          </div>
        </Link>
      </td>

      {/* PLAYED */}
      <td className="py-3.5 px-4 text-center text-slate-700 dark:text-slate-300 font-mono">{standing.matches ?? standing.matchesPlayed ?? standing.played ?? 0}</td>

      {/* WWCD */}
      <td className="py-3.5 px-4 text-center font-bold text-amber-600 dark:text-bgmi-gold">
        {standing.wwcd > 0 ? `🍗 ${standing.wwcd}` : '0'}
      </td>

      {/* PLACEMENT PTS */}
      <td className="py-3.5 px-4 text-center text-slate-700 dark:text-slate-300 font-mono">{standing.placementPoints || 0}</td>

      {/* KILL PTS */}
      <td className="py-3.5 px-4 text-center text-sky-600 dark:text-bgmi-cyan font-mono font-bold">{standing.killPoints || standing.kills || 0}</td>

      {/* TOTAL PTS */}
      <td className="py-3.5 px-4 text-center font-display font-black text-sm text-slate-900 dark:text-white">
        {standing.totalPoints !== undefined ? standing.totalPoints : standing.points || 0}
      </td>
    </tr>
  );
}
