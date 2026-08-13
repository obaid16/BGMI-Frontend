'use client';

import React, { useState, useEffect } from 'react';
import ResultCard from '@/components/tournament/ResultCard';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getResults } from '@/services/api';
import { Flame } from 'lucide-react';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-6 space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
          <Flame className="w-9 h-9 sm:w-11 sm:h-11 text-bgmi-red" /> Completed Match Scorecards
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
          Verified match scorecards, WWCD winners, MVP fraggers, and anti-cheat proof archives.
        </p>
      </div>

      {/* RESULTS GRID */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : results.length === 0 ? (
        <EmptyState title="No Results Published" message="No match results have been finalized yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((res) => (
            <ResultCard key={res.id || res.matchNumber} result={res} />
          ))}
        </div>
      )}

    </div>
  );
}
