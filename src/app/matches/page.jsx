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
      setMatches(data);
      setLoading(false);
    }
    fetchMatches();
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* HEADER */}
      <div className="border-b border-bgmi-border/60 pb-6 space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-wide flex items-center gap-3">
          <Swords className="w-10 h-10 text-bgmi-gold" /> Match Schedule & Custom Rooms
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Tournament match schedule, map rotations, upcoming lobby launch times, and completed battle archives.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {['All', 'Upcoming', 'Live', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
              filter === f
                ? 'bg-bgmi-gold text-slate-950 border-amber-300 shadow-gold-glow'
                : 'bg-bgmi-surface text-slate-400 border-bgmi-border hover:text-white'
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
          message="No scheduled matches found for this filter tab."
          actionLabel="View All Matches"
          onAction={() => setFilter('All')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}

    </div>
  );
}
