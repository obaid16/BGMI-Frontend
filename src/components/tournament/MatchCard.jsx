'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Clock, MapPin, ChevronRight, Swords } from 'lucide-react';

export default function MatchCard({ match }) {
  if (!match) return null;

  const isLive = match.status === 'Live';
  const isUpcoming = match.status === 'Upcoming';

  return (
    <div className="w-full bg-white dark:bg-[#121620] border-2 border-slate-200 dark:border-white/10 hover:border-bgmi-red transition-all rounded-xl p-4 clip-tactical shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-sans group">
      
      {/* LEFT MATCH IDENTITY & MAP */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <div className="w-12 h-12 bg-slate-900 text-white font-broadcast font-black text-sm flex flex-col items-center justify-center rounded border border-bgmi-red/40 flex-shrink-0">
          <span className="text-[9px] font-mono text-bgmi-red leading-none">MATCH</span>
          <span className="text-base text-white leading-none mt-0.5">#{String(match.matchNumber || 1).padStart(2, '0')}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="px-2 py-0.5 bg-bgmi-red text-white text-[9px] font-mono font-bold uppercase rounded animate-pulse">
                ● LIVE
              </span>
            ) : isUpcoming ? (
              <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[9px] font-mono font-bold uppercase rounded">
                UPCOMING
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold uppercase rounded">
                FINISHED
              </span>
            )}
            <span className="text-xs font-mono text-slate-500 uppercase font-bold">{match.round || 'Grand Finals'}</span>
          </div>
          <h4 className="font-broadcast font-black text-lg text-slate-900 dark:text-white uppercase flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-4 h-4 text-bgmi-red" /> {match.map || 'Erangel'}
          </h4>
        </div>
      </div>

      {/* CENTER MATCHUP DISPLAY WITH KILL TALLIES */}
      <div className="flex-1 max-w-md bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-lg p-3 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-white uppercase truncate max-w-[110px]">
            {match.teamA || 'GODLIKE'}
          </span>
          <span className="px-2 py-0.5 bg-bgmi-red/10 text-bgmi-red font-black text-[11px] rounded">
            {match.killsA || 18} KILLS
          </span>
        </div>

        <span className="font-broadcast font-black text-slate-400 text-xs px-2">VS</span>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 font-black text-[11px] rounded">
            {match.killsB || 14} KILLS
          </span>
          <span className="font-bold text-slate-900 dark:text-white uppercase truncate max-w-[110px]">
            {match.teamB || 'SOUL'}
          </span>
        </div>
      </div>

      {/* RIGHT TIME & DETAILS TRIGGER */}
      <div className="flex items-center justify-between md:justify-end gap-4 min-w-[180px] border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-white/10">
        <div className="text-right font-mono text-xs">
          <p className="font-bold text-slate-900 dark:text-white flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5 text-bgmi-red" /> {match.time || '20:30'}
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase">{match.status || 'Finished'}</p>
        </div>

        <Link
          href={`/matches/${match.matchNumber || match.id}`}
          className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-broadcast font-bold text-xs uppercase tracking-wider rounded group-hover:bg-bgmi-red group-hover:text-white transition-colors flex items-center gap-1"
        >
          <span>SCORECARD</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
