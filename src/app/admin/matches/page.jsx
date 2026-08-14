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
    <div className="space-y-6 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <Swords className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> Custom Match Lobby Manager
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Schedule custom matches, publish Room ID & Passwords, and change live status.</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleCreateClick}>
          Create New Match
        </Button>
      </div>

      {/* MATCHES TABLE WITH HORIZONTAL SCROLL */}
      <div className="bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-xl overflow-x-auto clip-tactical shadow-md dark:shadow-xl transition-colors duration-200">
        <table className="w-full text-left text-xs border-collapse min-w-[850px]">
          <thead className="bg-slate-100 dark:bg-bgmi-dark text-slate-700 dark:text-slate-400 font-display font-bold uppercase text-[10px] border-b border-slate-200 dark:border-bgmi-border">
            <tr>
              <th className="p-4 whitespace-nowrap">Match Number</th>
              <th className="p-4 whitespace-nowrap">Stage Round</th>
              <th className="p-4 whitespace-nowrap">Map</th>
              <th className="p-4 whitespace-nowrap">Room ID & Pass</th>
              <th className="p-4 whitespace-nowrap">Schedule Time</th>
              <th className="p-4 whitespace-nowrap">Status</th>
              <th className="p-4 whitespace-nowrap text-right min-w-[240px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-bgmi-border/40">
            {matches.map((m) => (
              <tr key={m.id || m._id} className="hover:bg-slate-50 dark:hover:bg-bgmi-dark/40 transition-colors">
                <td className="p-4 whitespace-nowrap font-bold text-slate-900 dark:text-white text-sm">Match #{m.matchNumber}</td>
                <td className="p-4 whitespace-nowrap text-amber-600 dark:text-bgmi-gold font-bold">{m.round}</td>
                <td className="p-4 whitespace-nowrap text-sky-600 dark:text-bgmi-cyan font-bold">{m.map}</td>
                <td className="p-4 whitespace-nowrap font-mono">
                  {m.roomId ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-amber-600 dark:text-bgmi-gold font-bold">ID: {m.roomId}</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-sky-600 dark:text-sky-400 font-bold">PASS: {m.password || 'N/A'}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic">Not set yet</span>
                  )}
                </td>
                <td className="p-4 whitespace-nowrap text-slate-700 dark:text-slate-300">{m.date} @ {m.time}</td>
                <td className="p-4 whitespace-nowrap">
                  <Badge variant={m.status === 'Live' ? 'live' : m.status === 'Completed' ? 'green' : 'gold'} size="sm">
                    {m.status}
                  </Badge>
                </td>
                <td className="p-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Edit2}
                      onClick={() => handleEditClick(m)}
                    >
                      Edit Room Code
                    </Button>
                    <Button
                      variant={m.status === 'Upcoming' ? 'danger' : m.status === 'Live' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusToggle(m.id || m._id, m.status)}
                    >
                      {m.status === 'Upcoming' ? '● Launch LIVE' : m.status === 'Live' ? 'Finish Match' : 'Reopen Match'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
