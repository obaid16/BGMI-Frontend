'use client';

import React, { useState, useEffect } from 'react';
import RegistrationModal from '@/components/admin/RegistrationModal';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { getTeams, updateTeamStatus, deleteTeam } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { ClipboardList, Search, Check, X, Eye, Trash2 } from 'lucide-react';

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
    <div className="space-y-8 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-premium-border pb-6">
        <div>
          <h1 className="font-bold text-3xl text-premium-text tracking-tight flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-amber-600" /> Registration Approvals
          </h1>
          <p className="text-sm text-premium-text-secondary font-medium mt-2">Review submitted squad applications, college IDs, and approve tournament entry.</p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-[12px] border transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-black text-white border-black shadow-premium-soft'
                  : 'bg-premium-background text-premium-text-secondary border-premium-border hover:border-premium-text/30 hover:text-premium-text'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE WITH SIDEWAYS TOUCH SCROLL */}
      <div className="bg-premium-surface border border-premium-border rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[900px]">
            <thead className="bg-premium-background text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest border-b border-premium-border">
              <tr>
                <th className="px-6 py-4 min-w-[200px]">Team</th>
                <th className="px-6 py-4 min-w-[200px]">Captain Contact</th>
                <th className="px-6 py-4 min-w-[140px]">Reg ID</th>
                <th className="px-6 py-4 min-w-[140px]">Applied Date</th>
                <th className="px-6 py-4 min-w-[120px]">Status</th>
                <th className="px-6 py-4 text-right min-w-[220px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-premium-border bg-white">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-premium-surface-soft transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-base text-premium-text tracking-tight">{team.name}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-semibold text-premium-text">{team.captain?.name || 'N/A'}</p>
                    <p className="text-[11px] text-premium-text-secondary font-medium mt-0.5">{team.captain?.phone || ''}</p>
                  </td>
                  <td className="px-6 py-5 font-semibold text-premium-sage">{team.registrationId}</td>
                  <td className="px-6 py-5 font-medium text-premium-text-secondary">{team.registrationDate}</td>
                  <td className="px-6 py-5">
                    <Badge variant={team.status === 'Approved' ? 'green' : team.status === 'Rejected' ? 'rejected' : 'pending'} size="sm">
                      {team.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedTeam(team)}>
                        View
                      </Button>
                      {team.status === 'Pending' ? (
                        <>
                          <Button variant="primary" size="sm" icon={Check} onClick={() => handleApprove(team.id)}>
                            Approve
                          </Button>
                          <Button variant="danger" size="sm" icon={X} onClick={() => handleReject(team.id)}>
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(team.id)}>
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTeams.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm font-medium text-premium-text-secondary bg-white">
                    No registrations found for this status.
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
