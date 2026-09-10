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
    <div className="max-w-[1500px] mx-auto px-6 lg:px-8 py-16 space-y-12">
      
      {/* HEADER */}
      <div className="border-b border-premium-border pb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 uppercase tracking-widest">
            <Flame className="w-4 h-4" /> Top Fragger Leaderboard
          </div>
          <h1 className="font-bold text-5xl sm:text-6xl text-premium-text tracking-tight">
            MVP Standings
          </h1>
          <p className="text-base text-premium-text-secondary max-w-2xl">
            Player fragger rankings, kill tallies, squad WWCD Chicken Dinners, and tournament MVP standings.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-text-secondary" />
          <input
            type="text"
            placeholder="Search player or squad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-premium-surface border border-premium-border rounded-[16px] text-premium-text text-sm focus:outline-none focus:border-premium-text transition-colors shadow-sm placeholder:text-premium-text-secondary/70"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center py-20 bg-premium-surface border border-premium-border rounded-[24px] shadow-sm">
          <Award className="w-12 h-12 text-premium-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="font-bold text-xl text-premium-text">No Fraggers Found</h3>
          <p className="text-sm text-premium-text-secondary mt-2">No players matched your search filter.</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* DEDICATED MVP PLAYER HERO SPOTLIGHT */}
          {topMvp && (
            <div className="relative bg-premium-surface border border-premium-border rounded-[28px] p-8 sm:p-12 shadow-sm overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* LEFT HERO SPECS */}
                <div className="lg:col-span-8 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    <Trophy className="w-4 h-4" /> Overall Tournament MVP
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-bold text-5xl sm:text-7xl tracking-tight text-premium-text">
                      {topMvp.ign || topMvp.name}
                    </h2>
                    <p className="font-semibold text-premium-text-secondary text-sm tracking-widest uppercase flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-2">
                      <span>Squad: {topMvp.teamName || 'Campus Contender'}</span>
                      {topMvp.wwcd > 0 && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px]">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> {topMvp.wwcd} WWCD
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-premium-background p-6 rounded-[20px] border border-premium-border w-full max-w-2xl text-center">
                    <div>
                      <span className="text-[10px] text-premium-text-secondary uppercase font-semibold tracking-widest block mb-1">Total Kills</span>
                      <span className="font-bold text-3xl text-premium-sage flex items-center justify-center gap-1.5">
                        <Flame className="w-5 h-5 text-premium-sage" /> {topMvp.kills || 0}
                      </span>
                    </div>
                    <div className="border-l border-premium-border">
                      <span className="text-[10px] text-premium-text-secondary uppercase font-semibold tracking-widest block mb-1">Chicken Dinners</span>
                      <span className="font-bold text-3xl text-amber-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> {topMvp.wwcd || 0}
                      </span>
                    </div>
                    <div className="border-l border-premium-border">
                      <span className="text-[10px] text-premium-text-secondary uppercase font-semibold tracking-widest block mb-1">Matches</span>
                      <span className="font-bold text-3xl text-premium-text">
                        {topMvp.matchesPlayed || 1}
                      </span>
                    </div>
                    <div className="border-l border-premium-border">
                      <span className="text-[10px] text-premium-text-secondary uppercase font-semibold tracking-widest block mb-1">K/D Ratio</span>
                      <span className="font-bold text-3xl text-premium-text">
                        {((topMvp.kills || 0) / Math.max(1, topMvp.matchesPlayed || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT FRAGGER EMBLEM */}
                <div className="lg:col-span-4 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm relative">
                    <Target className="w-20 h-20" />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TIE BREAKER INFORMATIONAL BANNER */}
          <div className="p-5 bg-premium-surface-soft border border-premium-border rounded-[20px] flex items-center gap-4 text-sm text-premium-text-secondary font-medium shadow-sm">
            <div className="w-10 h-10 rounded-full bg-white border border-premium-border flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-premium-text-secondary" />
            </div>
            <div>
              <span className="font-semibold text-premium-text uppercase tracking-widest text-[11px] block mb-0.5">Tie-Breaker Rule</span>
              <span>If two players have the same kill count, rank is determined by: <strong>1. Total Kills → 2. Squad Chicken Dinners (WWCD) → 3. Fewer Matches Played → 4. K/D Ratio</strong></span>
            </div>
          </div>

          {/* DETAILED FRAGGER TELEMETRY TABLE */}
          <div className="bg-premium-surface border border-premium-border rounded-[24px] overflow-hidden shadow-sm">
            <div className="p-6 bg-premium-surface-soft border-b border-premium-border flex items-center justify-between">
              <span className="font-bold text-lg text-premium-text flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> All Player Ratings
              </span>
              <span className="text-[10px] text-premium-text-secondary font-semibold uppercase tracking-widest">Rankings Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-premium-surface border-b border-premium-border text-premium-text-secondary font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-4 px-6 text-center">Rank</th>
                    <th className="py-4 px-6">Player IGN</th>
                    <th className="py-4 px-6">Squad</th>
                    <th className="py-4 px-6 text-center text-premium-sage">Total Kills</th>
                    <th className="py-4 px-6 text-center text-amber-600">WWCD</th>
                    <th className="py-4 px-6 text-center">Matches</th>
                    <th className="py-4 px-6 text-center">K/D Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-premium-border bg-premium-background">
                  {filteredPlayers.map((player, idx) => {
                    const pKills = player.kills || 0;
                    const pWwcd = player.wwcd || 0;
                    const pMatches = player.matchesPlayed || 1;
                    const pKd = (pKills / Math.max(1, pMatches)).toFixed(2);
                    const rankNum = String(idx + 1).padStart(2, '0');
                    const isTop1 = idx === 0;

                    return (
                      <tr key={player.id || player._id || idx} className={`hover:bg-premium-surface-soft transition-colors ${isTop1 ? 'bg-amber-50/50' : ''}`}>
                        <td className="py-4 px-6 text-center font-bold">
                          {isTop1 ? (
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md">#01</span>
                          ) : (
                            <span className="text-premium-text-secondary">#{rankNum}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-bold text-premium-text">
                          {player.ign || player.name}
                        </td>
                        <td className="py-4 px-6 font-medium text-premium-text-secondary">{player.teamName || 'N/A'}</td>
                        <td className="py-4 px-6 text-center font-bold text-premium-sage">
                          {pKills}
                        </td>
                        <td className="py-4 px-6 text-center font-semibold text-amber-600">
                          {pWwcd > 0 ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> ${pWwcd}` : '0'}
                        </td>
                        <td className="py-4 px-6 text-center font-medium text-premium-text-secondary">{pMatches}</td>
                        <td className="py-4 px-6 text-center font-bold text-premium-text">{pKd}</td>
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
