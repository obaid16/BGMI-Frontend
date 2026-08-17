'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Clock, MapPin, ChevronRight, Swords, Trophy, Users, Shield } from 'lucide-react';

export default function MatchCard({ match }) {
  if (!match) return null;

  const isLive = match.status === 'Live';
  const isUpcoming = match.status === 'Upcoming';
  const isCompleted = match.status === 'Completed' || match.status === 'Finished';

  // Dynamic winner or top teams safe extractors to prevent React object child errors
  const getTeamName = (t) => {
    if (!t) return null;
    if (typeof t === 'string') return t;
    if (typeof t === 'object') return t.teamName || t.name || t.shortName || null;
    return null;
  };

  const winnerName = getTeamName(match.winner) || match.winnerName || getTeamName(match.teamA) || 'GODLIKE ESPORTS';
  const teamAName = getTeamName(match.teamA) || getTeamName(match.teams?.[0]) || null;
  const teamBName = getTeamName(match.teamB) || getTeamName(match.teams?.[1]) || null;

  return (
    <div className="w-full bg-white dark:bg-[#121620] border-2 border-slate-200 dark:border-white/10 hover:border-bgmi-red transition-all rounded-xl p-4 clip-tactical shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-sans group">
      
      {/* LEFT: MATCH NUMBER & MAP ARENA */}
      <div className="flex items-center gap-4 min-w-[210px]">
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
                COMPLETED
              </span>
            )}
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">{match.round || 'Grand Finals'}</span>
          </div>
          <h4 className="font-broadcast font-black text-lg text-slate-900 dark:text-white uppercase flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-4 h-4 text-bgmi-red" /> {match.map || 'Erangel'}
          </h4>
        </div>
      </div>

      {/* CENTER: DYNAMIC MATCH CONTENT BASED ON STATUS */}
      <div className="flex-1 max-w-md bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-lg p-3 flex items-center justify-between font-mono text-xs">
        
        {isUpcoming ? (
          /* UPCOMING MATCH: SHOW SQUAD CAPACITY & FORMAT (NO KILLS OR FINAL SCORES) */
          <div className="w-full flex items-center justify-between px-2 text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 font-bold uppercase text-[11px]">
              <Users className="w-3.5 h-3.5 text-sky-400" /> 24 Registered Squads
            </span>
            <span className="text-[10px] font-bold text-amber-500 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              TPP Squad Battle Royale
            </span>
          </div>
        ) : isLive ? (
          /* LIVE MATCH: SHOW LIVE TEAM MATCHUP & CURRENT KILLS */
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white uppercase truncate max-w-[100px]">
                {teamAName || 'SQUAD A'}
              </span>
              {match.killsA !== undefined && (
                <span className="px-2 py-0.5 bg-bgmi-red/10 text-bgmi-red font-black text-[11px] rounded">
                  {match.killsA} KILLS
                </span>
              )}
            </div>
            <span className="font-broadcast font-black text-bgmi-red text-xs px-2 animate-pulse">VS</span>
            <div className="flex items-center gap-2">
              {match.killsB !== undefined && (
                <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 font-black text-[11px] rounded">
                  {match.killsB} KILLS
                </span>
              )}
              <span className="font-bold text-slate-900 dark:text-white uppercase truncate max-w-[100px]">
                {teamBName || 'SQUAD B'}
              </span>
            </div>
          </div>
        ) : (
          /* COMPLETED MATCH: SHOW WINNER SQUAD & SCORE SUMMARY */
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[9px] text-slate-400 block uppercase font-bold">WWCD VICTOR</span>
                <span className="font-broadcast font-black text-slate-900 dark:text-white uppercase text-sm truncate max-w-[140px] block">
                  {winnerName || 'GODLIKE ESPORTS'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 font-black text-xs rounded border border-amber-500/20 block">
                {match.totalKills || match.kills || 18} KILLS
              </span>
            </div>
          </div>
        )}

      </div>

      {/* RIGHT: TIME & SCORECARD LINK */}
      <div className="flex items-center justify-between md:justify-end gap-4 min-w-[190px] border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-white/10">
        <div className="text-right font-mono text-xs">
          <p className="font-bold text-slate-900 dark:text-white flex items-center justify-end gap-1">
            <Clock className="w-3.5 h-3.5 text-bgmi-red" /> {match.time || '10:00 AM'}
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase">{match.date || '2026-09-02'}</p>
        </div>

        <Link
          href={`/matches/${match.matchNumber || match.id}`}
          className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-broadcast font-bold text-xs uppercase tracking-wider rounded group-hover:bg-bgmi-red group-hover:text-white transition-colors flex items-center gap-1 shrink-0"
        >
          <span>{isUpcoming ? 'LOBBY INFO' : isLive ? 'LIVE SCORE' : 'VIEW SCORECARD'}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
