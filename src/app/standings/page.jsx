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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-sans">
      
      {/* PAGE HEADER */}
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-bgmi-red font-mono font-bold text-xs rounded-full">
          <Award className="w-3.5 h-3.5" /> OFFICIAL LEADERBOARD 2026
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" /> Tournament Standings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-normal">
          Live point standings based on Placement Points + Finish Kills across all completed custom room matches.
        </p>
      </div>

      {/* TOP 3 PODIUM SPOTLIGHT */}
      {standings.length > 0 && <Top3Leaderboard standings={standings} />}

      {/* DESKTOP FULL TABLE VIEW */}
      <div className="hidden lg:block space-y-4">
        <div className="overflow-x-auto bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl shadow-editorial-sm overflow-hidden">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="bg-[#FAF8F5] dark:bg-[#0B0E14] border-b border-[#E7E3DA] dark:border-[#1E2638] text-slate-700 dark:text-slate-300 font-display font-bold uppercase tracking-wider">
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
            <tbody className="divide-y divide-[#E7E3DA] dark:divide-[#1E2638]">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} />)
              ) : standings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold text-xs tracking-wider uppercase font-mono">
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
        <h3 className="font-display font-bold text-xs text-slate-500 uppercase tracking-wider">
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
      <section className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 sm:p-8 space-y-6 shadow-editorial-sm">
        <div className="flex items-center gap-3 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-bgmi-red flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">
              Official Scoring System
            </h2>
            <p className="text-xs text-slate-500 font-normal">How leaderboard points are calculated after every match</p>
          </div>
        </div>

        <div className="p-4 bg-[#FAF8F5] dark:bg-[#0B0E14] rounded-2xl border border-red-500/20 text-center font-display font-black text-xs sm:text-sm text-bgmi-red tracking-wide uppercase">
          TOTAL POINTS = PLACEMENT POINTS + KILL POINTS (1 PT PER KILL)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center text-xs font-mono">
          {rules?.placementPoints?.map((p, idx) => (
            <div key={idx} className="p-3 bg-[#FAF8F5] dark:bg-[#0B0E14] rounded-2xl border border-[#E7E3DA] dark:border-[#1E2638] space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">#{p.rank} Place</span>
              <span className="font-display font-black text-sm text-slate-900 dark:text-white">{p.points} PTS</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
