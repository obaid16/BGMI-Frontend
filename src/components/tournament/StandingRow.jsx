'use client';

import React from 'react';
import Link from 'next/link';

export default function StandingRow({ standing }) {
  if (!standing) return null;

  const rankStr = String(standing.rank).padStart(2, '0');
  const isTop1 = standing.rank === 1;

  return (
    <tr className={`border-b border-premium-border hover:bg-premium-surface-soft transition-colors text-sm ${
      isTop1 ? 'bg-amber-50/50' : ''
    }`}>
      {/* RANK */}
      <td className="py-4 px-6 text-center font-bold">
        <span className={`px-2.5 py-1 rounded-md ${isTop1 ? 'bg-amber-100 text-amber-700' : 'text-premium-text-secondary'}`}>
          {rankStr}
        </span>
      </td>

      {/* SQUAD NAME */}
      <td className="py-4 px-6">
        <Link href={`/teams/${standing.shortName || standing.registrationId || standing.teamId}`} className="group flex items-center gap-2">
          <span className="font-semibold text-premium-text group-hover:text-black transition-colors">
            {standing.teamName}
          </span>
        </Link>
      </td>

      {/* MATCHES PLAYED */}
      <td className="py-4 px-6 text-center font-medium text-premium-text-secondary">
        {standing.matches ?? standing.matchesPlayed ?? standing.played ?? 4}
      </td>

      {/* WWCD */}
      <td className="py-4 px-6 text-center font-medium text-premium-text">
        {standing.wwcd || 0}
      </td>

      {/* PLACEMENT PTS */}
      <td className="py-4 px-6 text-center text-premium-text-secondary">
        {standing.placementPoints || 0}
      </td>

      {/* KILL PTS */}
      <td className="py-4 px-6 text-center font-medium text-premium-text-secondary">
        {standing.killPoints || standing.kills || 0}
      </td>

      {/* TOTAL POINTS */}
      <td className="py-4 px-6 text-center font-bold text-premium-text">
        {standing.totalPoints !== undefined ? standing.totalPoints : standing.points || 0}
      </td>
    </tr>
  );
}
