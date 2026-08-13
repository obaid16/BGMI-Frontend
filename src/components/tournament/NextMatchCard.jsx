'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radio, Clock, Swords, Shield, ChevronRight } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function NextMatchCard({ match }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!match) return null;

  const isLive = match.status === 'Live';

  return (
    <div className="relative overflow-hidden bg-white dark:bg-bgmi-surface/95 border-2 border-bgmi-red/60 rounded-2xl p-6 sm:p-8 clip-tactical shadow-lg dark:shadow-red-glow">
      <div className="absolute inset-0 bg-tactical-grid opacity-30 pointer-events-none" />

      {/* MATCH SPOTLIGHT HEADER */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-bgmi-border/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          {isLive ? (
            <Badge variant="live" size="md">
              <span className="flex items-center gap-1.5 font-black">
                <Radio className="w-3.5 h-3.5 animate-spin" /> ● LIVE BROADCAST
              </span>
            </Badge>
          ) : (
            <Badge variant="gold" size="md">
              SPOTLIGHT BATTLE
            </Badge>
          )}
          <span className="font-display font-black text-sm text-slate-900 dark:text-white uppercase">
            MATCH #{match.matchNumber || 4} — <span className="text-bgmi-red">{match.map || 'Erangel'}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-bgmi-red" /> {match.time || '10:30 AM'}
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-bgmi-gold" /> {match.round || 'Grand Finals'}
          </span>
        </div>
      </div>

      {/* BROADCAST VS MATCHUP WINGS COMPOSITION */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-4">
        
        {/* TEAM A WING (5 COLS) */}
        <div className="md:col-span-5 p-4 bg-slate-100 dark:bg-bgmi-dark/90 rounded-2xl border border-slate-200 dark:border-bgmi-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-bgmi-surface border-2 border-bgmi-red p-1 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="font-display font-black text-xl text-bgmi-red">T1</span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-amber-600 dark:text-bgmi-gold uppercase tracking-widest">TOP SEED</p>
              <h4 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">TEAM ALPHA</h4>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">NIT Department Roster</p>
            </div>
          </div>
          <span className="text-sm font-black text-sky-600 dark:text-bgmi-cyan font-mono">Rank #1</span>
        </div>

        {/* VS CENTER EMBLEM (2 COLS) */}
        <div className="md:col-span-2 flex flex-col items-center justify-center my-2 md:my-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bgmi-red to-amber-500 text-white font-display font-black text-base flex items-center justify-center shadow-red-glow rotate-[-6deg]">
            VS
          </div>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">LOBBY BATTLE</span>
        </div>

        {/* TEAM B WING (5 COLS) */}
        <div className="md:col-span-5 p-4 bg-slate-100 dark:bg-bgmi-dark/90 rounded-2xl border border-slate-200 dark:border-bgmi-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-bgmi-surface border-2 border-sky-500 dark:border-bgmi-cyan p-1 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="font-display font-black text-xl text-sky-600 dark:text-bgmi-cyan">T2</span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-sky-600 dark:text-bgmi-cyan uppercase tracking-widest">CHALLENGER</p>
              <h4 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase">APEX PREDATORS</h4>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">NIT Department Roster</p>
            </div>
          </div>
          <span className="text-sm font-black text-amber-600 dark:text-bgmi-gold font-mono">Rank #2</span>
        </div>

      </div>

      {/* FOOTER COUNTDOWN & ACTION STRIP */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-200 dark:border-bgmi-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Ticking Timer */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">LOBBY LAUNCH:</span>
          <div className="flex items-center gap-1.5 font-display font-black text-lg text-bgmi-red">
            <span className="bg-slate-100 dark:bg-bgmi-dark px-2 py-0.5 rounded border border-slate-300 dark:border-bgmi-border text-slate-900 dark:text-white">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span>:</span>
            <span className="bg-slate-100 dark:bg-bgmi-dark px-2 py-0.5 rounded border border-slate-300 dark:border-bgmi-border text-slate-900 dark:text-white">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span>:</span>
            <span className="bg-slate-100 dark:bg-bgmi-dark px-2 py-0.5 rounded border border-slate-300 dark:border-bgmi-border text-bgmi-red">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>

        {/* Action button */}
        <Link href={`/matches/${match.id || match.matchNumber}`}>
          <Button variant="primary" size="md" icon={Swords} className="px-6 py-2.5 text-xs font-black">
            LOBBY DETAILS & ROOM CODE →
          </Button>
        </Link>
      </div>

    </div>
  );
}
