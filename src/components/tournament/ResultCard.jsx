'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Flame, MapPin, Calendar, ArrowRight, User } from 'lucide-react';
import Badge from '../common/Badge';

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="bg-bgmi-surface hover:bg-bgmi-card border border-bgmi-border hover:border-bgmi-gold/50 rounded-xl p-5 transition-all duration-200 clip-tactical group shadow-lg">
      <div className="flex items-center justify-between gap-3 mb-4">
        <Badge variant="gold" size="sm">
          MATCH #{result.matchNumber} WINNER
        </Badge>
        <span className="text-xs font-semibold text-slate-400">{result.round}</span>
      </div>

      {/* Winner Showcase */}
      <div className="mb-4 p-4 bg-gradient-to-r from-bgmi-gold/15 via-bgmi-card to-bgmi-surface border border-bgmi-gold/40 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bgmi-dark p-1 border border-bgmi-gold flex items-center justify-center">
            <Trophy className="w-6 h-6 text-bgmi-gold animate-bounce" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-bgmi-gold">WWCD Champions</p>
            <h4 className="font-display font-black text-lg text-white group-hover:text-bgmi-gold transition-colors">
              {result.winner?.teamName || 'Team Alpha'}
            </h4>
          </div>
        </div>
        <div className="text-right">
          <span className="font-display font-black text-lg text-bgmi-cyan flex items-center justify-end gap-1">
            <Flame className="w-4 h-4" /> {result.winner?.kills !== undefined ? result.winner.kills : 12}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Kills</span>
        </div>
      </div>

      {/* MVP Fragger */}
      {result.mvp && (
        <div className="mb-4 flex items-center justify-between px-3 py-2 bg-bgmi-dark/70 rounded-lg border border-bgmi-border/40 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-bgmi-gold" /> Top Fragger MVP:
          </span>
          <span className="font-bold text-white">{result.mvp.name} ({result.mvp.kills} Kills)</span>
        </div>
      )}

      {/* Footer link */}
      <div className="pt-3 border-t border-bgmi-border/40 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-bgmi-cyan" /> Map: {result.map}
        </span>
        <Link
          href={`/results/${result.id}`}
          className="inline-flex items-center gap-1 font-bold text-bgmi-gold group-hover:translate-x-1 transition-transform"
        >
          Scorecard & Proof <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
