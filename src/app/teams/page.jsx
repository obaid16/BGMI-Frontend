'use client';

import React, { useState, useEffect } from 'react';
import TeamCard from '@/components/tournament/TeamCard';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getTeams } from '@/services/api';
import { Users, Search } from 'lucide-react';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchTeams() {
      setLoading(true);
      const data = await getTeams(filter, searchQuery);
      setTeams(data);
      setLoading(false);
    }
    fetchTeams();
  }, [filter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-6 space-y-2">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
          <Users className="w-9 h-9 sm:w-11 sm:h-11 text-bgmi-red" /> Participating Squads
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
          Browse verified college BGMI rosters, squad statistics, and player profiles competing in Championship 2026.
        </p>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-slate-200 dark:bg-bgmi-surface/90 dark:border-bgmi-border rounded-xl clip-tactical shadow-md dark:shadow-xl">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by squad or college name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white text-xs focus:outline-none focus:border-bgmi-red transition-colors font-medium"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Approved', 'Top Teams'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-bgmi-red text-white border-rose-400 shadow-red-glow'
                  : 'bg-slate-100 dark:bg-bgmi-dark/80 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-bgmi-border hover:text-bgmi-red'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

      </div>

      {/* TEAMS GRID */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : teams.length === 0 ? (
        <EmptyState
          title="No Teams Found"
          message="No college squads matched your search or filter criteria."
          actionLabel="Reset Search"
          onAction={() => {
            setSearchQuery('');
            setFilter('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id || team._id} team={team} />
          ))}
        </div>
      )}

    </div>
  );
}
