'use client';

import React, { useState, useEffect } from 'react';
import StandingRow from '@/components/tournament/StandingRow';
import RankingCard from '@/components/tournament/RankingCard';
import Top3Leaderboard from '@/components/tournament/Top3Leaderboard';
import { SkeletonTableRow } from '@/components/common/Skeleton';
import { getStandings, getScoringRules } from '@/services/api';
import { Trophy, Award, Calculator } from 'lucide-react';

export default function StandingsTab() {
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
    <div className="max-w-[1500px] mx-auto px-6 lg:px-8 py-16 space-y-16">
      
      {/* PAGE HEADER */}
      <div className="border-b border-premium-border pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 font-semibold text-xs rounded-full uppercase tracking-widest">
          <Award className="w-4 h-4" /> Official Leaderboard
        </div>
        <h1 className="font-bold text-5xl sm:text-6xl text-premium-text tracking-tight flex items-center gap-4">
          Tournament Standings
        </h1>
        <p className="text-base text-premium-text-secondary max-w-2xl">
          Live point standings based on Placement Points + Finish Kills across all completed custom room matches.
        </p>
      </div>

      {/* TOP 3 PODIUM SPOTLIGHT */}
      {standings.length > 0 && <Top3Leaderboard standings={standings} />}

      {/* DESKTOP FULL TABLE VIEW */}
      <div className="hidden lg:block space-y-4">
        <div className="overflow-hidden bg-premium-surface border border-premium-border rounded-[24px] shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-premium-surface-soft border-b border-premium-border text-premium-text-secondary font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="py-5 px-6 text-center font-medium">Rank</th>
                <th className="py-5 px-6 font-medium">Squad Name & College</th>
                <th className="py-5 px-6 text-center font-medium">Matches</th>
                <th className="py-5 px-6 text-center font-medium">WWCD</th>
                <th className="py-5 px-6 text-center font-medium">Placement Pts</th>
                <th className="py-5 px-6 text-center font-medium">Kill Pts</th>
                <th className="py-5 px-6 text-center font-medium text-premium-text">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-premium-border bg-premium-background">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonTableRow key={i} />)
              ) : standings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-premium-text-secondary font-medium tracking-wide">
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
      <div className="lg:hidden space-y-5">
        <h3 className="font-semibold text-sm text-premium-text-secondary uppercase tracking-widest">
          Mobile Leaderboard
        </h3>
        <div className="space-y-4">
          {standings.length === 0 ? (
            <p className="text-premium-text-secondary text-sm py-6 text-center">No standings data recorded yet.</p>
          ) : (
            standings.map((standing) => (
              <RankingCard key={standing.teamId || standing.rank} standing={standing} />
            ))
          )}
        </div>
      </div>

      {/* SCORING FORMULA EXPLANATION CARD */}
      <section className="bg-premium-surface border border-premium-border rounded-[28px] p-8 sm:p-10 space-y-8 shadow-sm">
        <div className="flex items-center gap-4 border-b border-premium-border pb-6">
          <div className="w-12 h-12 rounded-2xl bg-premium-surface-soft border border-premium-border text-premium-text-secondary flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-premium-text tracking-tight">
              Official Scoring System
            </h2>
            <p className="text-sm text-premium-text-secondary mt-1">How leaderboard points are calculated after every match</p>
          </div>
        </div>

        <div className="p-5 bg-premium-background rounded-2xl border border-premium-border text-center font-bold text-sm text-premium-text tracking-widest uppercase">
          Total Points = Placement Points + Kill Points (1 pt per kill)
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 text-center">
          {rules?.placementPoints?.map((p, idx) => (
            <div key={idx} className="p-4 bg-premium-surface-soft rounded-2xl border border-premium-border space-y-1.5 flex flex-col justify-center">
              <span className="text-[10px] text-premium-text-secondary font-semibold uppercase tracking-widest block">#{p.rank} Place</span>
              <span className="font-bold text-lg text-premium-text block">{p.points} <span className="text-xs font-medium text-premium-text-secondary">pts</span></span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
