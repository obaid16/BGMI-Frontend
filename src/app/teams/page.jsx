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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      
      {/* PAGE HEADER */}
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-bgmi-red uppercase tracking-widest">
          <Users className="w-4 h-4" /> OFFICIAL COLLEGE ROSTERS
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-tight">
          Participating Squads
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-normal">
          Browse verified college BGMI rosters, team stats, and player profiles competing in Championship 2026.
        </p>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl shadow-editorial-sm">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search squad or captain name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-bgmi-red transition-colors font-medium shadow-editorial-sm"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Approved', 'Top Teams'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-display font-bold uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-slate-950 text-white border-slate-950 dark:bg-bgmi-red dark:border-bgmi-red shadow-editorial'
                  : 'bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-700 dark:text-slate-400 border-[#E7E3DA] dark:border-[#1E2638] hover:text-slate-900 dark:hover:text-white'
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
