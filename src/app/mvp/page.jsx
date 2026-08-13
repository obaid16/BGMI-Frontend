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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* HEADER */}
      <div className="border-b border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 pb-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white dark:text-white light:text-slate-900 uppercase tracking-wide flex items-center justify-center sm:justify-start gap-3">
            <Flame className="w-9 h-9 sm:w-11 sm:h-11 text-bgmi-red" /> MVP & Top Fraggers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl font-medium">
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
            className="w-full pl-10 pr-4 py-2.5 bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-slate-100 border border-bgmi-border dark:border-bgmi-border light:border-slate-300 rounded-xl text-white dark:text-white light:text-slate-900 text-xs focus:outline-none focus:border-bgmi-red transition-all"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center py-16 bg-bgmi-surface dark:bg-bgmi-surface light:bg-white border border-bgmi-border dark:border-bgmi-border light:border-slate-200 rounded-2xl p-8 clip-tactical">
          <Award className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-white dark:text-white light:text-slate-900">No Players Found</h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-1">Check back later or refine your search filters.</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* TOP 3 PODIUM */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-4xl mx-auto items-end">
              
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-white border border-slate-500/40 dark:border-slate-500/40 light:border-slate-300 rounded-2xl p-6 text-center space-y-4 order-2 md:order-1 flex flex-col justify-between relative clip-tactical shadow-lg">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-950 font-display font-black text-xs px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Medal className="w-3.5 h-3.5" /> #2 FRAGGER
                  </div>
                  <div className="pt-2">
                    <h3 className="font-display font-black text-lg text-white dark:text-white light:text-slate-900 truncate">{topThree[1].ign}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-widest font-semibold">{topThree[1].teamName}</p>
                  </div>
                  <div className="bg-bgmi-dark/90 dark:bg-bgmi-dark/90 light:bg-slate-100 py-3 rounded-xl border border-bgmi-border dark:border-bgmi-border light:border-slate-200">
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold uppercase">Kills</p>
                    <p className="font-display font-black text-3xl text-slate-200 dark:text-slate-200 light:text-slate-800">{topThree[1].kills || 0}</p>
                  </div>
                </div>
              )}

              {/* 1st Place MVP */}
              {topThree[0] && (
                <div className="bg-gradient-to-b from-bgmi-red/20 via-bgmi-surface to-bgmi-dark dark:via-bgmi-surface light:via-white light:to-slate-100 border-2 border-bgmi-gold rounded-2xl p-8 text-center space-y-4 order-1 md:order-2 flex flex-col justify-between relative shadow-gold-glow clip-tactical">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-bgmi-gold text-slate-950 font-display font-black text-xs px-4 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                    <Trophy className="w-4 h-4 fill-slate-950" /> OVERALL MVP
                  </div>
                  <div className="pt-2">
                    <h3 className="font-display font-black text-2xl text-white dark:text-white light:text-slate-900 truncate">{topThree[0].ign}</h3>
                    <p className="text-xs text-bgmi-gold dark:text-bgmi-gold light:text-amber-600 font-bold uppercase tracking-widest">{topThree[0].teamName}</p>
                  </div>
                  <div className="bg-bgmi-dark/90 dark:bg-bgmi-dark/90 light:bg-slate-100 py-4 rounded-xl border border-bgmi-gold/40 dark:border-bgmi-gold/40 light:border-amber-300">
                    <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold uppercase tracking-wider">Total Kills</p>
                    <p className="font-display font-black text-5xl text-bgmi-gold dark:text-bgmi-gold light:text-amber-600">{topThree[0].kills || 0}</p>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-white border border-amber-800/40 dark:border-amber-800/40 light:border-amber-300 rounded-2xl p-6 text-center space-y-4 order-3 md:order-3 flex flex-col justify-between relative clip-tactical shadow-lg">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 font-display font-black text-xs px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Medal className="w-3.5 h-3.5" /> #3 FRAGGER
                  </div>
                  <div className="pt-2">
                    <h3 className="font-display font-black text-lg text-white dark:text-white light:text-slate-900 truncate">{topThree[2].ign}</h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-widest font-semibold">{topThree[2].teamName}</p>
                  </div>
                  <div className="bg-bgmi-dark/90 dark:bg-bgmi-dark/90 light:bg-slate-100 py-3 rounded-xl border border-bgmi-border dark:border-bgmi-border light:border-slate-200">
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold uppercase">Kills</p>
                    <p className="font-display font-black text-3xl text-amber-500">{topThree[2].kills || 0}</p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* LEADERBOARD TABLE */}
          <div className="bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-white border border-bgmi-border dark:border-bgmi-border light:border-slate-200 rounded-2xl overflow-hidden clip-tactical shadow-2xl">
            <div className="p-4 bg-bgmi-dark/80 dark:bg-bgmi-dark/80 light:bg-slate-100 border-b border-bgmi-border dark:border-bgmi-border light:border-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-bgmi-red" />
              <span className="font-display font-black text-xs uppercase tracking-wider text-slate-200 dark:text-slate-200 light:text-slate-800">Detailed Fragger Leaderboard</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-bgmi-dark dark:bg-bgmi-dark light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-700 font-display font-black uppercase text-[10px] border-b border-bgmi-border dark:border-bgmi-border light:border-slate-200">
                  <tr>
                    <th className="p-4 w-16 text-center">Rank</th>
                    <th className="p-4">Player / IGN</th>
                    <th className="p-4">Squad Name</th>
                    <th className="p-4 text-center w-28">Kills</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bgmi-border/40 dark:divide-bgmi-border/40 light:divide-slate-200 font-mono text-slate-300 dark:text-slate-300 light:text-slate-800">
                  {filteredPlayers.map((player, idx) => (
                    <tr
                      key={player.id || player._id || idx}
                      className="hover:bg-bgmi-dark/60 dark:hover:bg-bgmi-dark/60 light:hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 text-center font-display font-black text-sm">
                        {idx + 1 === 1 ? (
                          <span className="text-bgmi-gold dark:text-bgmi-gold light:text-amber-600 font-bold">★ 1</span>
                        ) : idx + 1 === 2 ? (
                          <span className="text-slate-300 dark:text-slate-300 light:text-slate-700 font-bold">★ 2</span>
                        ) : idx + 1 === 3 ? (
                          <span className="text-amber-600 font-bold">★ 3</span>
                        ) : (
                          idx + 1
                        )}
                      </td>
                      <td className="p-4 font-sans">
                        <p className="font-bold text-white dark:text-white light:text-slate-900 text-sm">{player.ign || player.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-widest">{player.role}</p>
                      </td>
                      <td className="p-4 font-sans font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">{player.teamName || 'N/A'}</td>
                      <td className="p-4 text-center font-black text-bgmi-cyan dark:text-bgmi-cyan light:text-sky-600 text-sm">{player.kills || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
