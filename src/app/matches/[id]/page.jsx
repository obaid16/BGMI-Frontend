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
import { MapPin, Clock, Trophy, ArrowLeft, ShieldCheck, Upload, Image } from 'lucide-react';

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
    return <div className="max-w-[1500px] mx-auto px-6 py-20 text-premium-text-secondary text-center">Loading Match Details...</div>;
  }

  if (!match) {
    return <EmptyState title="Match Not Found" message="The requested match ID could not be found." />;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 space-y-12">
      
      {/* BACK LINK */}
      <Link href="/matches" className="group inline-flex items-center gap-2 text-sm font-medium text-premium-text-secondary hover:text-black transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Match Schedule
      </Link>

      {/* MATCH HEADER CARD */}
      <div className="bg-premium-surface border border-premium-border rounded-[28px] p-8 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-premium-border pb-6">
          <div className="flex items-center gap-4">
            <Badge variant={match.status === 'Live' ? 'live' : match.status === 'Completed' ? 'green' : 'gold'} size="lg">
              {match.status}
            </Badge>
            <span className="font-bold text-2xl text-premium-text">Match #{String(match.matchNumber).padStart(2, '0')}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-premium-sage bg-premium-sage-soft px-3.5 py-1.5 rounded-full border border-premium-sage/30 tracking-wide uppercase">
              {match.map}
            </span>
            <Button
              variant="primary"
              size="sm"
              icon={Upload}
              onClick={() => setIsSubmitModalOpen(true)}
            >
              Submit Proof
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1.5">
            <span className="text-[11px] text-premium-text-secondary font-semibold uppercase tracking-widest">Map Arena</span>
            <p className="font-bold text-2xl text-premium-text flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-premium-sage" /> {match.map}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-premium-text-secondary font-semibold uppercase tracking-widest">Scheduled For</span>
            <p className="font-bold text-xl text-premium-text flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-premium-text-secondary" /> {match.date} <span className="text-premium-text-secondary mx-1">@</span> {match.time}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-premium-text-secondary font-semibold uppercase tracking-widest">Participating Squads</span>
            <p className="font-bold text-xl text-premium-sage">
              All Registered Squads
            </p>
          </div>
        </div>
      </div>

      {/* MATCH RESULT LEADERBOARD (IF COMPLETED) */}
      {result && result.leaderboard && (
        <section className="space-y-6">
          <div className="border-b border-premium-border pb-4">
            <h2 className="font-bold text-2xl text-premium-text tracking-tight flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500" /> Official Scorecard
            </h2>
          </div>

          <div className="overflow-x-auto bg-premium-surface border border-premium-border rounded-[24px] shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-premium-surface-soft border-b border-premium-border text-premium-text-secondary font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-4 px-6 text-center font-medium">Rank</th>
                  <th className="py-4 px-6 font-medium">Squad Name</th>
                  <th className="py-4 px-6 text-center font-medium">Placement Pts</th>
                  <th className="py-4 px-6 text-center font-medium">Kills</th>
                  <th className="py-4 px-6 text-center font-medium">Kill Pts</th>
                  <th className="py-4 px-6 text-center font-medium text-premium-text">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-premium-border bg-premium-background">
                {result.leaderboard.map((row, idx) => {
                  const rank = parseInt(row.rank, 10);
                  const placementPts = rank === 1 ? 10 : rank === 2 ? 8 : rank === 3 ? 5 : 0;
                  const kills = parseInt(row.kills || 0, 10);
                  const killPts = kills;
                  const totalPts = placementPts + killPts;
                  const isTop1 = rank === 1;

                  return (
                    <tr key={idx} className={`hover:bg-premium-surface-soft transition-colors ${isTop1 ? 'bg-amber-50/50' : ''}`}>
                      <td className="py-4 px-6 text-center font-bold">
                        <span className={`px-2.5 py-1 rounded-md ${isTop1 ? 'bg-amber-100 text-amber-700' : 'text-premium-text-secondary'}`}>
                          #{rank}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-premium-text">{row.team}</td>
                      <td className="py-4 px-6 text-center font-medium text-premium-text-secondary">{placementPts}</td>
                      <td className="py-4 px-6 text-center font-semibold text-premium-sage">{kills}</td>
                      <td className="py-4 px-6 text-center font-medium text-premium-text-secondary">{killPts}</td>
                      <td className="py-4 px-6 text-center font-bold text-premium-text">{totalPts} pts</td>
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
        <section className="space-y-6">
          <div className="border-b border-premium-border pb-4">
            <h2 className="font-bold text-2xl text-premium-text tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500" /> Verified Scoreboard Proofs
            </h2>
          </div>

          <div className="bg-premium-surface border border-premium-border rounded-[24px] p-8 space-y-6 shadow-sm">
            <h3 className="font-semibold text-sm text-premium-text uppercase tracking-widest flex items-center gap-2.5">
              <Image className="w-4 h-4 text-premium-text-secondary" /> Screenshots
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {result.proofs.screenshots.map((img, idx) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden group border border-premium-border shadow-sm cursor-pointer hover:shadow-premium-float transition-all aspect-video">
                  <img
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
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>
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
