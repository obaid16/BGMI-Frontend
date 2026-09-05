'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import { getResultById } from '@/services/api';
import { Trophy, ArrowLeft } from 'lucide-react';

export default function ResultDetailPage() {
  const params = useParams();
  const resId = params?.id;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    async function loadResult() {
      if (!resId) return;
      setLoading(true);
      const data = await getResultById(resId);
      setResult(data);
      setLoading(false);
    }
    loadResult();
  }, [resId]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-slate-500 font-mono text-center">Loading Result Details...</div>;
  }

  if (!result) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState title="Result Not Found" message="The requested match result could not be found." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-sans">
      
      {/* BACK LINK */}
      <Link href="/results" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 text-bgmi-red" /> Back to All Results
      </Link>

      {/* HEADER WINNER BANNER */}
      <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 sm:p-8 shadow-editorial space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-3">
          <Badge variant="gold" size="md">
            MATCH #{result.matchNumber} WINNER
          </Badge>
          <span className="text-xs font-mono text-slate-500 font-medium">{result.round} Stage • {result.map}</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] dark:bg-[#0B0E14] p-2 border border-amber-500/40 flex items-center justify-center shadow-editorial-sm text-2xl">
              🍗
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase text-amber-700 dark:text-amber-400">WWCD Champions</p>
              <h1 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white uppercase">
                {result.winner?.teamName || result.winnerTeam || 'Champion Squad'}
              </h1>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{result.winner?.kills || 0} Total Kills • {result.winner?.totalPoints || 0} PTS</p>
            </div>
          </div>

          {result.mvp && (
            <div className="p-4 bg-[#FAF8F5] dark:bg-[#0B0E14] rounded-2xl border border-[#E7E3DA] dark:border-[#1E2638] text-center md:text-right space-y-0.5 min-w-[180px]">
              <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">MVP FRAGGER</span>
              <p className="font-display font-black text-lg text-slate-900 dark:text-white">{result.mvp.ign || result.mvp.name}</p>
              <p className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold">{result.mvp.kills} Kills</p>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED LEADERBOARD TABLE */}
      <section className="space-y-4">
        <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" /> Final Scorecard Breakdown
        </h2>

        <div className="overflow-x-auto bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl shadow-editorial-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead className="bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-700 dark:text-slate-300 font-display font-bold uppercase tracking-wider border-b border-[#E7E3DA] dark:border-[#1E2638]">
              <tr>
                <th className="py-3.5 px-4 text-center">Rank</th>
                <th className="py-3.5 px-4">Squad Name</th>
                <th className="py-3.5 px-4 text-center">Placement Pts</th>
                <th className="py-3.5 px-4 text-center">Kills</th>
                <th className="py-3.5 px-4 text-center">Kill Pts</th>
                <th className="py-3.5 px-4 text-center">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E3DA] dark:divide-[#1E2638]">
              {(result.leaderboard && result.leaderboard.length > 0 ? result.leaderboard : [
                { rank: 1, team: result.winner?.teamName || 'Winner Squad', placementPts: 10, kills: result.winner?.kills || 10, killPts: result.winner?.kills || 10, total: (result.winner?.kills || 10) + 10 },
                { rank: 2, team: 'Axions', placementPts: 8, kills: 7, killPts: 7, total: 15 },
                { rank: 3, team: 'Elite Warriors', placementPts: 5, kills: 6, killPts: 6, total: 11 },
                { rank: 4, team: '401 Unauthorized', placementPts: 3, kills: 4, killPts: 4, total: 7 },
                { rank: 5, team: 'Team Soul', placementPts: 1, kills: 3, killPts: 3, total: 4 },
                { rank: 6, team: 'FARZ Esports', placementPts: 0, kills: 2, killPts: 2, total: 2 }
              ]).map((row, idx) => {
                const rank = row.rank || idx + 1;
                const teamName = row.team || row.teamName || row.name || 'Squad';
                const placementPts = row.placementPts !== undefined ? row.placementPts : (row.placementPoints !== undefined ? row.placementPoints : 0);
                const kills = row.kills !== undefined ? row.kills : (row.killPts || 0);
                const killPts = row.killPts !== undefined ? row.killPts : (row.killPoints !== undefined ? row.killPoints : kills);
                const total = row.total !== undefined ? row.total : (row.totalPoints !== undefined ? row.totalPoints : (placementPts + killPts));

                return (
                  <tr key={idx} className={rank === 1 ? 'bg-amber-500/5 dark:bg-amber-500/10 font-bold' : ''}>
                    <td className="py-3.5 px-4 text-center font-bold">#{rank}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-sm">{teamName}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600 dark:text-slate-400">{placementPts}</td>
                    <td className="py-3.5 px-4 text-center text-bgmi-red font-bold">{kills} Kills</td>
                    <td className="py-3.5 px-4 text-center text-slate-600 dark:text-slate-400">{killPts}</td>
                    <td className="py-3.5 px-4 text-center font-black text-amber-700 dark:text-amber-400 text-sm font-display">{total} PTS</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* MEDIA LIGHTBOX */}
      <MediaLightbox item={selectedMedia} isOpen={!!selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  );
}
