'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { getMatches, createMatch, updateMatchStatus, updateMatch, deleteMatch, bulkDeleteMatches } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Swords, Plus, Radio, CheckCircle2, Clock, Edit2, Trash2 } from 'lucide-react';

export default function AdminMatchesPage() {
  const { showToast } = useToast();
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Confirm Modal state (custom alert instead of default browser confirm)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Delete',
    onConfirm: null,
    loading: false,
  });

  // New/Edit match state
  const [round, setRound] = useState('Semifinal');
  const [map, setMap] = useState('Erangel');
  const [date, setDate] = useState('2026-08-09');
  const [time, setTime] = useState('11:00 AM');
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');

  const loadData = async () => {
    const data = await getMatches('All', true);
    if (Array.isArray(data)) {
      setMatches(data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClick = () => {
    setEditingMatch(null);
    setRound('Semifinal');
    setMap('Erangel');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('11:00 AM');
    setRoomId('');
    setPassword('');
    setIsModalOpen(true);
  };

  const handleEditClick = (match) => {
    setEditingMatch(match);
    setRound(match.round || 'Semifinal');
    setMap(match.map || 'Erangel');
    setDate(match.date || new Date().toISOString().split('T')[0]);
    setTime(match.time || '11:00 AM');
    setRoomId(match.roomId || '');
    setPassword(match.password || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingMatch) {
      const matchId = editingMatch.id || editingMatch._id;
      const updated = await updateMatch(matchId, { round, map, date, time, roomId, password });
      if (updated) {
        setMatches((prev) =>
          prev.map((m) => ((m.id || m._id) === matchId ? { ...m, ...updated, roomId, password } : m))
        );
        showToast('Match Lobby & Room Credentials Published!', 'success');
      } else {
        showToast('Failed to update match', 'error');
      }
    } else {
      const created = await createMatch({ round, map, date, time, roomId, password, status: 'Upcoming' });
      if (created) {
        showToast('Match Lobby & Room Credentials Created!', 'success');
        await loadData();
      } else {
        showToast('Failed to create match', 'error');
      }
    }
    setIsModalOpen(false);
    setEditingMatch(null);
  };

  const handleStatusToggle = async (matchId, currentStatus) => {
    const nextStatus = currentStatus === 'Upcoming' ? 'Live' : currentStatus === 'Live' ? 'Completed' : 'Upcoming';
    setMatches((prev) => prev.map((m) => ((m.id || m._id) === matchId ? { ...m, status: nextStatus } : m)));
    showToast(`Match status updated to ${nextStatus}`, 'info');

    try {
      await updateMatchStatus(matchId, nextStatus);
      await loadData();
    } catch (err) {
      console.error('Failed to update match status:', err);
    }
  };

  // Single Match Deletion with Custom ConfirmModal
  const handleDeleteMatchPrompt = (match) => {
    const matchId = match.id || match._id;
    const matchTitle = match.title || `Match #${match.matchNumber}`;

    setConfirmModal({
      isOpen: true,
      title: `Delete ${matchTitle}?`,
      description: `Are you sure you want to delete ${matchTitle} (${match.map} - ${match.round})? This match schedule will be permanently deleted.`,
      confirmText: 'Delete Match',
      loading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          await deleteMatch(matchId);
          setMatches((prev) => prev.filter((m) => (m.id || m._id) !== matchId));
          setSelectedIds((prev) => prev.filter((id) => id !== matchId));
          showToast(`${matchTitle} deleted successfully!`, 'success');
        } catch (err) {
          console.error('Delete match error:', err);
          showToast(err.message || 'Failed to delete match', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
        }
      },
    });
  };

  // Bulk Matches Deletion with Custom ConfirmModal
  const handleBulkDeletePrompt = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;

    setConfirmModal({
      isOpen: true,
      title: `Delete ${count} Selected Matches?`,
      description: `Are you sure you want to permanently delete these ${count} selected match schedules? This action cannot be undone.`,
      confirmText: `Delete ${count} Matches`,
      loading: false,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          await bulkDeleteMatches(selectedIds);
          setMatches((prev) => prev.filter((m) => !selectedIds.includes(m.id || m._id)));
          setSelectedIds([]);
          showToast(`Successfully deleted ${count} matches`, 'success');
        } catch (err) {
          console.error('Bulk delete error:', err);
          showToast(err.message || 'Failed to delete selected matches', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
        }
      },
    });
  };

  // Selection toggles
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const isAllSelected = matches.length > 0 && matches.every((m) => selectedIds.includes(m.id || m._id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(matches.map((m) => m.id || m._id));
    }
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-premium-border pb-6">
        <div>
          <h1 className="font-bold text-3xl text-premium-text tracking-tight flex items-center gap-3">
            <Swords className="w-8 h-8 text-amber-600" /> Match Schedules
          </h1>
          <p className="text-sm text-premium-text-secondary font-medium mt-2">
            Schedule custom matches, publish Room ID & Passwords, manage live status, and remove schedules.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* BULK DELETE BUTTON WHEN MATCHES ARE SELECTED */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
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

          <Button variant="primary" size="md" icon={Plus} onClick={handleCreateClick}>
            Create Match
          </Button>
        </div>
      </div>

      {/* MATCHES TABLE WITH HORIZONTAL SCROLL */}
      <div className="bg-premium-surface border border-premium-border rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[950px]">
            <thead className="bg-premium-background text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest border-b border-premium-border">
              <tr>
                {/* SELECT ALL CHECKBOX */}
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-premium-border text-black focus:ring-0 cursor-pointer accent-black"
                    title="Select All Matches"
                  />
                </th>
                <th className="px-6 py-4">Match Number</th>
                <th className="px-6 py-4">Stage Round</th>
                <th className="px-6 py-4">Map</th>
                <th className="px-6 py-4">Room ID & Pass</th>
                <th className="px-6 py-4">Schedule Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-premium-border bg-white">
              {matches.map((m) => {
                const matchId = m.id || m._id;
                const isSelected = selectedIds.includes(matchId);

                return (
                  <tr key={matchId} className={`transition-colors ${isSelected ? 'bg-amber-50/40' : 'hover:bg-premium-surface-soft'}`}>
                    {/* ROW CHECKBOX */}
                    <td className="px-6 py-5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(matchId)}
                        className="w-4 h-4 rounded border-premium-border text-black focus:ring-0 cursor-pointer accent-black"
                      />
                    </td>

                    <td className="px-6 py-5 font-bold text-premium-text text-base">Match #{m.matchNumber}</td>
                    <td className="px-6 py-5 text-amber-700 font-bold">{m.round}</td>
                    <td className="px-6 py-5 text-sky-700 font-bold">{m.map}</td>
                    <td className="px-6 py-5">
                      {m.roomId ? (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-amber-700 font-bold">ID: {m.roomId}</span>
                          <span className="text-premium-border">|</span>
                          <span className="text-emerald-700 font-bold">PASS: {m.password || 'N/A'}</span>
                        </div>
                      ) : (
                        <span className="text-premium-text-secondary font-medium italic">Not set yet</span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-premium-text-secondary font-medium">{m.date} @ {m.time}</td>
                    <td className="px-6 py-5">
                      <Badge variant={m.status === 'Live' ? 'live' : m.status === 'Completed' ? 'green' : 'gold'} size="sm">
                        {m.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit2}
                          onClick={() => handleEditClick(m)}
                        >
                          Edit
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(matchId, m.status)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 border flex items-center gap-1.5 shadow-sm ${
                            m.status === 'Upcoming'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                              : m.status === 'Live'
                              ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600'
                              : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                          }`}
                        >
                          {m.status === 'Upcoming' ? (
                            <>
                              <Radio className="w-3.5 h-3.5 animate-pulse" /> Launch Live
                            </>
                          ) : m.status === 'Live' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Finish Match
                            </>
                          ) : (
                            'Reopen'
                          )}
                        </button>
                        
                        {/* PROMINENT DELETE BUTTON */}
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDeleteMatchPrompt(m)}
                          title="Delete Match Schedule"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {matches.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-sm font-medium text-premium-text-secondary bg-white">
                    No matches scheduled yet. Click &quot;Create Match&quot; to schedule one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE/EDIT MATCH MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMatch(null);
        }}
        title={editingMatch ? `Edit Match #${editingMatch.matchNumber}` : "Schedule Match"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Stage / Round</label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value)}
                className="w-full p-3 bg-premium-background border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text shadow-sm appearance-none cursor-pointer"
              >
                <option value="Group Stage">Group Stage</option>
                <option value="Quarterfinal">Quarterfinal</option>
                <option value="Semifinal">Semifinal</option>
                <option value="Grand Final">Grand Final</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Battle Map</label>
              <select
                value={map}
                onChange={(e) => setMap(e.target.value)}
                className="w-full p-3 bg-premium-background border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text shadow-sm appearance-none cursor-pointer"
              >
                <option value="Erangel">Erangel</option>
                <option value="Miramar">Miramar</option>
                <option value="Sanhok">Sanhok</option>
                <option value="Vikendi">Vikendi</option>
                <option value="Livik">Livik</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-premium-background border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest block">Time</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 bg-premium-background border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text shadow-sm"
              />
            </div>
          </div>

          {/* ROOM CREDENTIALS INPUTS */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-premium-text-secondary uppercase tracking-widest">Room Credentials</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-amber-50 rounded-[16px] border border-amber-200 shadow-sm">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">Room ID</label>
                <input
                  type="text"
                  placeholder="e.g. 8492041"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full p-3 bg-white border border-amber-200 rounded-[10px] text-premium-text text-sm font-bold focus:outline-none focus:border-amber-400 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">Room Password</label>
                <input
                  type="text"
                  placeholder="e.g. NIT2026"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-white border border-emerald-200 rounded-[10px] text-premium-text text-sm font-bold focus:outline-none focus:border-emerald-400 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-premium-border flex items-center justify-between gap-3">
            {editingMatch ? (
              <Button
                type="button"
                variant="danger"
                size="md"
                icon={Trash2}
                onClick={() => {
                  const targetMatch = editingMatch;
                  setIsModalOpen(false);
                  setEditingMatch(null);
                  handleDeleteMatchPrompt(targetMatch);
                }}
              >
                Delete Match
              </Button>
            ) : <div />}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMatch(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                {editingMatch ? "Save & Publish" : "Schedule Match"}
              </Button>
            </div>
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
        confirmText={confirmModal.confirmText}
        loading={confirmModal.loading}
      />

    </div>
  );
}
