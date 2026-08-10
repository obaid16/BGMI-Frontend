'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Flame, ShieldAlert } from 'lucide-react';

export default function RankingCard({ standing }) {
  if (!standing) return null;

  const isTop3 = standing.rank <= 3;

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      standing.rank === 1
        ? 'bg-bgmi-surface/90 border-bgmi-gold/60 shadow-gold-glow'
        : isTop3
        ? 'bg-bgmi-surface/80 border-slate-500/40'
        : 'bg-bgmi-surface/60 border-bgmi-border/60'
    }`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-sm border ${
            standing.rank === 1
              ? 'bg-bgmi-gold text-slate-950 border-amber-300'
              : standing.rank === 2
              ? 'bg-slate-300 text-slate-950 border-white'
              : standing.rank === 3
              ? 'bg-amber-700 text-white border-amber-500'
              : 'bg-bgmi-dark text-slate-400 border-bgmi-border'
          }`}>
            #{standing.rank}
          </span>
          <Link href={`/teams/${standing.teamId}`}>
            <h4 className="font-display font-bold text-base text-white hover:text-bgmi-gold transition-colors">
              {standing.teamName}
            </h4>
          </Link>
        </div>

        <div className="text-right">
          <span className="font-display font-black text-base text-bgmi-gold block">
            {standing.totalPoints} PTS
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">
            {standing.matches || 8} Matches
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-bgmi-border/40 text-center text-xs">
        <div className="bg-bgmi-dark/60 p-2 rounded border border-bgmi-border/30">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">WWCD</span>
          <span className="font-display font-bold text-bgmi-gold flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3" /> {standing.wwcd || 0}
          </span>
        </div>
        <div className="bg-bgmi-dark/60 p-2 rounded border border-bgmi-border/30">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Kills</span>
          <span className="font-display font-bold text-bgmi-cyan flex items-center justify-center gap-1">
            <Flame className="w-3 h-3" /> {standing.kills || 0}
          </span>
        </div>
        <div className="bg-bgmi-dark/60 p-2 rounded border border-bgmi-border/30">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Placement</span>
          <span className="font-display font-bold text-white">
            {standing.placementPoints || 0} Pts
          </span>
        </div>
      </div>
    </div>
  );
}
