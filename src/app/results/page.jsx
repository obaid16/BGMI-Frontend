'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ResultCard from '@/components/tournament/ResultCard';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getResults } from '@/services/api';
import { Flame, Swords, Target } from 'lucide-react';

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

  const stats = useMemo(() => {
    const completedCount = results.length;
    const totalKills = results.reduce((acc, r) => {
      const matchK = r.winner?.kills !== undefined ? r.winner.kills : (r.totalKills || 14);
      return acc + matchK;
    }, 0);

    let topFraggerName = 'MVP Player';
    let topFraggerKills = 0;

    results.forEach((r) => {
      if (r.mvp && r.mvp.kills > topFraggerKills) {
        topFraggerKills = r.mvp.kills;
        topFraggerName = r.mvp.ign || r.mvp.name || 'MVP Player';
      }
    });

    if (topFraggerKills === 0 && results.length > 0) {
      topFraggerName = results[0].mvp?.ign || results[0].mvp?.name || 'MVP Player';
      topFraggerKills = results[0].mvp?.kills || 0;
    }

    return {
      completedCount,
      totalKills,
      topFraggerName,
      topFraggerKills
    };
  }, [results]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-sans">
      
      {/* 1. HERO SECTION WITH 3 COMPACT TOURNAMENT STATISTICS */}
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-6 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-bgmi-red uppercase tracking-widest">
            <Flame className="w-4 h-4" /> VERIFIED SCORECARDS & MATCH RESULTS
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-tight">
            Completed Match Scorecards
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-normal">
            Verified results, WWCD champions, MVPs, and individual scorecard breakdowns.
          </p>
        </div>

        {/* 3 COMPACT TOURNAMENT STATISTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div className="p-5 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl flex items-center justify-between font-mono shadow-editorial-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                MATCHES COMPLETED
              </span>
              <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {stats.completedCount} / 12
              </span>
            </div>
            <Swords className="w-6 h-6 text-bgmi-red shrink-0" />
          </div>

          <div className="p-5 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl flex items-center justify-between font-mono shadow-editorial-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                TOTAL KILLS
              </span>
              <span className="font-display font-black text-2xl sm:text-3xl text-sky-600 dark:text-sky-400">
                {stats.totalKills}
              </span>
            </div>
            <Target className="w-6 h-6 text-sky-500 shrink-0" />
          </div>

          <div className="p-5 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl flex items-center justify-between font-mono shadow-editorial-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                TOP MATCH FRAGGER
              </span>
              <span className="font-display font-black text-xl sm:text-2xl text-amber-700 dark:text-amber-400 line-clamp-1">
                {stats.topFraggerName}
              </span>
            </div>
            <Flame className="w-6 h-6 text-amber-500 shrink-0" />
          </div>

        </div>
      </div>

      {/* RESULTS GRID */}
      {loading ? (
        <SkeletonGrid count={4} />
      ) : results.length === 0 ? (
        <EmptyState
          title="No Results Recorded Yet"
          message="Match scorecards and official winner certificates will appear here once verified."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((result) => (
            <ResultCard key={result.id || result.matchNumber} result={result} />
          ))}
        </div>
      )}

    </div>
  );
}
