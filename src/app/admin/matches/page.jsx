'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { getMatches, createMatch, updateMatchStatus, updateMatch, deleteMatch, bulkDeleteMatches } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Swords, Plus, Radio, CheckCircle2, Clock, Edit2, Trash2 } from 'lucide-react';

export default function AdminMatchesPage() {
  const { showToast } = useToast();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // New/Edit match state
  const [round, setRound] = useState('Semifinal');
  const [map, setMap] = useState('Erangel');
  const [date, setDate] = useState('2026-08-09');
  const [time, setTime] = useState('11:00 AM');
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      const data = await getMatches();
      setMatches(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const allSelected = matches.length > 0 && selectedMatches.length === matches.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedMatches([]);
    } else {
      setSelectedMatches(matches.map((m) => m.id || m._id));
    }
  };

  const toggleSelectMatch = (id) => {
    setSelectedMatches((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateClick = () => {
    setEditingMatch(null);
    setRound('Semifinal');
    setMap('Erangel');
    setDate('2026-08-09');
    setTime('11:00 AM');
    setRoomId('');
    setPassword('');
    setIsModalOpen(true);
  };

  const handleEditClick = (match) => {
    setEditingMatch(match);
    setRound(match.round || 'Semifinal');
    setMap(match.map || 'Erangel');
    setDate(match.date || '2026-08-09');
    setTime(match.time || '11:00 AM');
    setRoomId(match.roomId || '');
    setPassword(match.password || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingMatch) {
      const updated = await updateMatch(editingMatch.id || editingMatch._id, { round, map, date, time, roomId, password });
      if (updated) {
        setMatches((prev) => prev.map((m) => ((m.id || m._id) === (editingMatch.id || editingMatch._id) ? { ...m, ...updated, roomId, password } : m)));
        showToast('Match Lobby & Room Credentials Published!', 'success');
      } else {
        showToast('Failed to update match', 'error');
      }
    } else {
      const created = await createMatch({ round, map, date, time, roomId, password, status: 'Upcoming' });
      setMatches([created, ...matches]);
      showToast('Match Lobby & Room Credentials Created!', 'success');
    }
    setIsModalOpen(false);
    setEditingMatch(null);
  };

  const handleStatusToggle = async (matchId, currentStatus) => {
    const nextStatus = currentStatus === 'Upcoming' ? 'Live' : currentStatus === 'Live' ? 'Completed' : 'Upcoming';
    await updateMatchStatus(matchId, nextStatus);
    setMatches((prev) => prev.map((m) => ((m.id || m._id) === matchId ? { ...m, status: nextStatus } : m)));
    showToast(`Match status updated to ${nextStatus}`, 'info');
  };

  const handleDeleteMatch = async (match) => {
    const targetId = match.id || match._id;
    if (window.confirm(`Are you sure you want to delete Match #${match.matchNumber}?`)) {
      try {
        const res = await deleteMatch(targetId);
        if (res && res.success) {
          setMatches((prev) => prev.filter((m) => (m.id || m._id) !== targetId));
          setSelectedMatches((prev) => prev.filter((id) => id !== targetId));
          showToast(`Match #${match.matchNumber} deleted successfully`, 'info');
        } else {
          showToast('Failed to delete match', 'error');
        }
      } catch (err) {
        showToast(err.message || 'Error deleting match', 'error');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMatches.length === 0) return;
    if (window.confirm(`Are you sure you want to permanently delete all ${selectedMatches.length} selected match(es)?`)) {
      try {
        setBulkDeleting(true);
        const res = await bulkDeleteMatches(selectedMatches);
        if (res && res.success) {
          setMatches((prev) => prev.filter((m) => !selectedMatches.includes(m.id || m._id)));
          showToast(`Successfully deleted ${selectedMatches.length} match(es)`, 'success');
          setSelectedMatches([]);
        } else {
          showToast('Failed to bulk delete matches', 'error');
        }
      } catch (err) {
        showToast(err.message || 'Error bulk deleting matches', 'error');
      } finally {
        setBulkDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-5">
        <div>
          <span className="text-[10px] font-mono text-bgmi-red font-bold uppercase tracking-widest block">
            /// TOURNAMENT OPERATIONS
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5 mt-1">
            <Swords className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> 
            Custom Match Lobby Manager
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-1">
            Schedule custom matches, publish Room ID &amp; Passwords, and manage live match rosters.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="primary" size="md" icon={Plus} onClick={handleCreateClick}>
            Create New Match
          </Button>
        </div>
      </div>

      {/* BULK ACTION BAR */}
      {selectedMatches.length > 0 && (
        <div className="bg-red-500/10 dark:bg-red-950/30 border border-red-500/30 rounded-2xl p-3.5 px-5 flex items-center justify-between gap-4 shadow-editorial-sm animate-fadeIn">
          <div className="flex items-center gap-3 text-xs font-mono font-bold text-red-700 dark:text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span>{selectedMatches.length} of {matches.length} match(es) selected</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedMatches([])}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-2"
            >
              Deselect All
            </button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
            >
              {bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedMatches.length})`}
            </Button>
          </div>
        </div>
      )}

      {/* MATCHES TABLE WITH EDITORIAL CONTAINER */}
      <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl shadow-editorial-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-slate-400">Loading match lobbies...</div>
        ) : matches.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Swords className="w-6 h-6 text-bgmi-gold" />
            </div>
            <p className="font-display font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">No Matches Scheduled Yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              All matches data has been cleared. Click &ldquo;Create New Match&rdquo; above to set up and publish custom lobby credentials for the tournament.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[950px]">
              <thead className="bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-600 dark:text-slate-400 font-mono font-bold uppercase text-[10px] border-b border-[#E7E3DA] dark:border-[#1E2638]">
                <tr>
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-bgmi-red accent-bgmi-red cursor-pointer"
                      title="Select all matches"
                    />
                  </th>
                  <th className="p-4 whitespace-nowrap">Match Number</th>
                  <th className="p-4 whitespace-nowrap">Stage Round</th>
                  <th className="p-4 whitespace-nowrap">Map</th>
                  <th className="p-4 whitespace-nowrap">Room ID &amp; Pass</th>
                  <th className="p-4 whitespace-nowrap">Schedule Time</th>
                  <th className="p-4 whitespace-nowrap">Status</th>
                  <th className="p-4 whitespace-nowrap text-right min-w-[300px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E3DA] dark:divide-[#1E2638]">
                {matches.map((m) => {
                  const mId = m.id || m._id;
                  const isSelected = selectedMatches.includes(mId);

                  return (
                    <tr
                      key={mId}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-red-50/60 dark:bg-red-950/20'
                          : 'hover:bg-slate-50/70 dark:hover:bg-[#181E2C]/50'
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectMatch(mId)}
                          className="w-4 h-4 rounded text-bgmi-red accent-bgmi-red cursor-pointer"
                        />
                      </td>
                      <td className="p-4 whitespace-nowrap font-display font-bold text-slate-900 dark:text-white text-sm">Match #{m.matchNumber}</td>
                      <td className="p-4 whitespace-nowrap text-amber-600 dark:text-bgmi-gold font-bold">{m.round}</td>
                      <td className="p-4 whitespace-nowrap text-sky-600 dark:text-sky-400 font-bold uppercase">{m.map}</td>
                      <td className="p-4 whitespace-nowrap font-mono">
                        {m.roomId ? (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-amber-600 dark:text-bgmi-gold font-bold">ID: {m.roomId}</span>
                            <span className="text-slate-400">|</span>
                            <span className="text-sky-600 dark:text-sky-400 font-bold">PASS: {m.password || 'N/A'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not set yet</span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">{m.date} @ {m.time}</td>
                      <td className="p-4 whitespace-nowrap">
                        <Badge variant={m.status === 'Live' ? 'live' : m.status === 'Completed' ? 'green' : 'gold'} size="sm">
                          {m.status}
                        </Badge>
                      </td>
                      <td className="p-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Edit2}
                            onClick={() => handleEditClick(m)}
                          >
                            Edit Room
                          </Button>
                          <Button
                            variant={m.status === 'Upcoming' ? 'danger' : m.status === 'Live' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusToggle(mId, m.status)}
                          >
                            {m.status === 'Upcoming' ? '● Launch LIVE' : m.status === 'Live' ? 'Finish Match' : 'Reopen Match'}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDeleteMatch(m)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE/EDIT MATCH MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMatch(null);
        }}
        title={editingMatch ? `Edit Match #${editingMatch.matchNumber} & Room Code` : "Schedule New Match Lobby"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Stage / Round</label>
            <select
              value={round}
              onChange={(e) => setRound(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
            >
              <option value="Group Stage">Group Stage</option>
              <option value="Quarterfinal">Quarterfinal</option>
              <option value="Semifinal">Semifinal</option>
              <option value="Grand Final">Grand Final</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Battle Map</label>
            <select
              value={map}
              onChange={(e) => setMap(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
            >
              <option value="Erangel">Erangel</option>
              <option value="Miramar">Miramar</option>
              <option value="Sanhok">Sanhok</option>
              <option value="Vikendi">Vikendi</option>
              <option value="Livik">Livik</option>
            </select>
          </div>

          {/* ROOM CREDENTIALS INPUTS */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-100 dark:bg-[#0a0b0e] rounded border border-amber-500/30 dark:border-bgmi-gold/30">
            <div className="space-y-1">
              <label className="font-bold text-amber-600 dark:text-bgmi-gold uppercase text-[10px]">CUSTOM ROOM ID</label>
              <input
                type="text"
                placeholder="e.g. 8492041"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full p-2 bg-white dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-sky-600 dark:text-sky-400 uppercase text-[10px]">ROOM PASSWORD</label>
              <input
                type="text"
                placeholder="e.g. NIT2026"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-white dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase">Time</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-lg text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setIsModalOpen(false);
                setEditingMatch(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              {editingMatch ? "Save & Publish Credentials" : "Schedule Match"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
