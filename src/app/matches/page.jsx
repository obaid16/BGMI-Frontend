'use client';

import React, { useState, useEffect } from 'react';
import MatchCard from '@/components/tournament/MatchCard';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMatches } from '@/services/api';
import { Swords } from 'lucide-react';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      const data = await getMatches(filter);
      const sortedData = [...data].sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0));
      setMatches(sortedData);
      setLoading(false);
    }
    fetchMatches();
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-6 space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
          <Swords className="w-9 h-9 sm:w-11 sm:h-11 text-bgmi-red" /> Tournament Schedule & Lobbies
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
          Tournament match schedule, map rotations, custom room launches, and completed battle scorecards.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {['All', 'Upcoming', 'Live', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${
              filter === f
                ? 'bg-bgmi-red text-white border-rose-400 shadow-red-glow'
                : 'bg-white dark:bg-bgmi-surface/90 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-bgmi-border hover:text-bgmi-red shadow-sm'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* MATCH GRID */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : matches.length === 0 ? (
        <EmptyState
          title="No Matches Found"
          message="No scheduled matches found for this filter."
          actionLabel="View All Matches"
          onAction={() => setFilter('All')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id || match.matchNumber} match={match} />
          ))}
        </div>
      )}

    </div>
  );
}
