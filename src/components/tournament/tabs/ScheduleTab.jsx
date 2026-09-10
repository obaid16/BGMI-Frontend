'use client';

import React, { useState, useEffect } from 'react';
import MatchCard from '@/components/tournament/MatchCard';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMatches, getTeams } from '@/services/api';
import { Swords } from 'lucide-react';

export default function ScheduleTab() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const [teamsCount, setTeamsCount] = useState(4);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      const [data, tData] = await Promise.all([
        getMatches(filter).catch(() => []),
        getTeams().catch(() => [])
      ]);
      const sortedData = [...data].sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0));
      setMatches(sortedData);
      if (Array.isArray(tData) && tData.length > 0) {
        setTeamsCount(tData.length);
      }
      setLoading(false);
    }
    fetchMatches();
  }, [filter]);

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-12">
      
      {/* PAGE HEADER */}
      <div className="border-b border-premium-border pb-6 sm:pb-8 space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-premium-sage uppercase tracking-widest bg-premium-sage-soft px-3.5 py-1.5 rounded-full border border-premium-sage/30">
          <Swords className="w-4 h-4" /> Match Schedule
        </div>
        <h1 className="font-bold text-3xl sm:text-5xl lg:text-6xl text-premium-text tracking-tight">
          Tournament Matches
        </h1>
        <p className="text-sm sm:text-base text-premium-text-secondary max-w-2xl leading-relaxed">
          Tournament map rotations, live scoreboards, custom room launches, and referee credentials.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar">
        {['All', 'Upcoming', 'Live', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all whitespace-nowrap border ${
              filter === f
                ? 'bg-premium-text text-white border-premium-text shadow-premium-soft'
                : 'bg-premium-surface text-premium-text-secondary border-premium-border hover:border-premium-text hover:text-premium-text'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* HORIZONTAL MATCH SCOREBARS STACK */}
      {loading ? (
        <SkeletonGrid count={4} />
      ) : matches.length === 0 ? (
        <EmptyState
          title="No Matches Found"
          message="No scheduled matches found for this filter."
          actionLabel="View All Matches"
          onAction={() => setFilter('All')}
        />
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <MatchCard key={match.id || match.matchNumber} match={{ ...match, registeredSquadsCount: teamsCount }} />
          ))}
        </div>
      )}

    </div>
  );
}
