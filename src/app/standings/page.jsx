'use client';

import React, { useState, useEffect } from 'react';
import StandingRow from '@/components/tournament/StandingRow';
import RankingCard from '@/components/tournament/RankingCard';
import Top3Leaderboard from '@/components/tournament/Top3Leaderboard';
import { SkeletonTableRow } from '@/components/common/Skeleton';
import { getStandings, getScoringRules } from '@/services/api';
import { Trophy, Award, Calculator } from 'lucide-react';

export default function StandingsPage() {
  const [standings, setStandings] = useState([]);
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStandingsData() {
      setLoading(true);
      const [data, ruleData] = await Promise.all([
        getStandings(),
        getScoringRules()
      ]);
      setStandings(data);
      setRules(ruleData);
      setLoading(false);
    }
    fetchStandingsData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-bgmi-red/10 border border-bgmi-red/40 text-bgmi-red font-bold text-xs rounded-full shadow-red-glow">
          <Award className="w-3.5 h-3.5" /> OFFICIAL LEADERBOARD 2026
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
          <Trophy className="w-9 h-9 sm:w-11 sm:h-11 text-amber-600 dark:text-bgmi-gold" /> Tournament Standings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
          Live point standings based on Placement Points + Finish Kills across all completed custom room matches.
        </p>
      </div>

      {/* TOP 3 PODIUM SPOTLIGHT */}
      {standings.length > 0 && <Top3Leaderboard standings={standings} />}

      {/* DESKTOP FULL TABLE VIEW */}
      <div className="hidden lg:block space-y-4">
        <div className="overflow-x-auto bg-white border border-slate-200 dark:bg-bgmi-surface/90 dark:border-bgmi-border rounded-2xl shadow-lg dark:shadow-2xl clip-tactical">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 dark:bg-bgmi-dark/95 dark:border-bgmi-border dark:text-slate-400 font-display font-black text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4 text-center">Rank</th>
                <th className="py-4 px-4">Squad Name & College</th>
                <th className="py-4 px-4 text-center">Matches</th>
                <th className="py-4 px-4 text-center">WWCD</th>
                <th className="py-4 px-4 text-center">Placement Pts</th>
                <th className="py-4 px-4 text-center">Kill Pts</th>
                <th className="py-4 px-4 text-center">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} />)
              ) : standings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold text-xs tracking-wider uppercase">
                    No Standings Data Recorded Yet
                  </td>
                </tr>
              ) : (
                standings.map((standing) => (
                  <StandingRow key={standing.teamId || standing.rank} standing={standing} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE COMPACT CARDS VIEW */}
      <div className="lg:hidden space-y-4">
        <h3 className="font-display font-bold text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Mobile Leaderboard Rankings
        </h3>
        <div className="space-y-3">
          {standings.length === 0 ? (
            <p className="text-slate-500 text-xs py-4 text-center">No standings data recorded yet.</p>
          ) : (
            standings.map((standing) => (
              <RankingCard key={standing.teamId || standing.rank} standing={standing} />
            ))
          )}
        </div>
      </div>

      {/* SCORING FORMULA EXPLANATION CARD */}
      <section className="bg-white border border-slate-200 dark:bg-bgmi-surface/90 dark:border-bgmi-border rounded-2xl p-6 sm:p-8 clip-tactical space-y-6 shadow-md dark:shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-bgmi-red/15 border border-bgmi-red text-bgmi-red flex items-center justify-center shadow-red-glow">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-wide">
              Official Scoring System
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">How leaderboard points are calculated after every match</p>
          </div>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-bgmi-dark rounded-xl border border-bgmi-red/30 text-center font-display font-black text-xs sm:text-sm text-bgmi-red tracking-wide uppercase">
          TOTAL POINTS = PLACEMENT POINTS + KILL POINTS (1 PT PER KILL)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center text-xs">
          {rules?.placementPoints?.map((p, idx) => (
            <div key={idx} className="p-3 bg-slate-100 dark:bg-bgmi-dark/80 rounded-lg border border-slate-200 dark:border-bgmi-border/60 space-y-1">
              <span className="text-[9px] text-slate-600 dark:text-slate-400 font-bold block uppercase">#{p.rank} Place</span>
              <span className="font-display font-black text-sm text-slate-900 dark:text-white">{p.points} PTS</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
