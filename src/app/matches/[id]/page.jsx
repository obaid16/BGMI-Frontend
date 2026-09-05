'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import SubmitMediaModal from '@/components/tournament/SubmitMediaModal';
import { getMatchById, getResultById } from '@/services/api';
import { MapPin, Clock, Trophy, ArrowLeft, ShieldCheck, Upload, Image as ImageIcon } from 'lucide-react';

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params?.id;
  const [match, setMatch] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!matchId) return;
      setLoading(true);
      const [mData, rData] = await Promise.all([
        getMatchById(matchId),
        getResultById(matchId)
      ]);
      setMatch(mData);
      setResult(rData);
      setLoading(false);
    }
    loadData();
  }, [matchId]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-slate-500 font-mono text-center">Loading Match Details...</div>;
  }

  if (!match) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState title="Match Not Found" message="The requested match could not be located in the tournament schedule." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-sans">
      
      {/* BACK LINK */}
      <Link href="/matches" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Match Schedule
      </Link>

      {/* MATCH HEADER CARD */}
      <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E3DA] dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-2">
            <Badge variant={match.status === 'Live' ? 'live' : match.status === 'Completed' ? 'gold' : 'default'} size="md">
              {match.status}
            </Badge>
            <span className="font-display font-black text-xl text-slate-900 dark:text-white">MATCH #{match.matchNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-bgmi-red bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
              {match.map} MAP
            </span>
            <Button
              variant="primary"
              size="sm"
              icon={Upload}
              onClick={() => setIsSubmitModalOpen(true)}
            >
              Submit Screenshot
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">MAP ARENA</span>
            <p className="font-display font-black text-2xl text-amber-700 dark:text-bgmi-gold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" /> {match.map}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">SCHEDULED TIME</span>
            <p className="font-display font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-bgmi-red" /> {match.date} @ {match.time}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">PARTICIPATING SQUADS</span>
            <p className="font-display font-black text-xl text-bgmi-red">
              All Registered Squads
            </p>
          </div>
        </div>
      </div>

      {/* MATCH RESULT LEADERBOARD (IF COMPLETED) */}
      {result && result.leaderboard && (
        <section className="space-y-4">
          <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-3">
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" /> Official Match Scorecard
            </h2>
          </div>

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
                {result.leaderboard.map((row, idx) => {
                  const rank = parseInt(row.rank, 10);
                  const placementPts = rank === 1 ? 10 : rank === 2 ? 8 : rank === 3 ? 5 : 0;
                  const kills = parseInt(row.kills || 0, 10);
                  const killPts = kills;
                  const totalPts = placementPts + killPts;

                  return (
                    <tr key={idx} className={idx === 0 ? 'bg-amber-500/5 dark:bg-amber-500/10 font-bold' : ''}>
                      <td className="py-3.5 px-4 text-center font-display font-black text-slate-900 dark:text-white">#{rank}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-sm">{row.team}</td>
                      <td className="py-3.5 px-4 text-center text-slate-600 dark:text-slate-400">{placementPts}</td>
                      <td className="py-3.5 px-4 text-center text-bgmi-red font-bold">{kills}</td>
                      <td className="py-3.5 px-4 text-center text-slate-600 dark:text-slate-400">{killPts}</td>
                      <td className="py-3.5 px-4 text-center font-black text-amber-700 dark:text-bgmi-gold text-sm font-display">{totalPts} PTS</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* MATCH SCOREBOARD PROOF SCREENSHOTS */}
      {result && result.proofs && result.proofs.screenshots && result.proofs.screenshots.length > 0 && (
        <section className="space-y-4">
          <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-3">
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-bgmi-red" /> Verified Scoreboard Proof Screenshots
            </h2>
          </div>

          <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-6 shadow-editorial-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-bgmi-red uppercase flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-bgmi-red" /> Scoreboard Proof Screenshots
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {result.proofs.screenshots.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Scoreboard Proof Screenshot"
                  onClick={() =>
                    setSelectedMedia({
                      title: `Match #${match.matchNumber} Scoreboard Proof`,
                      type: 'Screenshots',
                      imageUrl: img,
                      thumbnail: img,
                      team: result.winner?.teamName,
                      match: `Match #${match.matchNumber}`,
                      date: match.date,
                    })
                  }
                  className="w-full h-52 object-cover rounded-2xl border border-[#E7E3DA] dark:border-[#1E2638] hover:border-bgmi-red cursor-pointer transition-all hover:scale-105"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MEDIA LIGHTBOX */}
      <MediaLightbox
        item={selectedMedia}
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />

      {/* SUBMIT MEDIA MODAL */}
      <SubmitMediaModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
}
