'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function RankingCard({ standing }) {
  if (!standing) return null;

  const isTop1 = standing.rank === 1;

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      isTop1
        ? 'bg-amber-50/50 border-amber-200 shadow-sm'
        : 'bg-premium-surface border-premium-border shadow-sm hover:shadow-premium-float'
    }`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
            isTop1
              ? 'bg-amber-100 text-amber-700'
              : 'bg-premium-surface-soft text-premium-text-secondary border border-premium-border'
          }`}>
            #{standing.rank}
          </span>

          <div>
            <Link href={`/teams/${standing.shortName || standing.registrationId || standing.teamId}`}>
              <h4 className="font-bold text-base text-premium-text hover:text-black transition-colors">
                {standing.teamName}
              </h4>
            </Link>
            <p className="text-xs text-premium-text-secondary font-medium mt-0.5">{standing.collegeName || 'Nexcore Roster'}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-bold text-xl text-premium-text">
            {standing.totalPoints !== undefined ? standing.totalPoints : standing.points || 0} <span className="text-[10px] text-premium-text-secondary font-semibold uppercase tracking-widest">Pts</span>
          </p>
          <p className="text-[11px] text-amber-600 font-semibold mt-0.5 flex items-center justify-end gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500 inline" />
            <span>{standing.wwcd || 0} WWCD</span>
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-premium-border grid grid-cols-3 gap-3 text-center text-sm">
        <div>
          <span className="text-[10px] text-premium-text-secondary uppercase font-semibold block mb-0.5">Matches</span>
          <span className="font-medium text-premium-text">{standing.matchesPlayed || standing.played || 4}</span>
        </div>
        <div>
          <span className="text-[10px] text-premium-text-secondary uppercase font-semibold block mb-0.5">Placement</span>
          <span className="font-medium text-premium-text">{standing.placementPoints || 0}</span>
        </div>
        <div>
          <span className="text-[10px] text-premium-text-secondary uppercase font-semibold block mb-0.5">Kills</span>
          <span className="font-bold text-premium-sage">{standing.killPoints || standing.kills || 0}</span>
        </div>
      </div>
    </div>
  );
}
