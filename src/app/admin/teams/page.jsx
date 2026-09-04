'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { getTeams, updateTeamStatus, deleteTeam, bulkDeleteTeams } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Users, Plus, ShieldCheck, Trash2, Edit3, CheckSquare, Square } from 'lucide-react';

export default function AdminTeamsPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Form states
  const [newTeamName, setNewTeamName] = useState('');
  const [newCollege, setNewCollege] = useState('NIT');
  const [newTeamLogo, setNewTeamLogo] = useState('');

  useEffect(() => {
    async function loadData() {
      const data = await getTeams();
      setTeams(data);
    }
    loadData();
  }, []);

  const handleCreateTeam = (e) => {
    e.preventDefault();
    const logoUrl = newTeamLogo.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80';
    const newTeam = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      shortName: newTeamName.substring(0, 5).toUpperCase(),
      college: newCollege,
      logo: logoUrl,
      rank: teams.length + 1,
      points: 0,
      wwcd: 0,
      kills: 0,
      verified: true,
      status: 'Approved',
      registrationId: `BGMI-2026-MANUAL-${teams.length + 1}`,
      players: [
        { name: 'Player 1', ign: 'P1_IGL', bgmiId: '5123987410', role: 'IGL', verified: true },
        { name: 'Player 2', ign: 'P2_FRAGGER', bgmiId: '5123987411', role: 'Assaulter', verified: true },
      ],
    };

    setTeams([newTeam, ...teams]);
    showToast('New Team Created Successfully!', 'success');
    setIsAddModalOpen(false);
    setNewTeamName('');
    setNewCollege('');
    setNewTeamLogo('');
  };

  const handleDeleteTeam = async (id) => {
    if (deletingId) return;
    if (window.confirm('Are you sure you want to delete this squad profile entirely? This will also remove the players.')) {
      try {
        setDeletingId(id);
        const res = await deleteTeam(id);
        if (res) {
          setSelectedIds((prev) => prev.filter((item) => item !== id));
          setTeams((prev) => prev.filter((t) => (t.id || t._id) !== id));
          showToast('Team Roster Removed successfully', 'success');
        } else {
          showToast('Failed to remove team', 'error');
        }
      } catch (err) {
        showToast('An error occurred while deleting team', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allIds = teams.map((t) => t.id || t._id);
    if (selectedIds.length === allIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    if (window.confirm(`⚠️ Permanently delete ${count} selected squad rosters? This will remove all their players as well.`)) {
      try {
        setIsBulkDeleting(true);
        const toDelete = [...selectedIds];
        setTeams((prev) => prev.filter((t) => !toDelete.includes(t.id || t._id)));
        setSelectedIds([]);
        await bulkDeleteTeams(toDelete);
        showToast(`Successfully deleted ${count} squad rosters!`, 'success');
        const refreshed = await getTeams();
        if (refreshed) setTeams(refreshed);
      } catch (err) {
        console.error('Bulk delete teams error:', err);
        showToast('Failed to bulk delete squads', 'error');
      } finally {
        setIsBulkDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> Squad Roster Management
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Add, edit, verify, or remove participating tournament squads.</p>
        </div>

        <div className="flex items-center gap-3">
          {teams.length > 0 && (
            <Button
              variant="secondary"
              size="md"
              onClick={toggleSelectAll}
            >
              {selectedIds.length === teams.length ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          <Button variant="primary" size="md" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add New Squad
          </Button>
        </div>
      </div>

      {/* BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="bg-rose-500/10 border-2 border-rose-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-rose-500 text-white font-mono font-black text-xs rounded-lg">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {selectedIds.length === 1 ? '1 Squad Selected' : `${selectedIds.length} Squads Selected`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedIds([])}
              disabled={isBulkDeleting}
            >
              Cancel Selection
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

      {/* TEAMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const tId = team.id || team._id;
          const isSelected = selectedIds.includes(tId);
          return (
            <div
              key={tId}
              className={`bg-white dark:bg-bgmi-surface border rounded-xl p-5 clip-tactical space-y-4 shadow-md dark:shadow-xl transition-all duration-200 ${
                isSelected
                  ? 'border-rose-500 ring-2 ring-rose-500/30 dark:bg-rose-950/10'
                  : 'border-slate-200 dark:border-bgmi-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(tId)}
                    aria-label={`Select ${team.name}`}
                    className="w-4 h-4 rounded border-slate-300 dark:border-bgmi-border text-bgmi-red focus:ring-bgmi-red cursor-pointer accent-red-600"
                  />
                  <span className="font-display font-black text-lg text-amber-600 dark:text-bgmi-gold">#{team.rank}</span>
                </div>
                <Badge variant={team.verified ? 'green' : 'pending'} size="sm">
                  {team.verified ? 'Verified' : 'Pending'}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-lg border border-slate-200 dark:border-bgmi-border object-cover shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white line-clamp-1">{team.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Captain: {team.captain?.name || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-bgmi-border/40 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">{team.players?.length || 4} Squad Members</span>
                <button
                  onClick={() => handleDeleteTeam(tId)}
                  disabled={deletingId === tId}
                  className={`text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 font-bold ${
                    deletingId === tId ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Squad
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD SQUAD MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Team Roster" maxWidth="max-w-md">
        <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Team / Squad Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Cyber Knights"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">College</label>
            <input
              type="text"
              readOnly
              value={newCollege}
              className="w-full p-2.5 bg-slate-100 dark:bg-bgmi-dark/60 border border-slate-200 dark:border-bgmi-border/40 rounded-lg text-slate-500 dark:text-slate-400 font-bold select-none cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Team / Squad Logo URL</label>
            <input
              type="text"
              placeholder="Paste Logo Image URL or leave blank for default"
              value={newTeamLogo}
              onChange={(e) => setNewTeamLogo(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" size="md" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Create Team
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
