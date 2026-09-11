'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { getTeams, verifyPlayerStatus, deletePlayer, bulkDeletePlayers, updatePlayer } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { UserCheck, Search, Trash2, Edit3, Flame, Award, Check, X, CheckSquare, Square } from 'lucide-react';

export default function AdminPlayersPage() {
  const { showToast } = useToast();
  const [allPlayers, setAllPlayers] = useState([]);
  const [squadFilter, setSquadFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // Confirm Modal state (custom alert instead of window.confirm)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Delete',
    onConfirm: null,
    loading: false,
  });

  // Edit Player Modal state
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editIgn, setEditIgn] = useState('');
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('Assaulter');
  const [editKills, setEditKills] = useState(0);
  const [editMatchesPlayed, setEditMatchesPlayed] = useState(1);

  // Live Auto-Calculated K/D Ratio
  const computedKdRatio = (
    (parseInt(editKills, 10) || 0) / Math.max(1, parseInt(editMatchesPlayed, 10) || 1)
  ).toFixed(2);

  async function loadData() {
    const teams = await getTeams('All', '', true);
    const playersList = [];
    (teams || []).forEach((t) => {
      t.players?.forEach((p) => {
        playersList.push({
          ...p,
          id: p.id || p._id,
          teamName: t.name || t.teamName,
          college: t.college,
          matchesPlayed: p.matchesPlayed || t.matchesPlayed || 1,
        });
      });
    });
    setAllPlayers(playersList);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredPlayers = useMemo(() => {
    const q = squadFilter.trim().toLowerCase();
    if (!q) return allPlayers;
    return allPlayers.filter((player) =>
      player.teamName?.toLowerCase().includes(q) ||
      player.ign?.toLowerCase().includes(q) ||
      player.name?.toLowerCase().includes(q)
    );
  }, [allPlayers, squadFilter]);

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = filteredPlayers.length > 0 && filteredPlayers.every((p) => selectedIds.includes(p.id || p._id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const currentFilteredIds = filteredPlayers.map((p) => p.id || p._id);
      setSelectedIds((prev) => prev.filter((id) => !currentFilteredIds.includes(id)));
    } else {
      const newIds = new Set([...selectedIds, ...filteredPlayers.map((p) => p.id || p._id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const handleOpenEdit = (player) => {
    setEditingPlayer(player);
    setEditIgn(player.ign || '');
    setEditName(player.name || '');
    setEditRole(player.role || 'Assaulter');
    setEditKills(player.kills || 0);
    setEditMatchesPlayed(player.matchesPlayed || 1);
  };

  const handleSavePlayerStats = async (e) => {
    e.preventDefault();
    if (!editingPlayer) return;

    const pId = editingPlayer.id || editingPlayer._id;
    const killsVal = parseInt(editKills, 10) || 0;
    const matchesVal = Math.max(1, parseInt(editMatchesPlayed, 10) || 1);
    const kdVal = parseFloat((killsVal / matchesVal).toFixed(2));

    const updatedData = {
      ign: editIgn,
      name: editName,
      role: editRole,
      kills: killsVal,
      matchesPlayed: matchesVal,
      kdRatio: kdVal,
    };

    const res = await updatePlayer(pId, updatedData);
    if (res) {
      setAllPlayers((prev) =>
        prev.map((p) => ((p.id || p._id) === pId ? { ...p, ...res, ...updatedData } : p))
      );
      showToast(`Updated stats for ${editIgn}: ${killsVal} Kills (K/D: ${kdVal})`, 'success');
      setEditingPlayer(null);
    } else {
      showToast('Failed to update player stats', 'error');
    }
  };

  const handleUpdateStatus = async (playerId, newStatus) => {
    const res = await verifyPlayerStatus(playerId, newStatus);
    if (res) {
      setAllPlayers((prev) =>
        prev.map((p) =>
          (p.id || p._id) === playerId
            ? { ...p, verificationStatus: newStatus, verified: newStatus === 'Verified' }
            : p
        )
      );
      showToast(`Player Status Updated to ${newStatus}`, 'success');
    } else {
      showToast('Failed to update player status', 'error');
    }
  };

  // Custom Alert Trigger: Single Player Deletion
  const handleDeletePlayerPrompt = (player) => {
    const pId = player.id || player._id;
    const pName = player.ign || player.name || 'this player';

    setConfirmModal({
      isOpen: true,
      title: `Delete Player "${pName}"?`,
      description: `Are you sure you want to remove ${pName} from ${player.teamName || 'their team'}? This action cannot be undone.`,
      confirmText: 'Delete Player',
      loading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          const res = await deletePlayer(pId);
          if (res) {
            setAllPlayers((prev) => prev.filter((p) => (p.id || p._id) !== pId));
            setSelectedIds((prev) => prev.filter((id) => id !== pId));
            showToast(`Player "${pName}" removed from roster`, 'success');
          } else {
            showToast('Failed to remove player', 'error');
          }
        } catch (err) {
          showToast('An error occurred while removing player', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
        }
      },
    });
  };

  // Custom Alert Trigger: Bulk Player Deletion
  const handleBulkDeletePrompt = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;

    setConfirmModal({
      isOpen: true,
      title: `Delete ${count} Selected Players?`,
      description: `Are you sure you want to permanently delete these ${count} selected players from their rosters? This action cannot be undone.`,
      confirmText: `Delete ${count} Players`,
      loading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          const success = await bulkDeletePlayers(selectedIds);
          if (success) {
            setAllPlayers((prev) => prev.filter((p) => !selectedIds.includes(p.id || p._id)));
            setSelectedIds([]);
            showToast(`Successfully removed ${count} players from rosters`, 'success');
          } else {
            showToast('Failed to perform bulk deletion', 'error');
          }
        } catch (err) {
          showToast('An error occurred during bulk deletion', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-premium-border pb-6">
        <div>
          <h1 className="font-bold text-3xl text-premium-text tracking-tight flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-amber-600" /> Player Rosters & MVP Stats
          </h1>
          <p className="text-sm text-premium-text-secondary font-medium mt-2">Manage players, update tournament stats, and bulk manage rosters.</p>
        </div>

        {/* BULK DELETE ACTION BUTTON WHEN PLAYERS SELECTED */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200">
            <span className="text-xs font-bold text-premium-text-secondary uppercase tracking-widest bg-premium-surface px-3 py-1.5 rounded-lg border border-premium-border">
              {selectedIds.length} Selected
            </span>
            <Button
              variant="danger"
              size="md"
              icon={Trash2}
              onClick={handleBulkDeletePrompt}
            >
              Bulk Delete ({selectedIds.length})
            </Button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs font-bold text-premium-text-secondary hover:text-black uppercase tracking-widest px-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-premium-surface border border-premium-border rounded-[24px] p-5 shadow-sm">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-4 w-4 text-premium-text-secondary" />
          </span>
          <input
            type="text"
            placeholder="Search Player or Squad..."
            value={squadFilter}
            onChange={(e) => setSquadFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {squadFilter && (
            <button
              onClick={() => setSquadFilter('')}
              className="text-xs font-bold text-premium-text-secondary hover:text-black uppercase tracking-widest transition-colors"
            >
              Clear Filter
            </button>
          )}

          <div className="text-xs font-bold text-premium-text-secondary uppercase tracking-widest">
            Total: <strong className="text-premium-text">{filteredPlayers.length}</strong> Players
          </div>
        </div>
      </div>

      {/* PLAYERS TABLE WITH HORIZONTAL SCROLL */}
      <div className="bg-premium-surface border border-premium-border rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[1000px]">
            <thead className="bg-premium-background text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest border-b border-premium-border">
              <tr>
                {/* SELECT ALL CHECKBOX */}
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-premium-border text-black focus:ring-0 cursor-pointer accent-black"
                    title="Select All Players"
                  />
                </th>
                <th className="px-6 py-4">Player & IGN</th>
                <th className="px-6 py-4">Squad</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Matches</th>
                <th className="px-6 py-4 text-center">Total Kills</th>
                <th className="px-6 py-4 text-center">K/D Ratio</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-premium-border bg-white">
              {filteredPlayers.map((player) => {
                const pId = player.id || player._id;
                const isSelected = selectedIds.includes(pId);
                const isVerified = player.verificationStatus === 'Verified' || player.verified;
                const isRejected = player.verificationStatus === 'Rejected';
                const statusLabel = player.verificationStatus || (player.verified ? 'Verified' : 'Pending');
                const pKills = player.kills || 0;
                const pMatches = player.matchesPlayed || 1;
                const pKd = player.kdRatio || (pKills / Math.max(1, pMatches));
                
                return (
                  <tr key={pId} className={`transition-colors ${isSelected ? 'bg-amber-50/40' : 'hover:bg-premium-surface-soft'}`}>
                    {/* ROW SELECTION CHECKBOX */}
                    <td className="px-6 py-5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(pId)}
                        className="w-4 h-4 rounded border-premium-border text-black focus:ring-0 cursor-pointer accent-black"
                      />
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-bold text-base text-premium-text tracking-tight">{player.ign}</p>
                      <p className="text-xs text-premium-text-secondary font-medium mt-0.5">{player.name}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-semibold text-premium-text">{player.teamName || 'Squad'}</p>
                    </td>
                    <td className="px-6 py-5"><Badge variant="default" size="sm">{player.role || 'Player'}</Badge></td>
                    
                    {/* MATCHES PLAYED COLUMN */}
                    <td className="px-6 py-5 text-center font-semibold text-premium-text-secondary">
                      {pMatches} M
                    </td>

                    {/* KILLS COLUMN */}
                    <td className="px-6 py-5 text-center">
                      <span className="font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-sm inline-flex items-center gap-1.5 border border-amber-200">
                        <Flame className="w-3.5 h-3.5 text-amber-600" /> {pKills}
                      </span>
                    </td>

                    {/* AUTO-CALCULATED K/D RATIO COLUMN */}
                    <td className="px-6 py-5 text-center font-bold text-sky-700">
                      {pKd.toFixed(2)}
                    </td>

                    <td className="px-6 py-5">
                      <Badge variant={isVerified ? 'green' : isRejected ? 'rejected' : 'pending'} size="sm">
                        {statusLabel}
                      </Badge>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Edit3}
                          onClick={() => handleOpenEdit(player)}
                        >
                          Edit
                        </Button>
                        {!isVerified && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Check}
                            onClick={() => handleUpdateStatus(pId, 'Verified')}
                          >
                            Verify
                          </Button>
                        )}
                        {!isRejected && (
                          <Button
                            variant="danger"
                            size="sm"
                            icon={X}
                            onClick={() => handleUpdateStatus(pId, 'Rejected')}
                          >
                            Reject
                          </Button>
                        )}
                        <button
                          onClick={() => handleDeletePlayerPrompt(player)}
                          className="w-9 h-9 flex items-center justify-center rounded-[10px] text-rose-500 bg-white border border-premium-border hover:border-rose-300 hover:bg-rose-50 transition-colors shadow-sm"
                          title="Delete Player"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPlayers.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-sm font-medium text-premium-text-secondary bg-white">
                    No players found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT PLAYER STATS MODAL */}
      {editingPlayer && (
        <Modal
          isOpen={!!editingPlayer}
          onClose={() => setEditingPlayer(null)}
          title={`Update Stats: ${editingPlayer.ign}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSavePlayerStats} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">In-Game Name (IGN)</label>
                <input
                  type="text"
                  required
                  value={editIgn}
                  onChange={(e) => setEditIgn(e.target.value)}
                  className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text shadow-sm appearance-none cursor-pointer"
              >
                <option value="Assaulter">Assaulter</option>
                <option value="IGL">IGL (In-Game Leader)</option>
                <option value="Sniper">Sniper</option>
                <option value="Support">Support</option>
                <option value="Fragger">Fragger</option>
              </select>
            </div>

            {/* MATCH STATS INPUTS & LIVE AUTO K/D CALCULATION */}
            <div className="p-5 bg-premium-background rounded-[16px] border border-premium-border space-y-4">
              <div className="flex items-center justify-between border-b border-premium-border pb-3">
                <span className="font-bold text-premium-text text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" /> Match Stats
                </span>
                <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded uppercase tracking-widest border border-sky-100">Live Auto-Calculated</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Total Kills</label>
                  <input
                    type="number"
                    min="0"
                    value={editKills}
                    onChange={(e) => setEditKills(e.target.value)}
                    className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-amber-700 font-bold text-center text-lg focus:outline-none focus:border-amber-400 shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Matches Played</label>
                  <input
                    type="number"
                    min="1"
                    value={editMatchesPlayed}
                    onChange={(e) => setEditMatchesPlayed(e.target.value)}
                    className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-center text-lg focus:outline-none focus:border-premium-text shadow-sm"
                  />
                </div>
              </div>

              {/* AUTO-COMPUTED K/D RATIO PREVIEW */}
              <div className="p-4 bg-white rounded-[12px] border border-sky-200 shadow-sm flex items-center justify-between">
                <span className="text-[11px] text-premium-text-secondary font-bold uppercase tracking-widest">Computed K/D Ratio</span>
                <span className="font-bold text-2xl text-sky-700 tracking-tight">
                  {computedKdRatio}
                </span>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setEditingPlayer(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save & Update
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* CUSTOM CONFIRMATION MODAL (REPLACES BROWSER WINDOW.CONFIRM) */}
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
