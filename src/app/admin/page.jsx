'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminStatCard from '@/components/admin/AdminStatCard';
import RegistrationModal from '@/components/admin/RegistrationModal';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { getTeams, getAdminDashboardStats, updateTeamStatus } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Users, ShieldCheck, Clock, Swords, Trophy, Video, ArrowRight, Check, X } from 'lucide-react';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({
    totalTeams: 0,
    approvedTeams: 0,
    pendingRegistrations: 0,
    totalPlayers: 0,
    upcomingMatches: 0,
    liveMatches: 0,
    completedMatches: 0,
    pendingProofs: 0,
  });
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const tData = await getTeams();
      const sData = await getAdminDashboardStats();
      setTeams(tData);
      setStats(sData);
      setLoading(false);
    }
    loadStats();
  }, []);

  const handleApprove = async (id) => {
    await updateTeamStatus(id, 'Approved');
    showToast('Team Registration Approved!', 'success');
    setSelectedTeam(null);
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Approved', verified: true } : t)));
    // Refresh stats
    const sData = await getAdminDashboardStats();
    setStats(sData);
  };

  const handleReject = async (id) => {
    await updateTeamStatus(id, 'Rejected');
    showToast('Team Registration Rejected', 'error');
    setSelectedTeam(null);
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Rejected' } : t)));
    // Refresh stats
    const sData = await getAdminDashboardStats();
    setStats(sData);
  };

  return (
    <div className="space-y-8">
      
      {/* DASHBOARD STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard title="Registered Squads" value={stats.totalTeams} subtext="Total Applications" icon={Users} color="gold" />
        <AdminStatCard title="Approved Squads" value={stats.approvedTeams} subtext="Verified Squads" icon={ShieldCheck} color="green" />
        <AdminStatCard title="Pending Approvals" value={stats.pendingRegistrations} subtext="Requires Review" icon={Clock} color="amber" />
        <AdminStatCard title="Total Players" value={stats.totalPlayers} subtext="Roster Ranks" icon={Users} color="cyan" />
        <AdminStatCard title="Upcoming Matches" value={stats.upcomingMatches} subtext="Scheduled Lobbies" icon={Swords} color="cyan" />
        <AdminStatCard title="Completed Matches" value={stats.completedMatches} subtext="Results Published" icon={Trophy} color="gold" />
        <AdminStatCard title="Pending Proofs" value={stats.pendingProofs} subtext="POV Reviews" icon={Video} color="red" />
      </div>

      {/* QUICK SHORTCUTS & RECENT REGISTRATIONS QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT PENDING REGISTRATIONS QUEUE */}
        <div className="lg:col-span-2 bg-bgmi-surface border border-bgmi-border rounded-xl p-6 clip-tactical space-y-4">
          <div className="flex items-center justify-between border-b border-bgmi-border/60 pb-3">
            <h3 className="font-display font-bold text-base text-white uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-bgmi-gold" /> Pending Squad Approvals Queue
            </h3>
            <Link href="/admin/registrations" className="text-xs text-bgmi-gold font-bold hover:underline flex items-center gap-1">
              View All Registrations <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bgmi-dark text-slate-400 font-display font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Team</th>
                  <th className="p-3">Captain</th>
                  <th className="p-3">Registration ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bgmi-border/40">
                {teams.slice(0, 5).map((team) => (
                  <tr key={team.id} className="hover:bg-bgmi-dark/40">
                    <td className="p-3">
                      <p className="font-bold text-white text-sm">{team.name}</p>
                    </td>
                    <td className="p-3 text-slate-300">{team.captain?.name}</td>
                    <td className="p-3 font-mono text-bgmi-gold font-bold">{team.registrationId}</td>
                    <td className="p-3">
                      <Badge variant={team.status === 'Approved' ? 'green' : team.status === 'Rejected' ? 'rejected' : 'pending'} size="sm">
                        {team.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => setSelectedTeam(team)}
                        className="px-2 py-1 bg-bgmi-dark hover:bg-bgmi-border text-slate-200 rounded font-bold"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* QUICK CONTROL CENTER SHORTCUTS */}
        <div className="bg-bgmi-surface border border-bgmi-border rounded-xl p-6 clip-tactical space-y-4">
          <h3 className="font-display font-bold text-base text-white uppercase border-b border-bgmi-border/60 pb-3">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <Link href="/admin/results" className="block">
              <div className="p-4 bg-gradient-to-r from-bgmi-gold/15 to-bgmi-dark border border-bgmi-gold/40 rounded-xl hover:border-bgmi-gold transition-colors flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-bgmi-gold" /> Enter Live Match Results
                </span>
                <span>→</span>
              </div>
            </Link>

            <Link href="/admin/matches" className="block">
              <div className="p-4 bg-bgmi-dark border border-bgmi-border rounded-xl hover:border-bgmi-cyan transition-colors flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-bgmi-cyan" /> Schedule Custom Lobby
                </span>
                <span>→</span>
              </div>
            </Link>

            <Link href="/admin/announcements" className="block">
              <div className="p-4 bg-bgmi-dark border border-bgmi-border rounded-xl hover:border-white transition-colors flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-slate-300" /> Post Tournament Bulletin
                </span>
                <span>→</span>
              </div>
            </Link>
          </div>
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
