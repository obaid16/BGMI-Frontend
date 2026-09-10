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
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-12">
      
      {/* PAGE HEADER */}
      <div className="border-b border-premium-border pb-6 sm:pb-8 space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-premium-sage uppercase tracking-widest bg-premium-sage-soft px-3.5 py-1.5 rounded-full border border-premium-sage/30">
          <Users className="w-4 h-4" /> Roster Directory
        </div>
        <h1 className="font-bold text-3xl sm:text-5xl lg:text-6xl text-premium-text tracking-tight">
          Participating Squads
        </h1>
        <p className="text-sm sm:text-base text-premium-text-secondary max-w-2xl leading-relaxed">
          Browse verified college BGMI rosters, squad statistics, and player profiles competing in Championship 2026.
        </p>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-premium-text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by squad or college name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-premium-background border border-premium-border rounded-[16px] text-premium-text text-sm focus:outline-none focus:border-premium-text transition-colors placeholder:text-premium-text-secondary/70"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['All', 'Colleges', 'Communities'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all whitespace-nowrap border ${
                filter === f
                  ? 'bg-premium-text text-white border-premium-text shadow-premium-soft'
                  : 'bg-premium-background text-premium-text-secondary border-premium-border hover:border-premium-text hover:text-premium-text'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id || team._id} team={team} />
          ))}
        </div>
      )}

    </div>
  );
}
