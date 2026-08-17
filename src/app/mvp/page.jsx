'use client';

import React, { useState, useEffect } from 'react';
import { getMVP } from '@/services/api';
import { Trophy, Search, Flame, Award, Zap, Shield, Target } from 'lucide-react';
import { SkeletonGrid } from '@/components/common/Skeleton';

export default function MVPLeaderboardPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getMVP();
        const playerList = data?.players || data || [];
        const sorted = playerList.sort((a, b) => (b.kills || 0) - (a.kills || 0));
        setPlayers(sorted);
      } catch (err) {
        console.error('Failed to load players for MVP:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPlayers = players.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ign?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.teamName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topMvp = filteredPlayers[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-bgmi-red uppercase tracking-widest">
            <Flame className="w-4 h-4" /> FRAGGER TELEMETRY
          </div>
          <h1 className="font-broadcast font-black text-4xl sm:text-6xl text-slate-900 dark:text-white uppercase tracking-tight">
            MVP & TOP FRAGGERS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Player fragger rankings, kill tallies, and overall tournament MVP standings.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="SEARCH PLAYER OR SQUAD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#121620] border-2 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs font-mono font-bold uppercase focus:outline-none focus:border-bgmi-red transition-all shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#121620] border-2 border-slate-200 dark:border-white/10 rounded-2xl p-8 clip-tactical shadow-md">
          <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-broadcast font-bold text-xl text-slate-900 dark:text-white">NO FRAGGERS RECORDED</h3>
          <p className="text-xs text-slate-500 mt-1 font-mono">No players matched your search filter.</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* DEDICATED MVP PLAYER HERO SPOTLIGHT */}
          {topMvp && (
            <div className="relative bg-gradient-to-r from-bgmi-red via-rose-600 to-slate-950 text-white rounded-2xl p-8 sm:p-12 clip-tactical shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* LEFT HERO SPECS */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-slate-950 text-amber-400 border border-amber-400/40 font-mono text-xs font-black uppercase tracking-widest shadow-lg">
                    <Trophy className="w-4 h-4" /> OVERALL TOURNAMENT MVP
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-broadcast font-black text-5xl sm:text-7xl uppercase tracking-tight text-white drop-shadow-lg">
                      {topMvp.ign || topMvp.name}
                    </h2>
                    <p className="font-mono font-bold text-amber-300 text-sm tracking-wider uppercase">
                      SQUAD: {topMvp.teamName || 'CAMPUS CONTENDER'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-xl border border-white/10 font-mono text-center max-w-lg">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">TOTAL KILLS</span>
                      <span className="font-broadcast font-black text-amber-400 text-3xl sm:text-4xl flex items-center justify-center gap-1">
                        <Flame className="w-5 h-5 text-bgmi-red" /> {topMvp.kills || 0}
                      </span>
                    </div>
                    <div className="border-x border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">MATCHES</span>
                      <span className="font-broadcast font-black text-white text-3xl sm:text-4xl">
                        {topMvp.matchesPlayed || 4}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">K/D RATIO</span>
                      <span className="font-broadcast font-black text-sky-400 text-3xl sm:text-4xl">
                        {((topMvp.kills || 0) / Math.max(1, topMvp.matchesPlayed || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT FRAGGER EMBLEM */}
                <div className="lg:col-span-4 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-slate-950 border-4 border-amber-400 flex items-center justify-center text-bgmi-red text-6xl shadow-2xl relative">
                    <Target className="w-20 h-20 text-bgmi-red animate-pulse" />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* DETAILED FRAGGER TELEMETRY TABLE */}
          <div className="bg-white dark:bg-[#121620] border-2 border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden clip-tactical shadow-xl">
            <div className="p-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="font-broadcast font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-bgmi-red" /> ALL PLAYER FRAGGER RATINGS
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">SORTED BY KILL COUNT</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-[#0B0E14] border-b border-slate-200 dark:border-white/10 text-slate-500 font-broadcast font-black uppercase text-[10px]">
                  <tr>
                    <th className="p-4 w-16 text-center">RANK</th>
                    <th className="p-4">PLAYER IGN</th>
                    <th className="p-4">SQUAD</th>
                    <th className="p-4 text-center">MATCHES</th>
                    <th className="p-4 text-center">TOTAL KILLS</th>
                    <th className="p-4 text-center">K/D RATIO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-800 dark:text-slate-200">
                  {filteredPlayers.map((player, idx) => {
                    const pKills = player.kills || 0;
                    const pMatches = player.matchesPlayed || 1;
                    const pKd = (pKills / Math.max(1, pMatches)).toFixed(2);
                    const rankNum = String(idx + 1).padStart(2, '0');

                    return (
                      <tr key={player.id || player._id || idx} className="hover:bg-slate-50 dark:hover:bg-[#181E2C] transition-colors">
                        <td className="p-4 text-center font-broadcast font-black text-sm text-slate-500">
                          {rankNum === '01' ? (
                            <span className="text-amber-500 font-black">#01</span>
                          ) : (
                            `#${rankNum}`
                          )}
                        </td>
                        <td className="p-4 font-sans font-bold text-slate-900 dark:text-white text-sm">
                          {player.ign || player.name}
                        </td>
                        <td className="p-4 font-bold text-slate-600 dark:text-slate-400">{player.teamName || 'N/A'}</td>
                        <td className="p-4 text-center text-slate-400">{pMatches}</td>
                        <td className="p-4 text-center font-broadcast font-black text-amber-500 text-sm">
                          🔥 {pKills}
                        </td>
                        <td className="p-4 text-center font-broadcast font-black text-sky-400 text-sm">{pKd}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
