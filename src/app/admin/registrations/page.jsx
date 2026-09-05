'use client';

import React, { useState, useEffect } from 'react';
import RegistrationModal from '@/components/admin/RegistrationModal';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { getTeams, updateTeamStatus, deleteTeam } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { ClipboardList, Check, X, Eye, Trash2 } from 'lucide-react';

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

  const handleApprove = async (teamOrId) => {
    const targetId = typeof teamOrId === 'object' ? (teamOrId.id || teamOrId._id || teamOrId.registrationId) : teamOrId;
    
    // 1. Instant local UI update (no reload required!)
    setTeams((prev) =>
      prev.map((t) => ((t.id || t._id) === targetId || t.registrationId === targetId ? { ...t, status: 'Approved', verified: true } : t))
    );
    if (selectedTeam && ((selectedTeam.id || selectedTeam._id) === targetId || selectedTeam.registrationId === targetId)) {
      setSelectedTeam((prev) => prev ? { ...prev, status: 'Approved', verified: true } : null);
    }

    showToast('Squad Registration Approved! Notification Email Dispatched.', 'success');

    try {
      await updateTeamStatus(targetId, 'Approved');
      const refreshed = await getTeams();
      if (refreshed && Array.isArray(refreshed) && refreshed.length > 0) {
        setTeams(refreshed);
      }
    } catch (err) {
      console.error('Approval sync error:', err);
    }
  };

  const handleReject = async (teamOrId) => {
    const targetId = typeof teamOrId === 'object' ? (teamOrId.id || teamOrId._id || teamOrId.registrationId) : teamOrId;
    
    // 1. Instant local UI update (no reload required!)
    setTeams((prev) =>
      prev.map((t) => ((t.id || t._id) === targetId || t.registrationId === targetId ? { ...t, status: 'Rejected', verified: false } : t))
    );
    if (selectedTeam && ((selectedTeam.id || selectedTeam._id) === targetId || selectedTeam.registrationId === targetId)) {
      setSelectedTeam((prev) => prev ? { ...prev, status: 'Rejected', verified: false } : null);
    }

    showToast('Squad Registration Rejected.', 'info');

    try {
      await updateTeamStatus(targetId, 'Rejected');
      const refreshed = await getTeams();
      if (refreshed && Array.isArray(refreshed) && refreshed.length > 0) {
        setTeams(refreshed);
      }
    } catch (err) {
      console.error('Rejection sync error:', err);
    }
  };

  const handleDelete = async (teamOrId) => {
    const targetId = typeof teamOrId === 'object' ? (teamOrId.id || teamOrId._id) : teamOrId;
    if (window.confirm('Are you sure you want to delete this squad registration permanently?')) {
      const res = await deleteTeam(targetId);
      if (res) {
        showToast('Team registration deleted', 'info');
        setSelectedTeam(null);
        setTeams((prev) => prev.filter((t) => (t.id || t._id) !== targetId));
        const refreshed = await getTeams();
        if (refreshed) setTeams(refreshed);
      } else {
        showToast('Failed to delete team', 'error');
      }
    }
  };

  const filteredTeams = filter === 'All' ? teams : teams.filter((t) => t.status === filter);

  return (
    <div className="space-y-6 max-w-full overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-5">
        <div>
          <span className="text-[10px] font-mono text-bgmi-red font-bold uppercase tracking-widest block">
            /// OPERATIONS CONTROL
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5 mt-1">
            <ClipboardList className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> 
            Registration Approvals
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-1">
            Review submitted squad rosters, verify player details, and approve official entry into tournaments.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3.5 py-1.5 text-xs font-display font-bold uppercase rounded-xl border transition-all whitespace-nowrap shadow-editorial-sm ${
                filter === status
                  ? 'bg-slate-950 text-white border-slate-950 dark:bg-bgmi-red dark:text-white dark:border-bgmi-red'
                  : 'bg-white text-slate-700 border-[#E7E3DA] dark:bg-[#121620] dark:text-slate-400 dark:border-[#1E2638] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE WITH EDITORIAL CARD CONTAINER */}
      <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl shadow-editorial-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead className="bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-600 dark:text-slate-400 font-mono font-bold uppercase text-[10px] border-b border-[#E7E3DA] dark:border-[#1E2638]">
              <tr>
                <th className="p-4 whitespace-nowrap min-w-[150px]">Team</th>
                <th className="p-4 whitespace-nowrap min-w-[160px]">Captain Contact</th>
                <th className="p-4 whitespace-nowrap min-w-[130px]">Reg ID</th>
                <th className="p-4 whitespace-nowrap min-w-[120px]">Applied Date</th>
                <th className="p-4 whitespace-nowrap min-w-[100px]">Status</th>
                <th className="p-4 whitespace-nowrap text-right min-w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DA] dark:divide-[#1E2638]">
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => {
                  const tId = team.id || team._id;
                  return (
                    <tr
                      key={tId}
                      className="hover:bg-slate-50/70 dark:hover:bg-[#181E2C]/50 transition-colors"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <p className="font-display font-bold text-slate-900 dark:text-white text-sm">{team.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{team.college || 'College Squad'}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-800 dark:text-slate-300">
                        <p className="font-bold">{team.captain?.name || 'N/A'}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{team.captain?.phone || team.captain?.email || ''}</p>
                      </td>
                      <td className="p-4 whitespace-nowrap font-mono font-bold text-amber-600 dark:text-bgmi-gold">{team.registrationId}</td>
                      <td className="p-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{team.registrationDate || 'Recent'}</td>
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
                          {team.status === 'Pending' ? (
                            <>
                              <Button variant="primary" size="sm" icon={Check} onClick={() => handleApprove(team)}>
                                Approve
                              </Button>
                              <Button variant="danger" size="sm" icon={X} onClick={() => handleReject(team)}>
                                Reject
                              </Button>
                            </>
                          ) : (
                            <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(team)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400 font-mono text-xs">
                    No squad registrations found matching &quot;{filter}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      <RegistrationModal
        team={selectedTeam}
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />
    </div>
  );
}
