'use client';

import React, { useState, useEffect } from 'react';
import MatchCard from '@/components/tournament/MatchCard';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMatches } from '@/services/api';
import { Swords, Filter } from 'lucide-react';

export default function MatchesPage() {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 dark:border-white/10 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-bgmi-red uppercase tracking-widest">
          <Swords className="w-4 h-4" /> BROADCAST SCHEDULE & ROOM LOBBIES
        </div>
        <h1 className="font-broadcast font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-tight">
          MATCH LOBBY SCHEDULE
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
          Tournament map rotations, live scoreboards, custom room launches, and referee credentials.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-white/10">
        {['All', 'Upcoming', 'Live', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 text-xs font-broadcast font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${
              filter === f
                ? 'bg-bgmi-red text-white border-bgmi-red shadow-red-glow'
                : 'bg-slate-100 dark:bg-[#121620] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-bgmi-red/40'
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
          message="No scheduled match scorebars found for this filter."
          actionLabel="View All Matches"
          onAction={() => setFilter('All')}
        />
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <MatchCard key={match.id || match.matchNumber} match={{ ...match, registeredSquadsCount: teamsCount }} />
          ))}
        </div>
      )}

    </div>
  );
}
