'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { getTeams, verifyPlayerStatus, deletePlayer } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { UserCheck, ShieldCheck, X, Check, FileText, Search, Trash2 } from 'lucide-react';

export default function AdminPlayersPage() {
  const { showToast } = useToast();
  const [allPlayers, setAllPlayers] = useState([]);
  const [squadFilter, setSquadFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadData() {
    const teams = await getTeams();
    const playersList = [];
    teams.forEach((t) => {
      t.players?.forEach((p) => {
        playersList.push({
          ...p,
          teamName: t.name,
          college: t.college,
        });
      });
    });
    setAllPlayers(playersList);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (playerId, newStatus) => {
    const res = await verifyPlayerStatus(playerId, newStatus);
    if (res) {
      setAllPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId || p._id === playerId
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
      <div className="border-b border-bgmi-border/60 pb-4">
        <h1 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-bgmi-cyan" /> Player Roster Verification
        </h1>
        <p className="text-xs text-slate-400">Verify individual player BGMI IDs, student ID proof documents, and roles.</p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bgmi-surface/40 p-4 rounded-xl border border-bgmi-border/40">
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            placeholder="Filter by Squad/Team Name..."
            value={squadFilter}
            onChange={(e) => setSquadFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-bgmi-dark border border-bgmi-border rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-bgmi-gold transition-colors"
          />
        </div>
        {squadFilter && (
          <button
            onClick={() => setSquadFilter('')}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* PLAYERS TABLE */}
      <div className="bg-bgmi-surface border border-bgmi-border rounded-xl overflow-hidden clip-tactical shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-bgmi-dark text-slate-400 font-display font-bold uppercase text-[10px] border-b border-bgmi-border">
            <tr>
              <th className="p-4">Player & IGN</th>
              <th className="p-4">Squad</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bgmi-border/40">
            {allPlayers
              .filter((player) =>
                player.teamName?.toLowerCase().includes(squadFilter.toLowerCase())
              )
              .map((player) => {
                const pId = player.id || player._id;
                const isVerified = player.verificationStatus === 'Verified' || player.verified;
                const isRejected = player.verificationStatus === 'Rejected';
                const statusLabel = player.verificationStatus || (player.verified ? 'Verified' : 'Pending Verification');
                
                return (
                  <tr key={pId} className="hover:bg-bgmi-dark/40 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white text-sm">{player.ign}</p>
                      <p className="text-slate-400 text-[11px]">{player.name}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white">{player.teamName}</p>
                    </td>
                    <td className="p-4"><Badge variant="default" size="sm">{player.role}</Badge></td>
                    <td className="p-4">
                      <Badge variant={isVerified ? 'green' : isRejected ? 'rejected' : 'pending'} size="sm">
                        {statusLabel}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
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

    </div>
  );
}
