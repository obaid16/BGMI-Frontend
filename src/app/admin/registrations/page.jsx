'use client';

import React, { useState, useEffect } from 'react';
import RegistrationModal from '@/components/admin/RegistrationModal';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal';
import { getTeams, updateTeamStatus, deleteTeam } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { ClipboardList, Search, Check, X, Eye, Trash2, RotateCw } from 'lucide-react';

export default function AdminRegistrationsPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: null,
    loading: false,
  });

  const loadData = async (bypass = true) => {
    try {
      const data = await getTeams('All', '', bypass);
      if (Array.isArray(data)) {
        setTeams(data);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData(true);

    // Dynamic auto-polling every 8 seconds so new registrations appear instantly
    const interval = setInterval(() => {
      loadData(true);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await loadData(true);
    showToast('Registrations Refreshed', 'info');
  };

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
      const refreshed = await getTeams('All', '', true);
      if (refreshed && Array.isArray(refreshed)) {
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
      const refreshed = await getTeams('All', '', true);
      if (refreshed && Array.isArray(refreshed)) {
        setTeams(refreshed);
      }
    } catch (err) {
      console.error('Rejection sync error:', err);
    }
  };

  const handleDelete = (teamOrId) => {
    const targetId = typeof teamOrId === 'object' ? (teamOrId.id || teamOrId._id) : teamOrId;
    const squadName = typeof teamOrId === 'object' ? teamOrId.name : 'this squad';

    setConfirmModal({
      isOpen: true,
      title: 'Delete Squad Registration?',
      description: `Are you sure you want to delete the registration for ${squadName}? This action cannot be undone.`,
      confirmText: 'Delete Registration',
      loading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          const res = await deleteTeam(targetId);
          if (res) {
            showToast('Team registration deleted', 'info');
            setSelectedTeam(null);
            setTeams((prev) => prev.filter((t) => (t.id || t._id) !== targetId));
            const refreshed = await getTeams('All', '', true);
            if (refreshed && Array.isArray(refreshed)) setTeams(refreshed);
          } else {
            showToast('Failed to delete team', 'error');
          }
        } catch (err) {
          showToast('An error occurred while deleting registration', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
        }
      },
    });
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

        {/* Action Controls & Status Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing || loading}
            className="p-2.5 bg-premium-surface border border-premium-border rounded-[12px] text-premium-text hover:bg-premium-surface-soft transition-colors shadow-sm disabled:opacity-50"
            title="Refresh Registrations"
          >
            <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
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
              {filteredTeams.map((team) => {
                const teamId = team.id || team._id;
                const teamName = team.name || team.teamName;
                const captainName = team.captain?.name || team.captainName || 'N/A';
                const captainPhone = team.captain?.phone || team.captainPhone || '';
                const regDate = team.registrationDate || (team.createdAt ? new Date(team.createdAt).toISOString().split('T')[0] : 'Today');

                return (
                  <tr key={teamId} className="hover:bg-premium-surface-soft transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-base text-premium-text tracking-tight">{teamName}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-semibold text-premium-text">{captainName}</p>
                      <p className="text-[11px] text-premium-text-secondary font-medium mt-0.5">{captainPhone}</p>
                    </td>
                    <td className="px-6 py-5 font-semibold text-premium-sage">{team.registrationId}</td>
                    <td className="px-6 py-5 font-medium text-premium-text-secondary">{regDate}</td>
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
                            <Button variant="primary" size="sm" icon={Check} onClick={() => handleApprove(teamId)}>
                              Approve
                            </Button>
                            <Button variant="danger" size="sm" icon={X} onClick={() => handleReject(teamId)}>
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(teamId)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredTeams.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm font-medium text-premium-text-secondary bg-white">
                    {loading ? 'Loading registrations...' : 'No registrations found for this status.'}
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

      {/* CUSTOM CONFIRMATION MODAL */}
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
