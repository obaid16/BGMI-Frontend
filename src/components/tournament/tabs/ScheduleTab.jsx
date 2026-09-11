'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MatchCard from '@/components/tournament/MatchCard';
import EmptyState from '@/components/common/EmptyState';
import ConfirmModal from '@/components/common/ConfirmModal';
import { SkeletonGrid } from '@/components/common/Skeleton';
import { getMatches, getTeams, deleteMatch } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Swords, ShieldCheck, ExternalLink } from 'lucide-react';

export default function ScheduleTab() {
  const { showToast } = useToast();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false);
  const [teamsCount, setTeamsCount] = useState(4);

  // Confirm Modal state for deletion
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Delete Schedule',
    onConfirm: null,
    loading: false,
  });

  // Detect admin login
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('bgmi_esports_admin_token')) {
      setIsAdmin(true);
    }
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const [data, tData] = await Promise.all([
      getMatches(filter, true).catch(() => []),
      getTeams().catch(() => [])
    ]);
    const sortedData = [...data].sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0));
    setMatches(sortedData);
    if (Array.isArray(tData) && tData.length > 0) {
      setTeamsCount(tData.length);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();
  }, [filter]);

  const handleDeleteSchedulePrompt = (match) => {
    const matchId = match.id || match._id;
    const matchTitle = match.title || `Match #${match.matchNumber}`;

    setConfirmModal({
      isOpen: true,
      title: `Delete ${matchTitle}?`,
      description: `Are you sure you want to delete ${matchTitle} (${match.map || 'Erangel'} - ${match.round || 'Stage'})? This match schedule will be permanently removed.`,
      confirmText: 'Delete Schedule',
      loading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          await deleteMatch(matchId);
          setMatches((prev) => prev.filter((m) => (m.id || m._id) !== matchId));
          showToast(`${matchTitle} schedule deleted successfully!`, 'success');
        } catch (err) {
          console.error('Delete schedule error:', err);
          showToast(err.message || 'Failed to delete match schedule', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
        }
      },
    });
  };

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

      {/* ADMIN CONTROL BANNER (Only visible to authenticated administrators) */}
      {isAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs font-semibold text-amber-950 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Administrator Privileges Active: You can delete match schedules or manage room lobbies directly.</span>
          </div>
          <Link
            href="/admin/matches"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shrink-0 shadow-sm"
          >
            <span>Admin Match Manager</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

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
            <MatchCard
              key={match.id || match._id || match.matchNumber}
              match={{ ...match, registeredSquadsCount: teamsCount }}
              onDelete={isAdmin ? handleDeleteSchedulePrompt : null}
            />
          ))}
        </div>
      )}

      {/* CONFIRM DELETION MODAL */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        loading={confirmModal.loading}
      />

    </div>
  );
}
