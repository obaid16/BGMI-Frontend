'use client';

import React, { useState, useEffect } from 'react';
import RegistrationModal from '@/components/admin/RegistrationModal';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { getTeams, updateTeamStatus, deleteTeam, bulkDeleteTeams } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { ClipboardList, Search, Check, X, Eye, Trash2, CheckSquare, Square } from 'lucide-react';

export default function AdminRegistrationsPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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
        setSelectedIds((prev) => prev.filter((id) => id !== targetId));
        setTeams((prev) => prev.filter((t) => (t.id || t._id) !== targetId));
        const refreshed = await getTeams();
        if (refreshed) setTeams(refreshed);
      } else {
        showToast('Failed to delete team', 'error');
      }
    }
  };

  const filteredTeams = filter === 'All' ? teams : teams.filter((t) => t.status === filter);

  // Bulk Selection Handlers
  const toggleSelectTeam = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentFilteredIds = filteredTeams.map((t) => t.id || t._id);
    const allSelected = currentFilteredIds.length > 0 && currentFilteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentFilteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentFilteredIds])));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (window.confirm(`⚠️ Are you sure you want to permanently delete ${count} selected squad registrations? This action cannot be undone.`)) {
      try {
        setIsBulkDeleting(true);
        const toDeleteIds = [...selectedIds];
        
        // Optimistic UI update
        setTeams((prev) => prev.filter((t) => !toDeleteIds.includes(t.id || t._id)));
        setSelectedIds([]);
        if (selectedTeam && toDeleteIds.includes(selectedTeam.id || selectedTeam._id)) {
          setSelectedTeam(null);
        }

        await bulkDeleteTeams(toDeleteIds);
        showToast(`Successfully deleted ${count} squad registrations!`, 'success');
        
        const refreshed = await getTeams();
        if (refreshed) setTeams(refreshed);
      } catch (err) {
        console.error('Bulk delete failed:', err);
        showToast('Error occurred during bulk delete', 'error');
      } finally {
        setIsBulkDeleting(false);
      }
    }
  };

  const isAllFilteredSelected = filteredTeams.length > 0 && filteredTeams.every((t) => selectedIds.includes(t.id || t._id));

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

      {/* BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="bg-rose-500/10 border-2 border-rose-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-rose-500 text-white font-mono font-black text-xs rounded-lg">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {selectedIds.length === 1 ? '1 Squad Registration Selected' : `${selectedIds.length} Squad Registrations Selected`}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedIds([])}
              disabled={isBulkDeleting}
            >
              Deselect All
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? 'Deleting...' : `Bulk Delete (${selectedIds.length})`}
            </Button>
          </div>
        </div>
      )}

      {/* TABLE WITH SIDEWAYS TOUCH SCROLL */}
      <div className="bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-xl shadow-md dark:shadow-xl transition-colors duration-200 table-scroll-container">
        <table className="w-full text-left text-xs border-collapse min-w-[750px]">
          <thead className="bg-slate-100 dark:bg-bgmi-dark text-slate-700 dark:text-slate-400 font-display font-bold uppercase text-[10px] border-b border-slate-200 dark:border-bgmi-border">
            <tr>
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllFilteredSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all squads"
                  className="w-4 h-4 rounded border-slate-300 dark:border-bgmi-border text-bgmi-red focus:ring-bgmi-red cursor-pointer accent-red-600"
                />
              </th>
              <th className="p-4 whitespace-nowrap min-w-[140px]">Team</th>
              <th className="p-4 whitespace-nowrap min-w-[160px]">Captain Contact</th>
              <th className="p-4 whitespace-nowrap min-w-[120px]">Reg ID</th>
              <th className="p-4 whitespace-nowrap min-w-[120px]">Applied Date</th>
              <th className="p-4 whitespace-nowrap min-w-[100px]">Status</th>
              <th className="p-4 whitespace-nowrap text-right min-w-[200px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-bgmi-border/40">
            {filteredTeams.map((team) => {
              const tId = team.id || team._id;
              const isSelected = selectedIds.includes(tId);
              return (
                <tr
                  key={tId}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-rose-500/10 dark:bg-rose-500/15'
                      : 'hover:bg-slate-50 dark:hover:bg-bgmi-dark/40'
                  }`}
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectTeam(tId)}
                      aria-label={`Select ${team.name}`}
                      className="w-4 h-4 rounded border-slate-300 dark:border-bgmi-border text-bgmi-red focus:ring-bgmi-red cursor-pointer accent-red-600"
                    />
                  </td>
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
              );
            })}
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
        onDelete={handleDelete}
      />
    </div>
  );
}
