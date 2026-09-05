'use client';

import React, { useState, useEffect } from 'react';
import MatchCard from '@/components/tournament/MatchCard';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMatches, getTeams } from '@/services/api';
import { Swords } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      
      {/* PAGE HEADER */}
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-bgmi-red uppercase tracking-widest">
          <Swords className="w-4 h-4" /> BROADCAST SCHEDULE & ROOM LOBBIES
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-tight">
          Match Lobby Schedule
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-2xl">
          Tournament map rotations, live custom lobbies, match scorebars, and referee room launches.
        </p>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E7E3DA] dark:border-[#1E2638]">
        {['All', 'Upcoming', 'Live', 'Completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 text-xs font-display font-bold uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap ${
              filter === f
                ? 'bg-slate-950 text-white border-slate-950 dark:bg-bgmi-red dark:border-bgmi-red shadow-editorial'
                : 'bg-white dark:bg-[#121620] text-slate-700 dark:text-slate-300 border-[#E7E3DA] dark:border-[#1E2638] hover:border-slate-400 dark:hover:border-white/20'
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
