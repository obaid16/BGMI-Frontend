'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Clock, Swords, MapPin, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function MatchCard({ match }) {
  if (!match) return null;

  const isLive = match.status === 'Live';
  const isUpcoming = match.status === 'Upcoming';

  return (
    <div className="bg-white dark:bg-bgmi-surface/90 hover:bg-slate-50 dark:hover:bg-bgmi-card border border-slate-200 dark:border-bgmi-border hover:border-bgmi-red/60 rounded-2xl p-5 transition-all duration-200 clip-tactical group shadow-md dark:shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          {isLive ? (
            <Badge variant="live" size="sm">
              <Radio className="w-3 h-3 mr-1 inline animate-spin" /> LIVE
            </Badge>
          ) : isUpcoming ? (
            <Badge variant="cyan" size="sm">
              UPCOMING
            </Badge>
          ) : (
            <Badge variant="gold" size="sm">
              COMPLETED
            </Badge>
          )}

          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{match.round || 'Round 1'}</span>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="font-display font-black text-lg text-slate-900 dark:text-white group-hover:text-bgmi-red transition-colors">
            Match #{match.matchNumber} — {match.map}
          </h4>
          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-bgmi-red" /> {match.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-bgmi-cyan" /> {match.map}
            </span>
          </div>
        </div>

        <div className="p-3 bg-slate-100 dark:bg-bgmi-dark/90 rounded-xl border border-slate-200 dark:border-bgmi-border/60 text-xs flex items-center justify-between">
          <span className="text-slate-600 dark:text-slate-400 font-semibold">Lobby Capacity:</span>
          <span className="font-black text-slate-900 dark:text-white">24 Squads Slot</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-bgmi-border/40 flex items-center justify-between text-xs mt-4">
        <span className="text-[11px] font-bold text-amber-600 dark:text-bgmi-gold uppercase">
          {match.status === 'Completed' ? 'Scorecard Published' : 'Room ID Drops @ 10:15'}
        </span>
        <Link
          href={`/matches/${match.matchNumber || match.id}`}
          className="inline-flex items-center gap-1 font-bold text-bgmi-red group-hover:translate-x-1 transition-transform"
        >
          Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
