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
      const [rData, mData, tData] = await Promise.all([
        getResults(),
        getMatches(),
        getTeams()
      ]);
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
    <div className="space-y-6 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> Result Entry & Live Score Calculator
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Enter placement rank and kills with live points preview.</p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Enter New Match Scorecard
        </Button>
      </div>

      {/* PUBLISHED RESULTS LIST WITH HORIZONTAL SCROLL */}
      <div className="bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-xl overflow-x-auto clip-tactical shadow-md dark:shadow-xl transition-colors duration-200">
        <table className="w-full text-left text-xs border-collapse min-w-[800px]">
          <thead className="bg-slate-100 dark:bg-bgmi-dark text-slate-700 dark:text-slate-400 font-display font-bold uppercase text-[10px] border-b border-slate-200 dark:border-bgmi-border">
            <tr>
              <th className="p-4 whitespace-nowrap">Match Number</th>
              <th className="p-4 whitespace-nowrap">WWCD Winner</th>
              <th className="p-4 whitespace-nowrap">Kills</th>
              <th className="p-4 whitespace-nowrap">Winner Points</th>
              <th className="p-4 whitespace-nowrap">Top Fragger MVP</th>
              <th className="p-4 whitespace-nowrap text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-bgmi-border/40">
            {results.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-bgmi-dark/40 transition-colors">
                <td className="p-4 whitespace-nowrap font-bold text-slate-900 dark:text-white text-sm">Match #{res.matchNumber} ({res.map})</td>
                <td className="p-4 whitespace-nowrap font-bold text-amber-600 dark:text-bgmi-gold">{res.winner?.teamName}</td>
                <td className="p-4 whitespace-nowrap text-sky-600 dark:text-bgmi-cyan font-bold">{res.winner?.kills} Kills</td>
                <td className="p-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">{res.winner?.totalPoints} PTS</td>
                <td className="p-4 whitespace-nowrap text-slate-700 dark:text-slate-300">{res.mvp?.name || 'Aditya Verma'}</td>
                <td className="p-4 whitespace-nowrap text-right">
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
