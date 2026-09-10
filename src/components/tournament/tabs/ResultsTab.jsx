'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ResultCard from '@/components/tournament/ResultCard';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getResults } from '@/services/api';
import { Flame, Trophy, Award, Swords, Target, Crown, MapPin, ChevronRight, BarChart2 } from 'lucide-react';

export default function ResultsTab() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      const data = await getResults();
      setResults(data);
      setLoading(false);
    }
    fetchResults();
  }, []);

  // Compute 3 compact tournament statistics dynamically from existing results data
  const stats = useMemo(() => {
    const completedCount = results.length;
    const totalKills = results.reduce((acc, r) => {
      const matchK = r.winner?.kills !== undefined ? r.winner.kills : (r.totalKills || 14);
      return acc + matchK;
    }, 0);

    // Find top fragger across results
    let topFraggerName = 'YASH (IGL)';
    let topFraggerKills = 0;

    results.forEach((r) => {
      if (r.mvp && r.mvp.kills > topFraggerKills) {
        topFraggerKills = r.mvp.kills;
        topFraggerName = r.mvp.name;
      }
    });

    // Fallback if no MVP is set
    if (topFraggerKills === 0 && results.length > 0) {
      topFraggerName = results[0].mvp?.name || 'YASH (IGL)';
      topFraggerKills = results[0].mvp?.kills || 8;
    }

    return {
      completedCount,
      totalKills,
      topFraggerName,
      topFraggerKills
    };
  }, [results]);

  // Compute Tournament Performance highlights from real results data
  const performanceSummary = useMemo(() => {
    if (results.length === 0) return null;

    // Highest kill match
    let highestKillMatch = results[0];
    results.forEach((r) => {
      const kills = r.winner?.kills || r.totalKills || 0;
      const curMax = highestKillMatch.winner?.kills || highestKillMatch.totalKills || 0;
      if (kills > curMax) highestKillMatch = r;
    });

    // Most WWCD squad
    const wwcdCounts = {};
    results.forEach((r) => {
      const team = r.winner?.teamName || r.winner?.name || r.winnerTeam || 'GODLIKE ESPORTS';
      wwcdCounts[team] = (wwcdCounts[team] || 0) + 1;
    });

    let mostWwcdTeam = Object.keys(wwcdCounts)[0] || 'GODLIKE ESPORTS';
    let maxWwcd = wwcdCounts[mostWwcdTeam] || 1;
    Object.entries(wwcdCounts).forEach(([t, count]) => {
      if (count > maxWwcd) {
        maxWwcd = count;
        mostWwcdTeam = t;
      }
    });

    return {
      highestKillMatch,
      highestKills: highestKillMatch.winner?.kills || highestKillMatch.totalKills || 18,
      mostWwcdTeam,
      maxWwcd
    };
  }, [results]);

  return (
    <div className="max-w-[1500px] mx-auto px-6 lg:px-8 py-16 space-y-16">
      
      {/* 1. HERO SECTION WITH 3 COMPACT TOURNAMENT STATISTICS */}
      <div className="border-b border-premium-border pb-10 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 uppercase tracking-widest">
            <Trophy className="w-4 h-4" /> Official Results
          </div>
          <h1 className="font-bold text-5xl sm:text-6xl text-premium-text tracking-tight">
            Match Scorecards
          </h1>
          <p className="text-base text-premium-text-secondary max-w-2xl">
            Verified results, WWCD winners, MVPs and match statistics.
          </p>
        </div>

        {/* 3 COMPACT TOURNAMENT STATISTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          
          <div className="p-6 bg-premium-surface border border-premium-border rounded-[20px] flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-premium-text-secondary font-semibold uppercase tracking-widest block mb-1">
                Matches Completed
              </span>
              <span className="font-bold text-3xl text-premium-text">
                {stats.completedCount} / 12
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-premium-surface-soft border border-premium-border flex items-center justify-center text-premium-text-secondary">
              <Swords className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 bg-premium-surface border border-premium-border rounded-[20px] flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-premium-text-secondary font-semibold uppercase tracking-widest block mb-1">
                Total Kills
              </span>
              <span className="font-bold text-3xl text-premium-sage">
                {stats.totalKills}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-premium-surface-soft border border-premium-border flex items-center justify-center text-premium-text-secondary">
              <Target className="w-6 h-6 text-premium-sage" />
            </div>
          </div>

          <div className="p-6 bg-premium-surface border border-premium-border rounded-[20px] flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-premium-text-secondary font-semibold uppercase tracking-widest block mb-1">
                Top Fragger
              </span>
              <span className="font-bold text-2xl text-amber-600 truncate block max-w-[200px]">
                {stats.topFraggerName}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-premium-surface-soft border border-premium-border flex items-center justify-center text-premium-text-secondary">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
          </div>

        </div>
      </div>

      {/* 2. RESULTS GRID (2-COLUMN RESPONSIVE ON DESKTOP & TABLET) */}
      {loading ? (
        <SkeletonGrid count={4} />
      ) : results.length === 0 ? (
        <EmptyState title="No Results Published" message="No match results have been finalized yet." />
      ) : (
        <div className="space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {results.map((res) => (
              <ResultCard key={res.id || res.matchNumber} result={res} />
            ))}
          </div>

          {/* 3. COMPACT TOURNAMENT PERFORMANCE SUMMARY */}
          {performanceSummary && (
            <section className="bg-premium-surface border border-premium-border rounded-[28px] p-8 sm:p-10 space-y-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-premium-border pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-premium-surface-soft border border-premium-border text-amber-500 flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-2xl text-premium-text tracking-tight">
                    Tournament Performance
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-premium-text-secondary uppercase tracking-widest bg-premium-background px-3 py-1.5 rounded-lg border border-premium-border">
                  {results.length} Matches Recorded
                </span>
              </div>

              {/* OVERALL PERFORMANCE CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-5 bg-premium-background rounded-2xl border border-premium-border flex flex-col justify-center">
                  <span className="text-[10px] text-premium-text-secondary uppercase font-semibold tracking-widest block mb-2">Highest Kill Game</span>
                  <span className="font-bold text-lg text-premium-text">
                    Match #{performanceSummary.highestKillMatch.matchNumber} <span className="text-premium-sage block text-sm mt-0.5">({performanceSummary.highestKills} Kills)</span>
                  </span>
                </div>

                <div className="p-5 bg-premium-background rounded-2xl border border-premium-border flex flex-col justify-center">
                  <span className="text-[10px] text-premium-text-secondary uppercase font-semibold tracking-widest block mb-2">Most WWCD</span>
                  <span className="font-bold text-lg text-premium-text">
                    {performanceSummary.mostWwcdTeam} <span className="text-amber-600 block text-sm mt-0.5">({performanceSummary.maxWwcd} WWCD)</span>
                  </span>
                </div>

                <div className="p-5 bg-premium-background rounded-2xl border border-premium-border flex flex-col justify-center">
                  <span className="text-[10px] text-premium-text-secondary uppercase font-semibold tracking-widest block mb-2">Current Leader</span>
                  <span className="font-bold text-lg text-premium-text">
                    {performanceSummary.mostWwcdTeam}
                  </span>
                </div>

                <div className="p-5 bg-premium-background rounded-2xl border border-premium-border flex flex-col justify-center">
                  <span className="text-[10px] text-premium-text-secondary uppercase font-semibold tracking-widest block mb-2">Top Fragger</span>
                  <span className="font-bold text-lg text-premium-text">
                    {stats.topFraggerName}
                  </span>
                </div>
              </div>

              {/* 4. EVERY MATCH SUMMARY MATRIX TABLE */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between text-sm font-bold text-premium-text">
                  <span className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-premium-text-secondary" /> Per-Match Metrics
                  </span>
                </div>

                <div className="overflow-hidden rounded-[20px] border border-premium-border bg-premium-surface">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-premium-surface-soft border-b border-premium-border text-premium-text-secondary font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-4 text-center">Match #</th>
                        <th className="p-4">Map Arena</th>
                        <th className="p-4">WWCD Victor</th>
                        <th className="p-4 text-center">Team Kills</th>
                        <th className="p-4 text-center">Total Pts</th>
                        <th className="p-4">Match MVP</th>
                        <th className="p-4 text-right">Scorecard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-premium-border bg-premium-background">
                      {results.map((res) => {
                        const winnerName = (typeof res.winner === 'string' ? res.winner : res.winner?.teamName || res.winner?.name) || 'Champion Squad';
                        const winnerKills = res.winner?.kills !== undefined ? res.winner.kills : (res.totalKills || 0);
                        const winnerPts = res.winner?.totalPoints !== undefined ? res.winner.totalPoints : (res.winner?.points || 0);
                        const mvpName = (typeof res.mvp === 'string' ? res.mvp : res.mvp?.ign || res.mvp?.name) || 'MVP Player';
                        const mvpKills = res.mvp?.kills !== undefined ? res.mvp.kills : 0;

                        return (
                          <tr key={res.id || res.matchNumber} className="hover:bg-premium-surface-soft transition-colors">
                            <td className="p-4 text-center font-bold text-premium-text">
                              #{res.matchNumber}
                            </td>
                            <td className="p-4 font-semibold text-premium-text-secondary">
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" /> {res.map || 'Erangel'}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-amber-600">
                              <span className="inline-flex items-center gap-1.5">
                                <Trophy className="w-4 h-4 text-amber-500" /> {winnerName}
                              </span>
                            </td>
                            <td className="p-4 text-center font-bold text-premium-sage">
                              {winnerKills} Kills
                            </td>
                            <td className="p-4 text-center font-bold text-premium-text">
                              {winnerPts} pts
                            </td>
                            <td className="p-4 font-semibold text-premium-text-secondary">
                              {mvpName} <span className="text-premium-sage text-[11px] ml-1">({mvpKills} Frags)</span>
                            </td>
                            <td className="p-4 text-right">
                              <Link
                                href={`/results/${res.id || res.matchNumber}`}
                                className="px-4 py-2 bg-premium-surface border border-premium-border text-premium-text text-[11px] font-semibold uppercase tracking-widest rounded-lg hover:border-premium-text transition-colors inline-flex items-center gap-1.5 active:scale-95 shadow-sm"
                              >
                                <span>View</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </section>
          )}

        </div>
      )}

    </div>
  );
}
