'use client';

import React, { useState, useEffect } from 'react';
import RegistrationModal from '@/components/admin/RegistrationModal';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { getTeams, updateTeamStatus } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { ClipboardList, Search, Check, X, Eye } from 'lucide-react';

export default function AdminRegistrationsPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getTeams();
      setTeams(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleApprove = async (id) => {
    await updateTeamStatus(id, 'Approved');
    showToast('Team Registration Approved!', 'success');
    setSelectedTeam(null);
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Approved', verified: true } : t)));
  };

  const handleReject = async (id) => {
    await updateTeamStatus(id, 'Rejected');
    showToast('Team Registration Rejected', 'error');
    setSelectedTeam(null);
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Rejected' } : t)));
  };

  const filteredTeams = filter === 'All' ? teams : teams.filter((t) => t.status === filter);

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-bgmi-border/60 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-bgmi-gold" /> Registration Approvals Manager
          </h1>
          <p className="text-xs text-slate-400">Review submitted squad applications, college IDs, and approve tournament entry.</p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg border transition-all ${
                filter === status
                  ? 'bg-bgmi-gold text-slate-950 border-amber-300'
                  : 'bg-bgmi-surface text-slate-400 border-bgmi-border hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-bgmi-surface border border-bgmi-border rounded-xl overflow-hidden clip-tactical shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-bgmi-dark text-slate-400 font-display font-bold uppercase text-[10px] border-b border-bgmi-border">
            <tr>
              <th className="p-4">Team</th>
              <th className="p-4">Captain Contact</th>
              <th className="p-4">Reg ID</th>
              <th className="p-4">Applied Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bgmi-border/40">
            {filteredTeams.map((team) => (
              <tr key={team.id} className="hover:bg-bgmi-dark/40 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-white text-sm">{team.name}</p>
                </td>
                <td className="p-4 text-slate-300">
                  <p className="font-bold">{team.captain?.name}</p>
                  <p className="text-[11px] text-slate-400">{team.captain?.phone}</p>
                </td>
                <td className="p-4 font-mono font-bold text-bgmi-gold">{team.registrationId}</td>
                <td className="p-4 text-slate-400">{team.registrationDate}</td>
                <td className="p-4">
                  <Badge variant={team.status === 'Approved' ? 'green' : team.status === 'Rejected' ? 'rejected' : 'pending'} size="sm">
                    {team.status}
                  </Badge>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedTeam(team)}>
                    View Application
                  </Button>
                  {team.status === 'Pending' && (
                    <>
                      <Button variant="primary" size="sm" icon={Check} onClick={() => handleApprove(team.id)}>
                        Approve
                      </Button>
                      <Button variant="danger" size="sm" icon={X} onClick={() => handleReject(team.id)}>
                        Reject
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REGISTRATION MODAL */}
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
