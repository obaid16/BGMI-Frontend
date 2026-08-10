'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { getMatches, createMatch, updateMatchStatus } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Swords, Plus, Radio, CheckCircle2, Clock } from 'lucide-react';

export default function AdminMatchesPage() {
  const { showToast } = useToast();
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New match state
  const [round, setRound] = useState('Semifinal');
  const [map, setMap] = useState('Erangel');
  const [date, setDate] = useState('2026-08-09');
  const [time, setTime] = useState('11:00 AM');

  useEffect(() => {
    async function loadData() {
      const data = await getMatches();
      setMatches(data);
    }
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const created = await createMatch({ round, map, date, time, status: 'Upcoming' });
    setMatches([created, ...matches]);
    showToast('Match Lobby Scheduled Successfully!', 'success');
    setIsModalOpen(false);
  };

  const handleStatusToggle = async (matchId, currentStatus) => {
    const nextStatus = currentStatus === 'Upcoming' ? 'Live' : currentStatus === 'Live' ? 'Completed' : 'Upcoming';
    await updateMatchStatus(matchId, nextStatus);
    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, status: nextStatus } : m)));
    showToast(`Match status updated to ${nextStatus}`, 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-bgmi-border/60 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
            <Swords className="w-6 h-6 text-bgmi-gold" /> Custom Match Lobby Manager
          </h1>
          <p className="text-xs text-slate-400">Schedule custom matches, dispatch room credentials, and change live stream status.</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create New Match
        </Button>
      </div>

      {/* MATCHES TABLE */}
      <div className="bg-bgmi-surface border border-bgmi-border rounded-xl overflow-hidden clip-tactical shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-bgmi-dark text-slate-400 font-display font-bold uppercase text-[10px] border-b border-bgmi-border">
            <tr>
              <th className="p-4">Match Number</th>
              <th className="p-4">Stage Round</th>
              <th className="p-4">Map</th>
              <th className="p-4">Schedule Time</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Change Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bgmi-border/40">
            {matches.map((m) => (
              <tr key={m.id} className="hover:bg-bgmi-dark/40 transition-colors">
                <td className="p-4 font-bold text-white text-sm">Match #{m.matchNumber}</td>
                <td className="p-4 text-bgmi-gold font-bold">{m.round}</td>
                <td className="p-4 text-bgmi-cyan font-bold">{m.map}</td>
                <td className="p-4 text-slate-300">{m.date} @ {m.time}</td>
                <td className="p-4">
                  <Badge variant={m.status === 'Live' ? 'live' : m.status === 'Completed' ? 'green' : 'gold'} size="sm">
                    {m.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant={m.status === 'Upcoming' ? 'danger' : m.status === 'Live' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusToggle(m.id, m.status)}
                  >
                    {m.status === 'Upcoming' ? '● Launch LIVE' : m.status === 'Live' ? 'Finish Match' : 'Reopen Match'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MATCH MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Match Lobby" maxWidth="max-w-md">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Stage / Round</label>
            <select
              value={round}
              onChange={(e) => setRound(e.target.value)}
              className="w-full p-2.5 bg-bgmi-dark border border-bgmi-border rounded-lg text-white font-bold"
            >
              <option value="Group Stage">Group Stage</option>
              <option value="Quarterfinal">Quarterfinal</option>
              <option value="Semifinal">Semifinal</option>
              <option value="Grand Final">Grand Final</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase">Battle Map</label>
            <select
              value={map}
              onChange={(e) => setMap(e.target.value)}
              className="w-full p-2.5 bg-bgmi-dark border border-bgmi-border rounded-lg text-white font-bold"
            >
              <option value="Erangel">Erangel</option>
              <option value="Miramar">Miramar</option>
              <option value="Sanhok">Sanhok</option>
              <option value="Vikendi">Vikendi</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-bgmi-dark border border-bgmi-border rounded-lg text-white font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Time</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 bg-bgmi-dark border border-bgmi-border rounded-lg text-white font-bold"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Schedule Match
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
