'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, MapPin, ArrowRight, User } from 'lucide-react';
import Badge from '../common/Badge';

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="bg-white dark:bg-bgmi-surface/90 hover:bg-slate-50 dark:hover:bg-bgmi-card border border-slate-200 dark:border-bgmi-border hover:border-bgmi-red/60 rounded-2xl p-5 transition-all duration-200 clip-tactical group shadow-md dark:shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <Badge variant="gold" size="sm">
            MATCH #{result.matchNumber} WINNER
          </Badge>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{result.round || 'Finals'}</span>
        </div>

        {/* Winner Showcase */}
        <div className="mb-4 p-4 bg-gradient-to-r from-bgmi-red/15 via-slate-100 to-white dark:via-bgmi-surface dark:to-bgmi-dark border border-bgmi-red/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-bgmi-dark p-1 border border-bgmi-gold flex items-center justify-center text-xl flex-shrink-0 shadow-gold-glow">
              🍗
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold text-amber-600 dark:text-bgmi-gold tracking-widest">WWCD CHAMPIONS</p>
              <h4 className="font-display font-black text-lg text-slate-900 dark:text-white group-hover:text-bgmi-red transition-colors line-clamp-1">
                {result.winner?.teamName || result.winner?.name || 'Winner Squad'}
              </h4>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="font-display font-black text-lg text-sky-600 dark:text-bgmi-cyan flex items-center justify-end gap-1">
              <Flame className="w-4 h-4 text-sky-600 dark:text-bgmi-cyan" /> {result.winner?.kills !== undefined ? result.winner.kills : 12}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total Kills</span>
          </div>
        </div>

        {/* MVP Fragger */}
        {result.mvp && (
          <div className="mb-4 flex items-center justify-between px-3.5 py-2.5 bg-slate-100 dark:bg-bgmi-dark/90 rounded-lg border border-slate-200 dark:border-bgmi-border/60 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600 dark:text-bgmi-gold" /> Top Fragger MVP:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{result.mvp.name} ({result.mvp.kills} Kills)</span>
          </div>
        )}
      </div>

      {/* Footer link */}
      <div className="pt-3 border-t border-slate-200 dark:border-bgmi-border/40 flex items-center justify-between text-xs mt-2">
        <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-bgmi-red" /> Map: {result.map}
        </span>
        <Link
          href={`/results/${result.id}`}
          className="inline-flex items-center gap-1 font-bold text-bgmi-red group-hover:translate-x-1 transition-transform"
        >
          Scorecard <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
