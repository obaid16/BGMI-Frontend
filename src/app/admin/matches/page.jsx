'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { getMatches, createMatch, updateMatchStatus, updateMatch } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Swords, Plus, Radio, CheckCircle2, Clock, Edit2 } from 'lucide-react';

export default function AdminMatchesPage() {
  const { showToast } = useToast();
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  // New/Edit match state
  const [round, setRound] = useState('Semifinal');
  const [map, setMap] = useState('Erangel');
  const [date, setDate] = useState('2026-08-09');
  const [time, setTime] = useState('11:00 AM');
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function loadData() {
      const data = await getMatches();
      setMatches(data);
    }
    loadData();
  }, []);

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
    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, status: nextStatus } : m)));
    showToast(`Match status updated to ${nextStatus}`, 'info');
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-premium-border pb-6">
        <div>
          <h1 className="font-bold text-3xl text-premium-text tracking-tight flex items-center gap-3">
            <Swords className="w-8 h-8 text-amber-600" /> Match Lobby Manager
          </h1>
          <p className="text-sm text-premium-text-secondary font-medium mt-2">Schedule custom matches, publish Room ID & Passwords, and change live status.</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleCreateClick}>
          Create Match
        </Button>
      </div>

      {/* MATCHES TABLE WITH HORIZONTAL SCROLL */}
      <div className="bg-premium-surface border border-premium-border rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[950px]">
            <thead className="bg-premium-background text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest border-b border-premium-border">
              <tr>
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
              {matches.map((m) => (
                <tr key={m.id || m._id} className="hover:bg-premium-surface-soft transition-colors">
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
                      <Button
                        variant={m.status === 'Upcoming' ? 'danger' : m.status === 'Live' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusToggle(m.id || m._id, m.status)}
                      >
                        {m.status === 'Upcoming' ? 'Launch Live' : m.status === 'Live' ? 'Finish Match' : 'Reopen Match'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {matches.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm font-medium text-premium-text-secondary bg-white">
                    No matches scheduled yet.
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

          <div className="pt-6 border-t border-premium-border flex justify-end gap-3">
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
        </form>
      </Modal>

    </div>
  );
}
