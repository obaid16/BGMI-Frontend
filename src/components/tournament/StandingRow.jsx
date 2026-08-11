'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Flame } from 'lucide-react';

export default function StandingRow({ standing }) {
  if (!standing) return null;

  const isTop3 = standing.rank <= 3;
  const rankColors = {
    1: 'text-bgmi-gold font-black bg-bgmi-gold/10 border-bgmi-gold/40 shadow-gold-glow',
    2: 'text-slate-200 font-black bg-slate-400/10 border-slate-400/40',
    3: 'text-amber-600 font-black bg-amber-700/10 border-amber-700/40',
  };

  return (
    <tr
      className={`border-b border-bgmi-border/40 hover:bg-bgmi-surface/80 transition-colors ${
        isTop3 ? 'bg-bgmi-card/40' : ''
      }`}
    >
      {/* RANK */}
      <td className="py-4 px-4 text-center">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm ${
            rankColors[standing.rank] || 'text-slate-400 border-bgmi-border/60 bg-bgmi-dark/40 font-bold'
          }`}
        >
          {standing.rank}
        </span>
      </td>

      {/* TEAM */}
      <td className="py-4 px-4">
        <Link href={`/teams/${standing.teamId}`} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-bgmi-dark border border-bgmi-border overflow-hidden p-1 flex items-center justify-center flex-shrink-0 group-hover:border-bgmi-gold transition-colors">
            <img src={standing.logo} alt={standing.teamName} className="w-full h-full object-cover rounded" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-white group-hover:text-bgmi-gold transition-colors">
              {standing.teamName}
            </p>
          </div>
        </Link>
      </td>

      {/* MATCHES */}
      <td className="py-4 px-4 text-center text-xs font-semibold text-slate-300">
        {standing.matches !== undefined ? standing.matches : 0}
      </td>

      {/* WWCD */}
      <td className="py-4 px-4 text-center">
        <span className="inline-flex items-center gap-1 font-display font-bold text-xs text-bgmi-gold">
          <span className="text-sm">🍗</span> {standing.wwcd || 0}
        </span>
      </td>

      {/* PLACEMENT POINTS */}
      <td className="py-4 px-4 text-center text-xs font-semibold text-slate-300">
        {standing.placementPoints || 0}
      </td>

      {/* KILL POINTS */}
      <td className="py-4 px-4 text-center text-xs font-semibold text-slate-300">
        {standing.killPoints || 0}
      </td>

      {/* TOTAL POINTS */}
      <td className="py-4 px-4 text-center">
        <span
          className={`font-display font-black text-sm px-3 py-1 rounded ${
            standing.rank === 1
              ? 'bg-bgmi-gold text-slate-950 shadow-gold-glow'
              : 'bg-bgmi-dark text-white border border-bgmi-border'
          }`}
        >
          {standing.totalPoints || 0} PTS
        </span>
      </td>
    </tr>
  );
}
