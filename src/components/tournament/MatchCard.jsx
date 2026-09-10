'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MapPin, ChevronRight, Trophy, Users } from 'lucide-react';
import Badge from '../common/Badge';

export default function MatchCard({ match }) {
  if (!match) return null;

  const isLive = match.status === 'Live';
  const isUpcoming = match.status === 'Upcoming';
  const isCompleted = match.status === 'Completed' || match.status === 'Finished';

  const getTeamName = (t) => {
    if (!t) return null;
    if (typeof t === 'string') return t;
    if (typeof t === 'object') return t.teamName || t.name || t.shortName || null;
    return null;
  };

  const winnerName = getTeamName(match.winner) || match.winnerName || getTeamName(match.teamA) || 'Godlike Esports';
  const teamAName = getTeamName(match.teamA) || getTeamName(match.teams?.[0]) || null;
  const teamBName = getTeamName(match.teamB) || getTeamName(match.teams?.[1]) || null;

  return (
    <div className="w-full bg-premium-surface border border-premium-border hover:border-premium-text transition-all rounded-2xl p-4 shadow-sm flex flex-col gap-4 group">
      
      {/* LEFT: MATCH NUMBER & MAP */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-premium-surface-soft text-premium-text font-bold text-base sm:text-lg flex flex-col items-center justify-center rounded-xl flex-shrink-0">
          <span className="text-[9px] font-semibold text-premium-text-secondary uppercase tracking-widest leading-none mb-0.5">Match</span>
          <span className="leading-none">{String(match.matchNumber || 1).padStart(2, '0')}</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {isLive ? (
              <Badge variant="live" size="sm">Live</Badge>
            ) : isUpcoming ? (
              <Badge variant="cyan" size="sm">Upcoming</Badge>
            ) : (
              <Badge variant="default" size="sm">Completed</Badge>
            )}
            {match.round && !match.round.toLowerCase().includes('match') && (
              <span className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest">{match.round}</span>
            )}
          </div>
          <h4 className="font-bold text-base text-premium-text flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-premium-sage" /> {match.map || 'Erangel'}
          </h4>
        </div>
      </div>

      {/* CENTER: DYNAMIC CONTENT */}
      <div className="flex-1 bg-premium-background rounded-xl p-3 flex items-center justify-between border border-premium-border">
        
        {isUpcoming ? (
          <div className="w-full flex items-center justify-between px-2 text-premium-text-secondary whitespace-nowrap gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-xs">
              <Users className="w-4 h-4 text-premium-sage" /> {match.registeredSquadsCount ?? match.participatingSquads?.length ?? 4} Squads
            </span>
            <span className="text-[10px] font-bold text-premium-text uppercase tracking-widest">
              TPP SQUAD
            </span>
          </div>
        ) : isLive ? (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-premium-text text-sm truncate max-w-[100px]">
                {teamAName || 'Squad A'}
              </span>
              {match.killsA !== undefined && (
                <span className="px-2 py-0.5 bg-premium-surface text-premium-text font-semibold text-[11px] rounded-md border border-premium-border">
                  {match.killsA} Kills
                </span>
              )}
            </div>
            <span className="font-bold text-premium-text-secondary text-xs px-2">VS</span>
            <div className="flex items-center gap-2">
              {match.killsB !== undefined && (
                <span className="px-2 py-0.5 bg-premium-surface text-premium-text font-semibold text-[11px] rounded-md border border-premium-border">
                  {match.killsB} Kills
                </span>
              )}
              <span className="font-bold text-premium-text text-sm truncate max-w-[100px]">
                {teamBName || 'Squad B'}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div>
                <span className="text-[10px] text-premium-text-secondary block font-semibold uppercase tracking-widest">WWCD Winner</span>
                <span className="font-bold text-premium-text text-sm truncate max-w-[140px] block">
                  {winnerName}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 bg-premium-surface text-premium-text font-semibold text-xs rounded-md border border-premium-border block">
                {match.totalKills || match.kills || 18} Kills
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: TIME & CTA */}
      <div className="flex items-center justify-between gap-4 border-t pt-3 border-premium-border">
        <div className="text-right">
          <p className="font-semibold text-premium-text flex items-center justify-end gap-1.5 text-sm">
            <Clock className="w-4 h-4 text-premium-text-secondary" /> {match.time || '10:00 AM'}
          </p>
          <p className="text-xs text-premium-text-secondary font-medium mt-0.5">{match.date || '2026-09-02'}</p>
        </div>

        <Link
          href={`/matches/${match.matchNumber || match.id}`}
          className="px-4 py-2.5 bg-premium-surface-soft text-premium-text hover:bg-premium-text hover:text-white font-medium text-xs uppercase tracking-wide rounded-full transition-colors flex items-center gap-1 shrink-0 shadow-sm"
        >
          <span>{isUpcoming ? 'Details' : isLive ? 'Score' : 'Results'}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
