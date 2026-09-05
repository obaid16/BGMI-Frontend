'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/components/common/Badge';
import { getTeams, deleteTeam } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Users, Trash2, ShieldCheck, Trophy, Swords } from 'lucide-react';

export default function AdminTeamsPage() {
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getTeams();
        setTeams(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load teams', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDeleteTeam = async (id) => {
    if (deletingId) return;
    if (window.confirm('Are you sure you want to delete this squad profile entirely? This will also remove the players.')) {
      try {
        setDeletingId(id);
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
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-5">
        <div>
          <span className="text-[10px] font-mono text-bgmi-red font-bold uppercase tracking-widest block">
            /// ROSTER DIRECTORY
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2.5 mt-1">
            <Users className="w-6 h-6 text-amber-600 dark:text-bgmi-gold" /> 
            Squad Roster Management
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-normal mt-1">
            Manage participating tournament squads, verify rosters, and oversee registered teams.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shadow-editorial-sm">
          <span className="text-amber-600 dark:text-bgmi-gold">{teams.length}</span>
          <span className="text-slate-500 dark:text-slate-400 uppercase">Squads Registered</span>
        </div>
      </div>

      {/* TEAMS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-200 dark:bg-[#181E2C] animate-pulse" />
          ))}
        </div>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, idx) => {
            const tId = team.id || team._id;
            return (
              <div
                key={tId}
                className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl p-5 space-y-4 shadow-editorial-sm hover:shadow-editorial transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-slate-100 dark:bg-[#181E2C] text-slate-700 dark:text-slate-300">
                      #{team.rank || idx + 1}
                    </span>
                    <Badge variant={team.status === 'Approved' || team.verified ? 'green' : 'pending'} size="sm">
                      {team.status === 'Approved' || team.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3.5">
                    {team.logo ? (
                      <img 
                        src={team.logo} 
                        alt={team.name} 
                        className="w-12 h-12 rounded-xl border border-[#E7E3DA] dark:border-[#1E2638] object-cover shrink-0" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#181E2C] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center font-display font-black text-amber-600 dark:text-bgmi-gold text-lg shrink-0">
                        {(team.name || 'T')[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                        {team.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                        Captain: <span className="font-semibold text-slate-800 dark:text-slate-200">{team.captain?.name || 'N/A'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                    <div className="p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638]">
                      <span className="text-slate-400 block text-[9px] uppercase">Roster</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {team.players?.length || 4} Players
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638]">
                      <span className="text-slate-400 block text-[9px] uppercase">Points</span>
                      <span className="font-bold text-amber-600 dark:text-bgmi-gold">
                        {team.points || team.totalPoints || 0} PTS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {team.registrationId || 'NIT-2026'}
                  </span>
                  <button
                    onClick={() => handleDeleteTeam(tId)}
                    disabled={deletingId === tId}
                    className={`text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 font-display font-bold text-xs uppercase tracking-wider ${
                      deletingId === tId ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl">
          <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
            No squads registered yet. Approved squads from registration will appear here.
          </p>
        </div>
      )}

    </div>
  );
}
