'use client';

import React, { useState, useEffect } from 'react';
import { getMVP } from '@/services/api';
import { Trophy, Search, Flame, Award, Zap, Target, Info } from 'lucide-react';
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
        
        // 4-Tier Official BGMI Tie-Breaker Order:
        // 1. Total Kills -> 2. Chicken Dinners (WWCD) -> 3. Fewer Matches Played -> 4. KD Ratio
        const sorted = playerList.sort((a, b) => {
          if ((b.kills || 0) !== (a.kills || 0)) return (b.kills || 0) - (a.kills || 0);
          if ((b.wwcd || 0) !== (a.wwcd || 0)) return (b.wwcd || 0) - (a.wwcd || 0);
          if ((a.matchesPlayed || 1) !== (b.matchesPlayed || 1)) return (a.matchesPlayed || 1) - (b.matchesPlayed || 1);
          return (b.kdRatio || 0) - (a.kdRatio || 0);
        });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 font-sans">
      
      {/* HEADER */}
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-bgmi-red uppercase tracking-widest">
            <Flame className="w-4 h-4" /> FRAGGER TELEMETRY & TIE-BREAKER STANDINGS
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 dark:text-white uppercase tracking-tight">
            MVP & Top Fraggers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Player fragger rankings, kill counts, squad WWCDs, and tournament MVP standings.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search player or squad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red transition-all shadow-editorial-sm"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-8 shadow-editorial-sm">
          <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white uppercase">No Fraggers Recorded</h3>
          <p className="text-xs text-slate-500 mt-1">No players matched your search filter.</p>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* DEDICATED MVP PLAYER HERO SPOTLIGHT */}
          {topMvp && (
            <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-[#181E2C] text-white rounded-3xl p-6 sm:p-10 shadow-editorial-lg overflow-hidden border border-[#E7E3DA] dark:border-[#1E2638]">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* LEFT HERO SPECS */}
                <div className="lg:col-span-8 space-y-5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono text-xs font-black uppercase tracking-widest shadow-md">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> OVERALL TOURNAMENT MVP
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-white">
                      {topMvp.ign || topMvp.name}
                    </h2>
                    <p className="font-mono font-bold text-amber-400 text-sm tracking-wider uppercase flex items-center justify-center sm:justify-start gap-2">
                      <span>SQUAD: {topMvp.teamName || 'CAMPUS CONTENDER'}</span>
                      {topMvp.wwcd > 0 && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded text-xs">
                          🍗 {topMvp.wwcd} WWCD
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/50 p-4 rounded-2xl border border-white/10 font-mono text-center max-w-xl mx-auto sm:mx-0">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">TOTAL KILLS</span>
                      <span className="font-display font-black text-amber-400 text-2xl sm:text-3xl flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4 text-bgmi-red" /> {topMvp.kills || 0}
                      </span>
                    </div>
                    <div className="border-l border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">CHICKEN DINNERS</span>
                      <span className="font-display font-black text-amber-400 text-2xl sm:text-3xl">
                        🍗 {topMvp.wwcd || 0}
                      </span>
                    </div>
                    <div className="border-l border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">MATCHES</span>
                      <span className="font-display font-black text-white text-2xl sm:text-3xl">
                        {topMvp.matchesPlayed || 1}
                      </span>
                    </div>
                    <div className="border-l border-white/10">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">K/D RATIO</span>
                      <span className="font-display font-black text-sky-400 text-2xl sm:text-3xl">
                        {((topMvp.kills || 0) / Math.max(1, topMvp.matchesPlayed || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT FRAGGER EMBLEM */}
                <div className="lg:col-span-4 flex items-center justify-center">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-slate-900 border-4 border-amber-400 flex items-center justify-center text-bgmi-red shadow-2xl relative">
                    <Target className="w-16 h-16 sm:w-20 sm:h-20 text-bgmi-red animate-pulse" />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TIE BREAKER INFORMATIONAL BANNER */}
          <div className="p-4 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl flex items-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-400 shadow-editorial-sm">
            <Info className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white uppercase block">OFFICIAL BGMI MVP TIE-BREAKER RULE:</span>
              <span>1. Total Kills → 2. Squad Chicken Dinners (WWCD) → 3. Fewer Matches Played → 4. K/D Ratio</span>
            </div>
          </div>

          {/* DETAILED FRAGGER TABLE */}
          <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl overflow-hidden shadow-editorial-sm">
            <div className="p-4 bg-[#FAF8F5] dark:bg-[#0B0E14] border-b border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-between">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-bgmi-red" /> All Player Fragger Ratings
              </span>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase">TIE-BREAKER ACTIVE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-white dark:bg-[#121620] border-b border-[#E7E3DA] dark:border-[#1E2638] text-slate-400 font-display font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4 w-16 text-center">RANK</th>
                    <th className="p-4">PLAYER IGN</th>
                    <th className="p-4">SQUAD</th>
                    <th className="p-4 text-center">TOTAL KILLS</th>
                    <th className="p-4 text-center">WWCD</th>
                    <th className="p-4 text-center">MATCHES</th>
                    <th className="p-4 text-center">K/D RATIO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E3DA] dark:divide-[#1E2638] text-slate-800 dark:text-slate-200">
                  {filteredPlayers.map((player, idx) => {
                    const pKills = player.kills || 0;
                    const pWwcd = player.wwcd || 0;
                    const pMatches = player.matchesPlayed || 1;
                    const pKd = (pKills / Math.max(1, pMatches)).toFixed(2);
                    const rankNum = String(idx + 1).padStart(2, '0');

                    return (
                      <tr key={player.id || player._id || idx} className="hover:bg-[#FAF8F5] dark:hover:bg-[#181E2C] transition-colors">
                        <td className="p-4 text-center font-display font-black text-sm text-slate-500">
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
                        <td className="p-4 text-center font-display font-black text-amber-600 dark:text-amber-400 text-sm">
                          🔥 {pKills}
                        </td>
                        <td className="p-4 text-center font-display font-bold text-amber-500">
                          🍗 {pWwcd} WWCD
                        </td>
                        <td className="p-4 text-center text-slate-500 font-medium">{pMatches}</td>
                        <td className="p-4 text-center font-display font-black text-sky-500 text-sm">{pKd}</td>
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
