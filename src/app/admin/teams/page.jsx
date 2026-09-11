'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { getTeams, updateTeamStatus, deleteTeam, createTeam } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Users, Plus, ShieldCheck, Trash2, Edit3, Search, Loader2 } from 'lucide-react';

export default function AdminTeamsPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: null,
    loading: false,
  });

  // Form states
  const [newTeamName, setNewTeamName] = useState('');
  const [newCollege, setNewCollege] = useState('NIT');
  const [newTeamLogo, setNewTeamLogo] = useState('');

  const loadData = async () => {
    const data = await getTeams('All', '', true);
    if (Array.isArray(data)) {
      setTeams(data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      showToast('Please enter a team/squad name', 'error');
      return;
    }

    setSubmitting(true);
    const logoUrl = newTeamLogo.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80';

    try {
      const created = await createTeam({
        name: newTeamName.trim(),
        shortName: newTeamName.trim().substring(0, 5).toUpperCase(),
        college: newCollege.trim() || 'NIT',
        logo: logoUrl,
        status: 'Approved',
      });

      if (created) {
        showToast(`Squad "${newTeamName.trim()}" created successfully!`, 'success');
        setIsAddModalOpen(false);
        setNewTeamName('');
        setNewCollege('NIT');
        setNewTeamLogo('');
        await loadData();
      } else {
        showToast('Failed to create team', 'error');
      }
    } catch (err) {
      console.error('Create squad error:', err);
      showToast(err.message || 'Error creating squad', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = (team) => {
    const id = team.id || team._id;
    const name = team.name || 'this squad';
    setConfirmModal({
      isOpen: true,
      title: `Delete Squad "${name}"?`,
      description: `Are you sure you want to delete ${name} entirely? This will also permanently remove all players on this squad roster.`,
      loading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          const res = await deleteTeam(id);
          if (res) {
            setTeams((prev) => prev.filter((t) => (t.id || t._id) !== id));
            showToast('Team Roster Removed successfully', 'success');
          } else {
            showToast('Failed to remove team', 'error');
          }
        } catch (err) {
          showToast('An error occurred while deleting team', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
        }
      },
    });
  };

  const filteredTeams = teams.filter((team) => 
    team.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    team.captain?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-premium-border pb-6">
        <div>
          <h1 className="font-bold text-3xl text-premium-text tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-amber-600" /> Squad Management
          </h1>
          <p className="text-sm text-premium-text-secondary font-medium mt-2">Add, edit, verify, or remove participating tournament squads.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-premium-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search squads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-premium-border rounded-[12px] text-sm font-bold text-premium-text focus:outline-none focus:border-premium-text shadow-sm"
            />
          </div>
          <Button variant="primary" size="md" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Squad
          </Button>
        </div>
      </div>

      {/* TEAMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div key={team.id} className="bg-premium-surface border border-premium-border rounded-[24px] p-6 space-y-5 shadow-sm hover:shadow-md transition-all hover:border-premium-text/20 group">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-amber-700 bg-amber-50 px-3 py-1 rounded-[8px]">#{team.rank}</span>
              <Badge variant={team.verified ? 'green' : 'pending'} size="sm">
                {team.verified ? 'Verified' : 'Pending'}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[12px] border border-premium-border overflow-hidden shrink-0 shadow-sm bg-white">
                <img src={team.logo} alt={team.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg text-premium-text truncate leading-tight">{team.name}</h3>
                <p className="text-sm text-premium-text-secondary font-medium mt-0.5 truncate">Captain: {team.captain?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-premium-border flex items-center justify-between">
              <span className="text-sm font-bold text-premium-text-secondary">{team.players?.length || 4} Squad Members</span>
              <button
                onClick={() => handleDeleteTeam(team)}
                className="w-9 h-9 flex items-center justify-center rounded-[10px] text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors"
                title="Delete Squad"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filteredTeams.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-premium-surface border border-premium-border rounded-[24px]">
            <p className="text-sm font-bold text-premium-text-secondary">No squads found matching your search.</p>
          </div>
        )}
      </div>

      {/* ADD SQUAD MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Team Roster" maxWidth="max-w-md">
        <form onSubmit={handleCreateTeam} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Team / Squad Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Cyber Knights"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-sm focus:outline-none focus:border-premium-text shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">College / Department</label>
            <input
              type="text"
              placeholder="e.g. NIT Computer Science"
              value={newCollege}
              onChange={(e) => setNewCollege(e.target.value)}
              className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-sm focus:outline-none focus:border-premium-text shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Team Logo URL</label>
            <input
              type="text"
              placeholder="Paste Logo Image URL or leave blank for default"
              value={newTeamLogo}
              onChange={(e) => setNewTeamLogo(e.target.value)}
              className="w-full p-3 bg-white border border-premium-border rounded-[12px] text-premium-text font-bold text-sm focus:outline-none focus:border-premium-text shadow-sm"
            />
          </div>

          <div className="pt-6 border-t border-premium-border flex justify-end gap-3">
            <Button variant="outline" size="md" onClick={() => setIsAddModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? 'Creating Squad...' : 'Create Team'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CUSTOM CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText="Delete Squad"
        loading={confirmModal.loading}
      />

    </div>
  );
}
