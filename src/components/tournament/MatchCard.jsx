'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Radio, Trophy, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function MatchCard({ match }) {
  if (!match) return null;

  const isLive = match.status === 'Live';
  const isCompleted = match.status === 'Completed';

  return (
    <div className="bg-bgmi-surface hover:bg-bgmi-card border border-bgmi-border hover:border-bgmi-gold/50 rounded-xl p-5 transition-all duration-200 clip-tactical group shadow-lg">
      
      {/* Top Header info */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Badge variant={isLive ? 'live' : isCompleted ? 'green' : 'gold'} size="sm">
            {isLive ? '● LIVE' : isCompleted ? 'COMPLETED' : 'UPCOMING'}
          </Badge>
          <span className="text-xs font-bold text-slate-300">MATCH #{match.matchNumber}</span>
        </div>
        <span className="text-xs font-semibold text-bgmi-cyan bg-bgmi-cyan/10 px-2 py-0.5 rounded border border-bgmi-cyan/20">
          {match.map}
        </span>
      </div>

      {/* Map & Date info */}
      <div className="space-y-2 mb-5">
        <h3 className="font-display font-bold text-lg text-white group-hover:text-bgmi-gold transition-colors">
          Match #{match.matchNumber} — {match.map}
        </h3>
        
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-bgmi-gold" /> {match.map}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {match.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {match.time}
          </span>
        </div>
      </div>

      {/* Winner preview if completed */}
      {isCompleted && match.winner && (
        <div className="mb-4 p-3 bg-bgmi-dark/80 rounded-lg border border-bgmi-gold/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-bgmi-gold" />
            <span className="text-xs text-slate-400">Winner:</span>
            <span className="text-xs font-bold text-white">{match.winner.name}</span>
          </div>
          <span className="text-xs font-bold text-bgmi-gold">{match.winner.kills} Kills</span>
        </div>
      )}

      {/* Footer link */}
      <div className="pt-3 border-t border-bgmi-border/40 flex items-center justify-between text-xs">
        <span className="text-slate-400">All Squads Competing</span>
        <Link
          href={`/matches/${match.id}`}
          className="inline-flex items-center gap-1 font-bold text-bgmi-gold group-hover:translate-x-1 transition-transform"
        >
          Match Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
