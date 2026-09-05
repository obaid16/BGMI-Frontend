'use client';

import React from 'react';
import Link from 'next/link';

export default function StandingRow({ standing }) {
  if (!standing) return null;

  const rankStr = String(standing.rank).padStart(2, '0');
  const isTop1 = standing.rank === 1;

  return (
    <tr className={`border-b border-[#E7E3DA] dark:border-[#1E2638] hover:bg-[#FAF8F5] dark:hover:bg-[#181E2C] transition-colors font-mono text-xs ${
      isTop1 ? 'bg-amber-500/5 dark:bg-amber-500/10' : ''
    }`}>
      {/* RANK */}
      <td className="py-3 px-4 text-center font-display font-black text-sm">
        <span className={`px-2 py-0.5 rounded-lg ${isTop1 ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500 dark:text-slate-400'}`}>
          {rankStr}
        </span>
      </td>

      {/* SQUAD NAME */}
      <td className="py-3 px-4 font-sans">
        <Link href={`/teams/${standing.shortName || standing.registrationId || standing.teamId}`} className="group flex items-center gap-2">
          <span className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-bgmi-red transition-colors uppercase">
            {standing.teamName}
          </span>
        </Link>
      </td>

      {/* MATCHES PLAYED */}
      <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
        {standing.matches ?? standing.matchesPlayed ?? standing.played ?? 4}
      </td>

      {/* WWCD */}
      <td className="py-3 px-4 text-center font-bold text-amber-600 dark:text-amber-400">
        {standing.wwcd || 0}
      </td>

      {/* PLACEMENT PTS */}
      <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">
        {standing.placementPoints || 0}
      </td>

      {/* KILL PTS */}
      <td className="py-3 px-4 text-center font-bold text-bgmi-red">
        {standing.killPoints || standing.kills || 0}
      </td>

      {/* TOTAL POINTS */}
      <td className="py-3 px-4 text-center font-display font-black text-sm text-slate-900 dark:text-white">
        {standing.totalPoints !== undefined ? standing.totalPoints : standing.points || 0}
      </td>
    </tr>
  );
}
