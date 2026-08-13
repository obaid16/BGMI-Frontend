'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { getTeams, verifyPlayerStatus, deletePlayer, updatePlayer } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { UserCheck, Search, Trash2, Edit3, Flame, Award, Check, X } from 'lucide-react';

export default function AdminPlayersPage() {
  const { showToast } = useToast();
  const [allPlayers, setAllPlayers] = useState([]);
  const [squadFilter, setSquadFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);

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
    const teams = await getTeams();
    const playersList = [];
    teams.forEach((t) => {
      t.players?.forEach((p) => {
        playersList.push({
          ...p,
          teamName: t.name,
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
      showToast(`Updated stats for ${editIgn}: ${killsVal} Kills in ${matchesVal} Matches (K/D: ${kdVal})`, 'success');
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

  const handleDeletePlayer = async (playerId) => {
    if (deletingId) return;
    if (window.confirm('Are you sure you want to delete this player from the roster?')) {
      try {
        setDeletingId(playerId);
        const res = await deletePlayer(playerId);
        if (res) {
          setAllPlayers((prev) => prev.filter((p) => (p.id || p._id) !== playerId));
          showToast('Player removed from roster successfully', 'success');
        } else {
          showToast('Failed to remove player', 'error');
        }
      } catch (err) {
        showToast('An error occurred while removing the player', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
        <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-bgmi-cyan" /> Player Roster & MVP Stats Manager
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Update player kills, matches played, and auto-calculate K/D ratio after every match.</p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-bgmi-surface/40 p-4 rounded-xl border border-slate-200 dark:border-bgmi-border/40 shadow-sm">
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Filter by Squad or Player Name..."
            value={squadFilter}
            onChange={(e) => setSquadFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-bgmi-gold transition-colors"
          />
        </div>
        {squadFilter && (
          <button
            onClick={() => setSquadFilter('')}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* PLAYERS TABLE */}
      <div className="bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-xl overflow-hidden clip-tactical shadow-md dark:shadow-xl transition-colors duration-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-100 dark:bg-bgmi-dark text-slate-700 dark:text-slate-400 font-display font-bold uppercase text-[10px] border-b border-slate-200 dark:border-bgmi-border">
            <tr>
              <th className="p-4">Player & IGN</th>
              <th className="p-4">Squad</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Matches</th>
              <th className="p-4 text-center">Total Kills</th>
              <th className="p-4 text-center">K/D Ratio</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-bgmi-border/40">
            {allPlayers
              .filter((player) =>
                player.teamName?.toLowerCase().includes(squadFilter.toLowerCase()) ||
                player.ign?.toLowerCase().includes(squadFilter.toLowerCase()) ||
                player.name?.toLowerCase().includes(squadFilter.toLowerCase())
              )
              .map((player) => {
                const pId = player.id || player._id;
                const isVerified = player.verificationStatus === 'Verified' || player.verified;
                const isRejected = player.verificationStatus === 'Rejected';
                const statusLabel = player.verificationStatus || (player.verified ? 'Verified' : 'Pending Verification');
                const pKills = player.kills || 0;
                const pMatches = player.matchesPlayed || 1;
                const pKd = player.kdRatio || (pKills / Math.max(1, pMatches));
                
                return (
                  <tr key={pId} className="hover:bg-slate-50 dark:hover:bg-bgmi-dark/40 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{player.ign}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{player.name}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{player.teamName}</p>
                    </td>
                    <td className="p-4"><Badge variant="default" size="sm">{player.role || 'Player'}</Badge></td>
                    
                    {/* MATCHES PLAYED COLUMN */}
                    <td className="p-4 text-center font-mono font-bold text-slate-600 dark:text-slate-300">
                      {pMatches} M
                    </td>


                    {/* KILLS COLUMN */}
                    <td className="p-4 text-center">
                      <span className="font-mono font-bold text-bgmi-gold text-sm flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-bgmi-red" /> {pKills}
                      </span>
                    </td>

                    {/* AUTO-CALCULATED K/D RATIO COLUMN */}
                    <td className="p-4 text-center font-mono font-bold text-sky-400">
                      {pKd.toFixed(2)}
                    </td>

                    <td className="p-4">
                      <Badge variant={isVerified ? 'green' : isRejected ? 'rejected' : 'pending'} size="sm">
                        {statusLabel}
                      </Badge>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Edit3}
                        onClick={() => handleOpenEdit(player)}
                      >
                        Edit Stats
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
                        onClick={() => handleDeletePlayer(pId)}
                        disabled={deletingId === pId}
                        className={`inline-flex items-center justify-center p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors align-middle ${
                          deletingId === pId ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        title="Delete Player"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* EDIT PLAYER STATS MODAL */}
      {editingPlayer && (
        <Modal
          isOpen={!!editingPlayer}
          onClose={() => setEditingPlayer(null)}
          title={`Update Stats for ${editingPlayer.ign} (${editingPlayer.teamName})`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSavePlayerStats} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">In-Game Name (IGN)</label>
                <input
                  type="text"
                  required
                  value={editIgn}
                  onChange={(e) => setEditIgn(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
              >
                <option value="Assaulter">Assaulter</option>
                <option value="IGL">IGL (In-Game Leader)</option>
                <option value="Sniper">Sniper</option>
                <option value="Support">Support</option>
                <option value="Fragger">Fragger</option>
              </select>
            </div>

            {/* MATCH STATS INPUTS & LIVE AUTO K/D CALCULATION */}
            <div className="p-4 bg-slate-100 dark:bg-[#0a0b0e] rounded-xl border border-amber-500/40 dark:border-bgmi-gold/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <span className="font-bold text-amber-600 dark:text-bgmi-gold uppercase text-[10px] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-bgmi-red" /> MATCH STATS & K/D CALCULATION
                </span>
                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold">LIVE AUTO-CALCULATED</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-amber-600 dark:text-bgmi-gold uppercase text-[10px]">TOTAL KILLS</label>
                  <input
                    type="number"
                    min="0"
                    value={editKills}
                    onChange={(e) => setEditKills(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded text-amber-600 dark:text-bgmi-gold font-mono font-bold text-center text-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px]">MATCHES PLAYED</label>
                  <input
                    type="number"
                    min="1"
                    value={editMatchesPlayed}
                    onChange={(e) => setEditMatchesPlayed(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded text-slate-900 dark:text-white font-mono font-bold text-center text-lg"
                  />
                </div>
              </div>

              {/* AUTO-COMPUTED K/D RATIO PREVIEW */}
              <div className="p-3 bg-white dark:bg-slate-900/90 rounded border border-sky-500/30 flex items-center justify-between font-mono">
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-bold uppercase">COMPUTED K/D RATIO:</span>
                <span className="font-broadcast font-bold text-xl text-sky-600 dark:text-sky-400">
                  {computedKdRatio}
                </span>
              </div>
            </div>


            <div className="pt-4 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setEditingPlayer(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Save & Update MVP Standings
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}


