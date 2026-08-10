'use client';

import React, { useState, useEffect } from 'react';
import ResultEntryModal from '@/components/admin/ResultEntryModal';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { getResults, getMatches, getTeams, submitMatchResult } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Trophy, Plus, CheckCircle2, Calculator } from 'lucide-react';

export default function AdminResultsPage() {
  const { showToast } = useToast();
  const [results, setResults] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const rData = await getResults();
      const mData = await getMatches();
      const tData = await getTeams();
      setResults(rData);
      setMatches(mData);
      setTeams(tData);
    }
    loadData();
  }, []);

  const handleSubmitResult = async (payload) => {
    const newRes = await submitMatchResult(payload);
    setResults([newRes, ...results]);
    showToast('Match Results & Leaderboard Updated!', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-bgmi-border/60 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
            <Trophy className="w-6 h-6 text-bgmi-gold" /> Result Entry & Live Score Calculator
          </h1>
          <p className="text-xs text-slate-400">Enter placement rank, kills, bonuses, and penalties with live points preview.</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Enter New Match Scorecard
        </Button>
      </div>

      {/* PUBLISHED RESULTS LIST */}
      <div className="bg-bgmi-surface border border-bgmi-border rounded-xl overflow-hidden clip-tactical shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-bgmi-dark text-slate-400 font-display font-bold uppercase text-[10px] border-b border-bgmi-border">
            <tr>
              <th className="p-4">Match Number</th>
              <th className="p-4">WWCD Winner</th>
              <th className="p-4">Kills</th>
              <th className="p-4">Winner Points</th>
              <th className="p-4">Top Fragger MVP</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bgmi-border/40">
            {results.map((res) => (
              <tr key={res.id} className="hover:bg-bgmi-dark/40 transition-colors">
                <td className="p-4 font-bold text-white text-sm">Match #{res.matchNumber} ({res.map})</td>
                <td className="p-4 font-bold text-bgmi-gold">{res.winner?.teamName}</td>
                <td className="p-4 text-bgmi-cyan font-bold">{res.winner?.kills} Kills</td>
                <td className="p-4 font-bold text-white">{res.winner?.totalPoints} PTS</td>
                <td className="p-4 text-slate-300">{res.mvp?.name || 'Aditya Verma'}</td>
                <td className="p-4 text-right">
                  <Badge variant="green" size="sm">
                    <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Published Live
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RESULT ENTRY MODAL */}
      <ResultEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitResult={handleSubmitResult}
        matches={matches}
        teams={teams}
      />
    </div>
  );
}
