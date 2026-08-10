'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radio, MapPin, Clock, Swords, Play } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function NextMatchCard({ match }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  // Countdown timer effect
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
    <div className="relative overflow-hidden bg-bgmi-surface border border-bgmi-gold/40 rounded-2xl p-6 sm:p-8 clip-tactical shadow-gold-glow">
      {/* Background Subtle Map Grid Decor */}
      <div className="absolute inset-0 bg-tactical-grid opacity-30 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* MATCH HEADER INFO */}
        <div className="w-full lg:w-1/3 space-y-3 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            {isLive ? (
              <Badge variant="live" size="md">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 animate-spin" /> ● LIVE NOW
                </span>
              </Badge>
            ) : (
              <Badge variant="gold" size="md">
                UPCOMING MATCH
              </Badge>
            )}
            <Badge variant="default" size="md">
              MATCH #{match.matchNumber || 7}
            </Badge>
          </div>

          <h3 className="text-2xl font-black font-display text-white uppercase tracking-wide">
            {match.round} — <span className="text-bgmi-gold">{match.map}</span>
          </h3>

          <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-bgmi-gold" /> {match.time || '10:30 AM'}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-bgmi-cyan" /> {match.map || 'Erangel'}
            </span>
          </div>
        </div>

        {/* TEAM VS TEAM VERSUS DISPLAY */}
        <div className="w-full lg:w-1/3 flex items-center justify-center gap-6 sm:gap-10 py-4 bg-bgmi-card/60 border border-bgmi-border/60 rounded-xl px-6">
          {/* TEAM A */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-bgmi-dark rounded-xl border border-bgmi-border p-2 mb-2 flex items-center justify-center shadow-lg">
              <span className="font-black text-xl text-bgmi-gold">
                {match.winner ? match.winner.shortName : (match.participatingTeams && match.participatingTeams[0] ? match.participatingTeams[0].shortName : 'ALPHA')}
              </span>
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              {match.winner ? match.winner.name : (match.participatingTeams && match.participatingTeams[0] ? match.participatingTeams[0].name : 'Team Alpha')}
            </p>
          </div>

          {/* VS ICON */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-bgmi-gold/20 border border-bgmi-gold flex items-center justify-center text-bgmi-gold font-black text-sm shadow-gold-glow">
              VS
            </div>
          </div>

          {/* TEAM B */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-bgmi-dark rounded-xl border border-bgmi-border p-2 mb-2 flex items-center justify-center shadow-lg">
              <span className="font-black text-xl text-bgmi-cyan">
                {match.participatingTeams && match.participatingTeams[1] ? match.participatingTeams[1].shortName : 'TITAN'}
              </span>
            </div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              {match.participatingTeams && match.participatingTeams[1] ? match.participatingTeams[1].name : 'Team Titans'}
            </p>
          </div>
        </div>

        {/* COUNTDOWN OR STREAM ACTION */}
        <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end justify-center gap-4">
          {!isLive ? (
            <div className="text-center lg:text-right">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                LOBBY LAUNCH COUNTDOWN
              </p>
              <div className="flex items-center gap-2 font-display font-black text-2xl sm:text-3xl text-bgmi-gold">
                <span className="bg-bgmi-dark px-2.5 py-1 rounded border border-bgmi-border">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-bgmi-dark px-2.5 py-1 rounded border border-bgmi-border">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-bgmi-dark px-2.5 py-1 rounded border border-bgmi-border">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-bgmi-red font-bold text-sm">
              <span className="w-3 h-3 rounded-full bg-bgmi-red animate-ping"></span>
              STREAM IS LIVE ON YOUTUBE
            </div>
          )}

          <div className="flex items-center gap-3">
            <Link href={`/matches/${match.id || 'match-07'}`}>
              <Button variant="primary" size="md" icon={Swords}>
                Match Hub
              </Button>
            </Link>
            {match.streamUrl && (
              <a href={match.streamUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="md" icon={Play}>
                  Stream
                </Button>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
