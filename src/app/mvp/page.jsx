'use client';

import React, { useState, useEffect } from 'react';
import { getPlayers } from '@/services/api';
import { Trophy, Search, Award, Medal, Zap, Flame } from 'lucide-react';
import { SkeletonGrid } from '@/components/common/Skeleton';

export default function MVPLeaderboardPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getPlayers();
        const sorted = data.sort((a, b) => (b.kills || 0) - (a.kills || 0));
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

  const topThree = filteredPlayers.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center justify-center sm:justify-start gap-3">
            <Flame className="w-9 h-9 sm:w-11 sm:h-11 text-bgmi-red" /> MVP & Top Fraggers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-medium">
            Lobby fragger leaderboards and kill statistics. The highest fraggers of Championship 2026.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Player or Squad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-bgmi-surface/90 border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-bgmi-red transition-all font-medium shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-bgmi-surface border border-slate-200 dark:border-bgmi-border rounded-2xl p-8 clip-tactical shadow-md">
          <Award className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">No Players Found</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Check back later or refine your search filters.</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* TOP 3 PODIUM */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 max-w-4xl mx-auto items-end">
              
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="bg-white dark:bg-bgmi-surface/90 border border-slate-300 dark:border-slate-500/40 rounded-2xl p-6 text-center space-y-4 order-2 md:order-1 flex flex-col justify-between relative clip-tactical shadow-lg">
                  <div className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-display font-black text-xs uppercase tracking-wider shadow-sm mx-auto">
                    <Medal className="w-3.5 h-3.5" /> #2 FRAGGER
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-slate-900 dark:text-white truncate">{topThree[1].ign}</h3>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-semibold">{topThree[1].teamName}</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-bgmi-dark/90 py-3 rounded-xl border border-slate-200 dark:border-bgmi-border">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Kills</p>
                    <p className="font-display font-black text-3xl text-slate-900 dark:text-slate-200">{topThree[1].kills || 0}</p>
                  </div>
                </div>
              )}

              {/* 1st Place MVP */}
              {topThree[0] && (
                <div className="bg-white dark:bg-gradient-to-b dark:from-bgmi-red/20 dark:via-bgmi-surface dark:to-bgmi-dark border-2 border-amber-500 dark:border-bgmi-gold rounded-2xl p-8 text-center space-y-4 order-1 md:order-2 flex flex-col justify-between relative shadow-gold-glow clip-tactical scale-105">
                  <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 dark:bg-bgmi-gold text-slate-950 font-display font-black text-xs uppercase tracking-widest shadow-gold-glow mx-auto">
                    <Trophy className="w-4 h-4 fill-slate-950" /> OVERALL MVP
                  </div>
                  <div>
                    <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white truncate">{topThree[0].ign}</h3>
                    <p className="text-xs text-amber-600 dark:text-bgmi-gold font-bold uppercase tracking-widest">{topThree[0].teamName}</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-bgmi-dark/90 py-4 rounded-xl border border-amber-300 dark:border-bgmi-gold/40">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Kills</p>
                    <p className="font-display font-black text-5xl text-amber-600 dark:text-bgmi-gold">{topThree[0].kills || 0}</p>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="bg-white dark:bg-bgmi-surface/90 border border-amber-400 dark:border-amber-800/40 rounded-2xl p-6 text-center space-y-4 order-3 md:order-3 flex flex-col justify-between relative clip-tactical shadow-lg">
                  <div className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-amber-700 text-amber-100 font-display font-black text-xs uppercase tracking-wider shadow-sm mx-auto">
                    <Medal className="w-3.5 h-3.5" /> #3 FRAGGER
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-slate-900 dark:text-white truncate">{topThree[2].ign}</h3>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-semibold">{topThree[2].teamName}</p>
                  </div>
                  <div className="bg-slate-100 dark:bg-bgmi-dark/90 py-3 rounded-xl border border-slate-200 dark:border-bgmi-border">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Kills</p>
                    <p className="font-display font-black text-3xl text-amber-600 dark:text-amber-500">{topThree[2].kills || 0}</p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* LEADERBOARD TABLE */}
          <div className="bg-white dark:bg-bgmi-surface/90 border border-slate-200 dark:border-bgmi-border rounded-2xl overflow-hidden clip-tactical shadow-lg dark:shadow-2xl">
            <div className="p-4 bg-slate-100 dark:bg-bgmi-dark/80 border-b border-slate-200 dark:border-bgmi-border flex items-center justify-between">
              <span className="font-display font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-bgmi-red" /> Detailed Fragger & K/D Leaderboard
              </span>
              <span className="text-[10px] font-mono text-bgmi-gold uppercase font-bold">K/D Formula: Kills ÷ Matches</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 dark:bg-bgmi-dark dark:border-bgmi-border dark:text-slate-400 font-display font-black uppercase text-[10px]">
                  <tr>
                    <th className="p-4 w-16 text-center">Rank</th>
                    <th className="p-4">Player / IGN</th>
                    <th className="p-4">Squad Name</th>
                    <th className="p-4 text-center">Matches</th>
                    <th className="p-4 text-center">Total Kills</th>
                    <th className="p-4 text-center">K/D Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-bgmi-border/40 font-mono text-slate-800 dark:text-slate-300">
                  {filteredPlayers.map((player, idx) => {
                    const pKills = player.kills || 0;
                    const pMatches = player.matchesPlayed || 1;
                    const pKd = (pKills / Math.max(1, pMatches)).toFixed(2);

                    return (
                      <tr
                        key={player.id || player._id || idx}
                        className="hover:bg-slate-50 dark:hover:bg-bgmi-dark/60 transition-colors"
                      >
                        <td className="p-4 text-center font-display font-black text-sm">
                          {idx + 1 === 1 ? (
                            <span className="text-amber-600 dark:text-bgmi-gold font-bold">★ 1</span>
                          ) : idx + 1 === 2 ? (
                            <span className="text-slate-700 dark:text-slate-300 font-bold">★ 2</span>
                          ) : idx + 1 === 3 ? (
                            <span className="text-amber-600 font-bold">★ 3</span>
                          ) : (
                            idx + 1
                          )}
                        </td>
                        <td className="p-4 font-sans">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{player.ign || player.name}</p>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest">{player.role}</p>
                        </td>
                        <td className="p-4 font-sans font-bold text-slate-800 dark:text-slate-200">{player.teamName || 'N/A'}</td>
                        <td className="p-4 text-center font-bold text-slate-400">{pMatches} M</td>
                        <td className="p-4 text-center font-black text-bgmi-gold text-sm flex items-center justify-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-bgmi-red" /> {pKills}
                        </td>
                        <td className="p-4 text-center font-black text-sky-400 text-sm">{pKd}</td>
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
