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
    <div className="space-y-6 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> Registration Approvals Manager
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Review submitted squad applications, college IDs, and approve tournament entry.</p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 table-scroll-container">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg border transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-amber-500 text-slate-950 border-amber-400 dark:bg-bgmi-gold dark:border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 dark:bg-bgmi-surface dark:text-slate-400 dark:border-bgmi-border hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE WITH SIDEWAYS TOUCH SCROLL */}
      <div className="bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-xl shadow-md dark:shadow-xl transition-colors duration-200 table-scroll-container">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead className="bg-slate-100 dark:bg-bgmi-dark text-slate-700 dark:text-slate-400 font-display font-bold uppercase text-[10px] border-b border-slate-200 dark:border-bgmi-border">
            <tr>
              <th className="p-4 whitespace-nowrap min-w-[140px]">Team</th>
              <th className="p-4 whitespace-nowrap min-w-[160px]">Captain Contact</th>
              <th className="p-4 whitespace-nowrap min-w-[120px]">Reg ID</th>
              <th className="p-4 whitespace-nowrap min-w-[120px]">Applied Date</th>
              <th className="p-4 whitespace-nowrap min-w-[100px]">Status</th>
              <th className="p-4 whitespace-nowrap text-right min-w-[200px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-bgmi-border/40">
            {filteredTeams.map((team) => (
              <tr key={team.id} className="hover:bg-slate-50 dark:hover:bg-bgmi-dark/40 transition-colors">
                <td className="p-4 whitespace-nowrap">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{team.name}</p>
                </td>
                <td className="p-4 whitespace-nowrap text-slate-800 dark:text-slate-300">
                  <p className="font-bold">{team.captain?.name || 'N/A'}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{team.captain?.phone || ''}</p>
                </td>
                <td className="p-4 whitespace-nowrap font-mono font-bold text-amber-600 dark:text-bgmi-gold">{team.registrationId}</td>
                <td className="p-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{team.registrationDate}</td>
                <td className="p-4 whitespace-nowrap">
                  <Badge variant={team.status === 'Approved' ? 'green' : team.status === 'Rejected' ? 'rejected' : 'pending'} size="sm">
                    {team.status}
                  </Badge>
                </td>
                <td className="p-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedTeam(team)}>
                      View
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
                  </div>
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
