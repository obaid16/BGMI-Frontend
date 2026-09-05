'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RegistrationModal from '@/components/admin/RegistrationModal';
import Badge from '@/components/common/Badge';
import { getTeams, getAdminDashboardStats, getMatches, updateTeamStatus } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import {
  Users,
  Trophy,
  ClipboardList,
  Gamepad2,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Eye,
  CheckCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({
    totalTeams: 0,
    approvedTeams: 0,
    pendingRegistrations: 0,
    totalPlayers: 0,
    upcomingMatches: 0,
    liveMatches: 0,
    completedMatches: 0,
  });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [tData, sData, mData] = await Promise.all([
          getTeams().catch(() => []),
          getAdminDashboardStats().catch(() => ({})),
          getMatches().catch(() => []),
        ]);
        setTeams(Array.isArray(tData) ? tData : []);
        setStats(sData || {});
        setMatches(Array.isArray(mData) ? mData : []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleApprove = async (id) => {
    setTeams((prev) =>
      prev.map((t) => ((t.id || t._id) === id ? { ...t, status: 'Approved', verified: true } : t))
    );
    if (selectedTeam && (selectedTeam.id || selectedTeam._id) === id) {
      setSelectedTeam((prev) => (prev ? { ...prev, status: 'Approved', verified: true } : null));
    }
    showToast('Squad Registration Approved!', 'success');
    await updateTeamStatus(id, 'Approved');
  };

  const handleReject = async (id) => {
    setTeams((prev) =>
      prev.map((t) => ((t.id || t._id) === id ? { ...t, status: 'Rejected', verified: false } : t))
    );
    if (selectedTeam && (selectedTeam.id || selectedTeam._id) === id) {
      setSelectedTeam((prev) => (prev ? { ...prev, status: 'Rejected', verified: false } : null));
    }
    showToast('Squad Registration Rejected.', 'info');
    await updateTeamStatus(id, 'Rejected');
  };

  const currentDateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-7 max-w-full overflow-hidden font-sans">
      
      {/* 1. HEADER (AS IN REFERENCE) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-5">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Here&apos;s an overview of your platform activity.
          </p>
        </div>

        {/* DATE SELECTOR PILL (AS IN REFERENCE) */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 shadow-sm cursor-pointer hover:border-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDateStr}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* 2. 4 METRIC CARDS ROW (AS IN REFERENCE) */}
      {/* 2. 4 METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* CARD 1: TOTAL ATHLETES */}
        <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Total Athletes</span>
            <div className="w-9 h-9 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center text-slate-900 dark:text-white">
              <Users className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
              {stats.totalPlayers || teams.reduce((acc, t) => acc + (t.players ? t.players.length : 0), 0) || 0}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Roster Pool
            </span>
          </div>
        </div>

        {/* CARD 2: ACTIVE MATCHES */}
        <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Active / Upcoming</span>
            <div className="w-9 h-9 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center text-slate-900 dark:text-white">
              <Trophy className="w-4 h-4 text-[#C5A059]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
              {matches.filter((m) => m.status === 'Live' || m.status === 'Upcoming').length || 0}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Matches
            </span>
          </div>
        </div>

        {/* CARD 3: REGISTRATIONS */}
        <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Registered Squads</span>
            <div className="w-9 h-9 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center text-slate-900 dark:text-white">
              <ClipboardList className="w-4 h-4 text-[#C5A059]" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
              {teams.length || 0}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Applications
            </span>
          </div>
        </div>

        {/* CARD 4: MATCHES COMPLETED */}
        <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Matches Finalized</span>
            <div className="w-9 h-9 rounded-2xl bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center text-slate-900 dark:text-white">
              <Gamepad2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
              {matches.filter((m) => m.status === 'Completed').length || 0}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Scorecards
            </span>
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION: REGISTRATIONS OVERVIEW & RECENT REGISTRATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT (8 COLS): REGISTRATIONS OVERVIEW GRAPH */}
        <div className="lg:col-span-8 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight">
              Tournament Activity Overview
            </h3>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400">
              <span>Season 2026</span>
            </div>
          </div>

          {/* SMOOTH SVG TELEMETRY CHART */}
          <div className="pt-2">
            <div className="h-52 w-full relative flex items-end">
              <svg className="w-full h-44 overflow-visible" viewBox="0 0 600 150">
                <defs>
                  <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#C5A059" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#C5A059" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Background grid lines */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="currentColor" className="text-[#E7E3DA] dark:text-[#1E2638]" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="600" y2="75" stroke="currentColor" className="text-[#E7E3DA] dark:text-[#1E2638]" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="currentColor" className="text-[#E7E3DA] dark:text-[#1E2638]" strokeDasharray="3 3" />

                {/* Area Fill */}
                <path
                  d="M 0,130 Q 75,115 150,120 T 300,80 T 450,45 T 600,60 L 600,150 L 0,150 Z"
                  fill="url(#chartGrad)"
                />
                {/* Curve Line */}
                <path
                  d="M 0,130 Q 75,115 150,120 T 300,80 T 450,45 T 600,60"
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Active Data Points */}
                <circle cx="150" cy="120" r="4" fill="#C5A059" />
                <circle cx="300" cy="80" r="4" fill="#C5A059" />
                <circle cx="450" cy="45" r="5" fill="#FAF8F5" stroke="#C5A059" strokeWidth="3" />
                <circle cx="600" cy="60" r="4" fill="#C5A059" />
              </svg>
            </div>

            {/* MONTH AXIS LABELS */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#E7E3DA] dark:border-[#1E2638]">
              <span>Stage 1</span>
              <span>Qualifiers</span>
              <span>Group A</span>
              <span>Group B</span>
              <span>Quarterfinals</span>
              <span>Semifinals</span>
              <span className="font-bold text-slate-900 dark:text-white">Grand Finals</span>
            </div>
          </div>
        </div>

        {/* RIGHT (4 COLS): RECENT REGISTRATIONS LIST */}
        <div className="lg:col-span-4 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight">
              Recent Registrations
            </h3>
            <Link
              href="/admin/registrations"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              View All &gt;
            </Link>
          </div>

          <div className="space-y-3">
            {teams.length > 0 ? (
              teams.slice(0, 5).map((t, idx) => {
                const displayName = t.teamName || t.name || `Squad #${idx + 1}`;
                const displayCaptain = t.captainName || t.captain?.name || 'Captain Pending';
                const status = t.status || 'Pending';

                return (
                  <div key={t.id || t._id || idx} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-[#1E2638] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF8F5] dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center font-bold text-xs text-[#C5A059]">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-display font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {displayCaptain}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : status === 'Rejected'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No registrations received yet</p>
                <p className="text-[10px] text-slate-400 font-mono">New team registrations will populate here</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. BOTTOM SECTION: ONGOING MATCHES TABLE */}
      <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-3">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight">
            Championship Matches
          </h3>
          <Link
            href="/admin/matches"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            Manage Matches &gt;
          </Link>
        </div>

        <div className="overflow-x-auto">
          {matches.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead className="bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-500 dark:text-slate-400 font-mono font-bold uppercase text-[10px] border-b border-[#E7E3DA] dark:border-[#1E2638]">
                <tr>
                  <th className="p-3.5 w-12 text-center">#</th>
                  <th className="p-3.5">Match / Round</th>
                  <th className="p-3.5">Map</th>
                  <th className="p-3.5">Scheduled Time</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E3DA] dark:divide-[#1E2638]">
                {matches.slice(0, 5).map((m, idx) => {
                  const status = m.status || 'Upcoming';
                  return (
                    <tr key={m.id || m._id || idx} className="hover:bg-slate-50/70 dark:hover:bg-[#181E2C]/50 transition-colors">
                      <td className="p-3.5 text-center font-mono font-bold text-slate-400">
                        {m.matchNumber || idx + 1}
                      </td>
                      <td className="p-3.5 font-display font-bold text-slate-900 dark:text-white">
                        {m.round || `Match #${m.matchNumber || idx + 1}`}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                        {m.map || 'Erangel'}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                        {m.scheduledTime || m.date || 'TBD'}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            status === 'Live'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : status === 'Upcoming'
                              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href="/admin/matches"
                          className="px-3 py-1 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl font-display font-bold text-xs text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white shadow-sm inline-block"
                        >
                          {status === 'Live' ? 'Lobby' : 'Edit'}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-10 text-center space-y-2">
              <Swords className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No tournament matches scheduled yet</p>
              <Link href="/admin/matches" className="text-[11px] text-[#C5A059] font-bold hover:underline block">
                Create custom room lobby →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* REGISTRATION DETAILS REVIEW MODAL */}
      <RegistrationModal
        team={selectedTeam}
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

    </div>
  );
}
