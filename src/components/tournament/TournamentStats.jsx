'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Swords, Trophy, Award, FileText, BarChart3, Users2, Medal } from 'lucide-react';

export default function TournamentStats({
  registeredSquads = 0,
  verifiedPlayers = 0,
  totalMatches = 0,
  currentRound = 0,
}) {
  return (
    <section className="w-full py-2 font-sans space-y-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* ROW 1: 4-COLUMN AUTHENTIC TELEMETRY STATS STRIP */}
        <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 sm:p-7 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          
          {/* STAT 1: REGISTERED SQUADS */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center shrink-0">
              <Users2 className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white block leading-tight">
                {registeredSquads}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Registered Squads
              </span>
            </div>
          </div>

          {/* STAT 2: VERIFIED ATHLETES */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white block leading-tight">
                {verifiedPlayers}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Verified Athletes
              </span>
            </div>
          </div>

          {/* STAT 3: TOTAL MATCHES */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center shrink-0">
              <Swords className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white block leading-tight">
                {totalMatches}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Scheduled Matches
              </span>
            </div>
          </div>

          {/* STAT 4: TOURNAMENT STAGE */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <span className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white block leading-tight">
                {currentRound > 0 ? `Round ${currentRound}` : 'Lobby Open'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Tournament Stage
              </span>
            </div>
          </div>

        </div>

        {/* ROW 2: 4 AUTHENTIC FEATURE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <Link
            href="/matches"
            className="p-5 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl hover:border-[#C5A059] transition-all shadow-sm group flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-110 transition-transform shrink-0">
              <Swords className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#C5A059] transition-colors">
                Matches &amp; Rooms
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Lobby Schedule
              </p>
            </div>
          </Link>

          <Link
            href="/standings"
            className="p-5 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl hover:border-[#C5A059] transition-all shadow-sm group flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-110 transition-transform shrink-0">
              <BarChart3 className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#C5A059] transition-colors">
                Leaderboard
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Points Table
              </p>
            </div>
          </Link>

          <Link
            href="/results"
            className="p-5 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl hover:border-[#C5A059] transition-all shadow-sm group flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-110 transition-transform shrink-0">
              <Trophy className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#C5A059] transition-colors">
                Match Results
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Scorecards &amp; WWCD
              </p>
            </div>
          </Link>

          <Link
            href="/mvp"
            className="p-5 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl hover:border-[#C5A059] transition-all shadow-sm group flex items-center gap-3.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center text-slate-900 dark:text-white group-hover:scale-110 transition-transform shrink-0">
              <Medal className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#C5A059] transition-colors">
                MVP Leaderboard
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Top Fraggers
              </p>
            </div>
          </Link>

        </div>

      </div>
    </section>
  );
}
