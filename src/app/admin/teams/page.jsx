'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { getTeams, updateTeamStatus, deleteTeam } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Users, Plus, ShieldCheck, Trash2, Edit3 } from 'lucide-react';

export default function AdminTeamsPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form states
  const [newTeamName, setNewTeamName] = useState('');
  const [newCollege, setNewCollege] = useState('NIT');

  useEffect(() => {
    async function loadData() {
      const data = await getTeams();
      setTeams(data);
    }
    loadData();
  }, []);

  const handleCreateTeam = (e) => {
    e.preventDefault();
    const newTeam = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      shortName: newTeamName.substring(0, 5).toUpperCase(),
      college: newCollege,
      logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
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
  };

  const handleDeleteTeam = async (id) => {
    if (deletingId) return;
    if (window.confirm('Are you sure you want to delete this squad profile entirely? This will also remove the players.')) {
      try {
        setDeletingId(id);
        const res = await deleteTeam(id);
        if (res) {
          setTeams((prev) => prev.filter((t) => t.id !== id));
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

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Add New Squad
        </Button>
      </div>

      {/* TEAMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-xl p-5 clip-tactical space-y-4 shadow-md dark:shadow-xl transition-colors duration-200">
            <div className="flex items-center justify-between">
              <span className="font-display font-black text-lg text-amber-600 dark:text-bgmi-gold">#{team.rank}</span>
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
                onClick={() => handleDeleteTeam(team.id)}
                disabled={deletingId === team.id}
                className={`text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 font-bold ${
                  deletingId === team.id ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Squad
              </button>
            </div>
          </div>
        ))}
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
