'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ResultCard from '@/components/tournament/ResultCard';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getResults } from '@/services/api';
import { Flame, Trophy, Award, Swords, Target, Crown, MapPin, ChevronRight, BarChart2 } from 'lucide-react';

export default function ResultsPage() {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 font-sans">
      
      {/* 1. HERO SECTION WITH 3 COMPACT TOURNAMENT STATISTICS */}
      <div className="border-b border-slate-200 dark:border-white/10 pb-6 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-bgmi-red uppercase tracking-widest">
            <Flame className="w-4 h-4" /> VERIFIED SCORECARDS & MATCH RESULTS
          </div>
          <h1 className="font-broadcast font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-tight">
            COMPLETED MATCH SCORECARDS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            Verified results, WWCD winners, MVPs and match statistics.
          </p>
        </div>

        {/* 3 COMPACT TOURNAMENT STATISTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div className="p-4 bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">
                MATCHES COMPLETED
              </span>
              <span className="font-broadcast font-black text-2xl text-slate-900 dark:text-white">
                {stats.completedCount} / 12
              </span>
            </div>
            <Swords className="w-6 h-6 text-bgmi-red shrink-0" />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">
                TOTAL KILLS
              </span>
              <span className="font-broadcast font-black text-2xl text-sky-600 dark:text-sky-400">
                {stats.totalKills}
              </span>
            </div>
            <Target className="w-6 h-6 text-sky-500 shrink-0" />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">
                TOP FRAGGER
              </span>
              <span className="font-broadcast font-black text-lg text-amber-500 dark:text-amber-400 truncate block max-w-[150px]">
                {stats.topFraggerName}
              </span>
            </div>
            <Crown className="w-6 h-6 text-amber-500 shrink-0" />
          </div>

        </div>
      </div>

      {/* 2. RESULTS GRID (2-COLUMN RESPONSIVE ON DESKTOP & TABLET) */}
      {loading ? (
        <SkeletonGrid count={4} />
      ) : results.length === 0 ? (
        <EmptyState title="No Results Published" message="No match results have been finalized yet." />
      ) : (
        <div className="space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((res) => (
              <ResultCard key={res.id || res.matchNumber} result={res} />
            ))}
          </div>

          {/* 3. COMPACT TOURNAMENT PERFORMANCE SUMMARY */}
          {performanceSummary && (
            <section className="bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-6 clip-tactical space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="font-broadcast font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">
                    TOURNAMENT PERFORMANCE SUMMARY
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                  {results.length} MATCHES RECORDED
                </span>
              </div>

              {/* OVERALL PERFORMANCE CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs text-center">
                <div className="p-3 bg-white dark:bg-[#0B0E14] rounded-lg border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">HIGHEST KILL GAME</span>
                  <span className="font-broadcast font-black text-base text-bgmi-red">
                    MATCH #{performanceSummary.highestKillMatch.matchNumber} ({performanceSummary.highestKills} Kills)
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-[#0B0E14] rounded-lg border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">MOST WWCD SQUAD</span>
                  <span className="font-broadcast font-black text-base text-amber-500">
                    {performanceSummary.mostWwcdTeam} ({performanceSummary.maxWwcd} WWCD)
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-[#0B0E14] rounded-lg border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">CURRENT LEADER</span>
                  <span className="font-broadcast font-black text-base text-slate-900 dark:text-white">
                    {performanceSummary.mostWwcdTeam}
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-[#0B0E14] rounded-lg border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">TOP FRAGGER</span>
                  <span className="font-broadcast font-black text-base text-sky-400">
                    {stats.topFraggerName}
                  </span>
                </div>
              </div>

              {/* 4. EVERY MATCH SUMMARY MATRIX TABLE */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase">
                  <span className="flex items-center gap-1.5 text-bgmi-red">
                    <BarChart2 className="w-4 h-4" /> ALL MATCHES SUMMARY BREAKDOWN
                  </span>
                  <span>PER-MATCH METRICS</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B0E14]">
                  <table className="w-full text-left border-collapse font-mono text-xs">
                    <thead className="bg-slate-900 text-white font-broadcast font-black uppercase text-xs">
                      <tr>
                        <th className="p-3.5 text-center">MATCH #</th>
                        <th className="p-3.5">MAP ARENA</th>
                        <th className="p-3.5">WWCD VICTOR SQUAD</th>
                        <th className="p-3.5 text-center">TEAM KILLS</th>
                        <th className="p-3.5 text-center">TOTAL PTS</th>
                        <th className="p-3.5">MATCH MVP FRAGGER</th>
                        <th className="p-3.5 text-right">SCORECARD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                      {results.map((res) => {
                        const winnerName = (typeof res.winner === 'string' ? res.winner : res.winner?.teamName || res.winner?.name) || 'Champion Squad';
                        const winnerKills = res.winner?.kills !== undefined ? res.winner.kills : (res.totalKills || 0);
                        const winnerPts = res.winner?.totalPoints !== undefined ? res.winner.totalPoints : (res.winner?.points || 0);
                        const mvpName = (typeof res.mvp === 'string' ? res.mvp : res.mvp?.ign || res.mvp?.name) || 'MVP Player';
                        const mvpKills = res.mvp?.kills !== undefined ? res.mvp.kills : 0;

                        return (
                          <tr key={res.id || res.matchNumber} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="p-3.5 text-center font-broadcast font-black text-slate-900 dark:text-white">
                              MATCH #{res.matchNumber}
                            </td>
                            <td className="p-3.5 font-bold text-bgmi-red">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" /> {res.map || 'Erangel'}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-amber-500">
                              <span className="inline-flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-amber-400" /> {winnerName}
                              </span>
                            </td>
                            <td className="p-3.5 text-center font-bold text-sky-400">
                              {winnerKills} Kills
                            </td>
                            <td className="p-3.5 text-center font-bold text-slate-900 dark:text-white">
                              {winnerPts} PTS
                            </td>
                            <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300">
                              {mvpName} <span className="text-bgmi-red text-[11px]">({mvpKills} Frags)</span>
                            </td>
                            <td className="p-3.5 text-right">
                              <Link
                                href={`/results/${res.id || res.matchNumber}`}
                                className="px-3 py-1 bg-bgmi-red text-white text-[11px] font-broadcast font-bold uppercase rounded hover:bg-bgmi-red-hover inline-flex items-center gap-1 active:scale-95 transition-transform"
                              >
                                <span>VIEW</span>
                                <ChevronRight className="w-3 h-3" />
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

