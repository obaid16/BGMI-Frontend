'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import { getResultById } from '@/services/api';
import { Trophy, Flame, User, Play, Image, ArrowLeft, ShieldCheck } from 'lucide-react';

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
    return <div className="max-w-7xl mx-auto px-4 py-12 text-slate-400 text-center">Loading Result Details...</div>;
  }

  if (!result) {
    return <EmptyState title="Result Not Found" message="The requested match result could not be found." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* BACK LINK */}
      <Link href="/results" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to All Results
      </Link>

      {/* HEADER WINNER BANNER */}
      <div className="bg-gradient-to-r from-bgmi-gold/20 via-bgmi-surface to-bgmi-surface border border-bgmi-gold/50 rounded-2xl p-6 sm:p-8 clip-tactical shadow-gold-glow space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="gold" size="md">
            MATCH #{result.matchNumber} WINNER
          </Badge>
          <span className="text-xs font-bold text-slate-400">{result.round} Stage • {result.map}</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-xl bg-bgmi-dark p-2 border border-bgmi-gold flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10 text-bgmi-gold animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-bgmi-gold">WWCD Champions</p>
              <h1 className="font-display font-black text-3xl text-white">
                {result.winner?.teamName}
              </h1>
              <p className="text-xs text-slate-400">{result.winner?.kills} Total Kills • {result.winner?.totalPoints} PTS</p>
            </div>
          </div>

          {result.mvp && (
            <div className="p-4 bg-bgmi-dark/90 rounded-xl border border-bgmi-border text-center md:text-right space-y-1">
              <span className="text-[10px] font-bold text-bgmi-cyan uppercase tracking-wider block">MVP TOP FRAGGER</span>
              <p className="font-display font-black text-lg text-white">{result.mvp.name}</p>
              <p className="text-xs text-bgmi-gold font-bold">{result.mvp.kills} Kills</p>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED LEADERBOARD TABLE */}
      <section className="space-y-4">
        <h2 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
          <Trophy className="w-6 h-6 text-bgmi-gold" /> Final Scorecard Breakdown
        </h2>

        <div className="overflow-x-auto bg-bgmi-surface border border-bgmi-border rounded-xl shadow-2xl clip-tactical">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-bgmi-dark/90 text-slate-400 font-display font-black uppercase tracking-wider border-b border-bgmi-border">
              <tr>
                <th className="py-3.5 px-4 text-center">Rank</th>
                <th className="py-3.5 px-4">Squad Name</th>
                <th className="py-3.5 px-4 text-center">Placement Pts</th>
                <th className="py-3.5 px-4 text-center">Kills</th>
                <th className="py-3.5 px-4 text-center">Kill Pts</th>
                <th className="py-3.5 px-4 text-center">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bgmi-border/40">
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
                  <tr key={idx} className={rank === 1 ? 'bg-bgmi-gold/10 font-bold' : ''}>
                    <td className="py-3.5 px-4 text-center font-bold">#{rank}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{teamName}</td>
                    <td className="py-3.5 px-4 text-center text-slate-300">{placementPts}</td>
                    <td className="py-3.5 px-4 text-center text-bgmi-cyan font-bold">{kills} Kills</td>
                    <td className="py-3.5 px-4 text-center text-slate-300">{killPts}</td>
                    <td className="py-3.5 px-4 text-center font-black text-bgmi-gold text-sm">{total} PTS</td>
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
