'use client';

import React, { useState, useEffect } from 'react';
import ResultEntryModal from '@/components/admin/ResultEntryModal';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { getResults, getMatches, getTeams, submitMatchResult, deleteMatchResult, clearAllDemoData } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Trophy, Plus, CheckCircle2, Calculator, Edit3, Trash2, AlertTriangle } from 'lucide-react';

export default function AdminResultsPage() {
  const { showToast } = useToast();
  const [results, setResults] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

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

  const handleOpenNew = () => {
    setEditingResult(null);
    setIsModalOpen(true);
  };

  const handleEdit = (res) => {
    setEditingResult(res);
    setIsModalOpen(true);
  };

  const handleDelete = async (resItem) => {
    const targetId = resItem.id || resItem._id || resItem.matchId || resItem.matchNumber;
    if (window.confirm(`Are you sure you want to delete match #${resItem.matchNumber} scorecard?`)) {
      const res = await deleteMatchResult(targetId);
      if (res && (res.success || res.status === 200)) {
        setResults((prev) =>
          prev.filter(
            (r) =>
              (r.id ? r.id !== targetId : true) &&
              (r._id ? r._id !== targetId : true) &&
              (r.matchId ? r.matchId !== targetId : true) &&
              Number(r.matchNumber) !== Number(resItem.matchNumber)
          )
        );
        showToast('Match Scorecard Deleted Successfully!', 'info');
      } else {
        showToast('Failed to delete scorecard', 'error');
      }
    }
  };

  const handleClearAllDemoData = async () => {
    if (window.confirm('⚠️ CRITICAL WARNING: Are you sure you want to delete ALL demo data across teams, matches, scorecards, announcements, and media proof gallery?')) {
      const res = await clearAllDemoData();
      if (res && (res.success || res.status === 200)) {
        setResults([]);
        setMatches([]);
        setTeams([]);
        showToast('All demo data deleted successfully!', 'success');
      } else {
        showToast('Failed to delete demo data', 'error');
      }
    }
  };

  const handleSubmitResult = async (payload) => {
    try {
      const newRes = await submitMatchResult(payload);
      if (newRes) {
        setResults((prev) => {
          const matchNum = Number(newRes.matchNumber || payload.matchNumber);
          const targetId = newRes.id || newRes._id || newRes.matchId || payload.matchId;

          const existsIndex = prev.findIndex((r) =>
            (r.id && (r.id === targetId || r.id === payload.matchId)) ||
            (r._id && (r._id === targetId || r._id === payload.matchId)) ||
            (r.matchId && (r.matchId === targetId || r.matchId === payload.matchId)) ||
            Number(r.matchNumber) === matchNum
          );

          if (existsIndex !== -1) {
            const updated = [...prev];
            updated[existsIndex] = { ...updated[existsIndex], ...newRes };
            return updated;
          }
          return [newRes, ...prev];
        });
        showToast('Match Results & Leaderboard Updated!', 'success');
      } else {
        showToast('Failed to save match results', 'error');
      }
    } catch (err) {
      console.error('handleSubmitResult error:', err);
      showToast('Error saving match result', 'error');
    }
    setEditingResult(null);
  };

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-premium-border pb-6">
        <div>
          <h1 className="font-bold text-3xl text-premium-text tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-600" /> Scorecard Calculator
          </h1>
          <p className="text-sm text-premium-text-secondary font-medium mt-2">Enter placement rank and kills with live points preview.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="danger" size="md" icon={Trash2} onClick={handleClearAllDemoData}>
            Clear Demo Data
          </Button>

          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenNew}>
            New Scorecard
          </Button>
        </div>
      </div>

      {/* PUBLISHED RESULTS LIST WITH HORIZONTAL SCROLL */}
      <div className="bg-premium-surface border border-premium-border rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[950px]">
            <thead className="bg-premium-background text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest border-b border-premium-border">
              <tr>
                <th className="px-6 py-4">Match Number</th>
                <th className="px-6 py-4">WWCD Winner</th>
                <th className="px-6 py-4">Kills</th>
                <th className="px-6 py-4">Winner Points</th>
                <th className="px-6 py-4">Top Fragger MVP</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-premium-border bg-white">
              {results.map((res) => {
                const resId = res.id || res._id;
                return (
                  <tr key={resId} className="hover:bg-premium-surface-soft transition-colors">
                    <td className="px-6 py-5 font-bold text-premium-text text-base">Match #{res.matchNumber} <span className="text-sm text-premium-text-secondary font-medium ml-1">({res.map})</span></td>
                    <td className="px-6 py-5 font-bold text-amber-700">{res.winner?.teamName}</td>
                    <td className="px-6 py-5 font-bold text-sky-700">{res.winner?.kills} Kills</td>
                    <td className="px-6 py-5 font-bold text-premium-text">{res.winner?.totalPoints} PTS</td>
                    <td className="px-6 py-5 text-premium-text-secondary font-semibold">
                      {res.mvp?.ign && res.mvp?.name && res.mvp.ign !== res.mvp.name
                        ? `${res.mvp.ign} (${res.mvp.name})`
                        : (res.mvp?.ign || res.mvp?.name || 'N/A')}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <Badge variant="green" size="sm">
                        Published
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="secondary" size="sm" icon={Edit3} onClick={() => handleEdit(res)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(res)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {results.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm font-medium text-premium-text-secondary bg-white">
                    No results published yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESULT ENTRY MODAL */}
      <ResultEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingResult(null);
        }}
        onSubmitResult={handleSubmitResult}
        matches={matches}
        teams={teams}
        results={results}
        editingResult={editingResult}
      />
    </div>
  );
}
