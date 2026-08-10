'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { getTeams, verifyPlayerStatus } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { UserCheck, ShieldCheck, X, Check, FileText } from 'lucide-react';

export default function AdminPlayersPage() {
  const { showToast } = useToast();
  const [allPlayers, setAllPlayers] = useState([]);

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

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="border-b border-bgmi-border/60 pb-4">
        <h1 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-bgmi-cyan" /> Player Roster Verification
        </h1>
        <p className="text-xs text-slate-400">Verify individual player BGMI IDs, student ID proof documents, and roles.</p>
      </div>

      {/* PLAYERS TABLE */}
      <div className="bg-bgmi-surface border border-bgmi-border rounded-xl overflow-hidden clip-tactical shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-bgmi-dark text-slate-400 font-display font-bold uppercase text-[10px] border-b border-bgmi-border">
            <tr>
              <th className="p-4">Photo</th>
              <th className="p-4">Player & IGN</th>
              <th className="p-4">BGMI ID</th>
              <th className="p-4">Squad</th>
              <th className="p-4">Role</th>
              <th className="p-4">Student ID Proof</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bgmi-border/40">
            {allPlayers.map((player) => {
              const pId = player.id || player._id;
              const isVerified = player.verificationStatus === 'Verified' || player.verified;
              const isRejected = player.verificationStatus === 'Rejected';
              const statusLabel = player.verificationStatus || (player.verified ? 'Verified' : 'Pending Verification');
              
              return (
                <tr key={pId} className="hover:bg-bgmi-dark/40 transition-colors">
                  <td className="p-4">
                    <div className="w-9 h-9 rounded bg-bgmi-dark overflow-hidden border border-bgmi-border flex-shrink-0">
                      {player.photo || player.avatar ? (
                        <img src={player.photo || player.avatar} alt={player.ign} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-500 flex items-center justify-center h-full">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{player.ign}</p>
                    <p className="text-slate-400 text-[11px]">{player.name}</p>
                  </td>
                  <td className="p-4 font-mono font-bold text-bgmi-gold">{player.bgmiId}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{player.teamName}</p>
                  </td>
                  <td className="p-4"><Badge variant="default" size="sm">{player.role}</Badge></td>
                  <td className="p-4">
                    {player.studentProof ? (
                      <a
                        href={player.studentProof}
                        target="_blank"
                        rel="noreferrer"
                        className="text-bgmi-cyan font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Proof ↗
                      </a>
                    ) : (
                      <span className="text-slate-500 font-medium">None</span>
                    )}
                  </td>
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
