'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import MediaLightbox from '@/components/tournament/MediaLightbox';
import { getMatchById, getResultById } from '@/services/api';
import { MapPin, Calendar, Clock, Trophy, Flame, Play, Image, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params?.id;
  const [match, setMatch] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!matchId) return;
      setLoading(true);
      const mData = await getMatchById(matchId);
      const rData = await getResultById(matchId);
      setMatch(mData);
      setResult(rData);
      setLoading(false);
    }
    loadData();
  }, [matchId]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-slate-400 text-center">Loading Match Details...</div>;
  }

  if (!match) {
    return <EmptyState title="Match Not Found" message="The requested match ID could not be found." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* BACK LINK */}
      <Link href="/matches" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Match Schedule
      </Link>

      {/* MATCH HEADER CARD */}
      <div className="bg-bgmi-surface border border-bgmi-gold/40 rounded-2xl p-6 sm:p-8 clip-tactical shadow-gold-glow space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bgmi-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Badge variant={match.status === 'Live' ? 'live' : match.status === 'Completed' ? 'green' : 'gold'} size="md">
              {match.status}
            </Badge>
            <span className="font-display font-black text-xl text-white">MATCH #{match.matchNumber}</span>
          </div>

          <span className="text-xs font-bold text-bgmi-cyan bg-bgmi-cyan/10 px-3 py-1 rounded border border-bgmi-cyan/30">
            {match.round} STAGE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">MAP LOCATION</span>
            <p className="font-display font-black text-2xl text-bgmi-gold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-bgmi-gold" /> {match.map}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">SCHEDULED DATE & TIME</span>
            <p className="font-display font-black text-xl text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" /> {match.date} @ {match.time}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">REGISTERED SQUADS</span>
            <p className="font-display font-black text-xl text-bgmi-cyan">
              {match.teamsCount || 16} Squads
            </p>
          </div>
        </div>
      </div>

      {/* MATCH RESULT LEADERBOARD (IF COMPLETED) */}
      {result && result.leaderboard && (
        <section className="space-y-6">
          <div className="border-b border-bgmi-border/60 pb-4">
            <h2 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
              <Trophy className="w-6 h-6 text-bgmi-gold" /> Official Match Scorecard
            </h2>
          </div>

          <div className="overflow-x-auto bg-bgmi-surface border border-bgmi-border rounded-xl shadow-2xl clip-tactical">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-bgmi-dark/90 text-slate-400 font-display font-black uppercase tracking-wider border-b border-bgmi-border">
                <tr>
                  <th className="py-3 px-4 text-center">Rank</th>
                  <th className="py-3 px-4">Squad Name</th>
                  <th className="py-3 px-4 text-center">Placement Pts</th>
                  <th className="py-3 px-4 text-center">Kills</th>
                  <th className="py-3 px-4 text-center">Kill Pts</th>
                  <th className="py-3 px-4 text-center">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bgmi-border/40">
                {result.leaderboard.map((row, idx) => (
                  <tr key={idx} className={idx === 0 ? 'bg-bgmi-gold/10 font-bold' : ''}>
                    <td className="py-3 px-4 text-center">#{row.rank}</td>
                    <td className="py-3 px-4 font-bold text-white">{row.team}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{row.placementPts}</td>
                    <td className="py-3 px-4 text-center text-bgmi-cyan">{row.kills}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{row.killPts}</td>
                    <td className="py-3 px-4 text-center font-black text-bgmi-gold text-sm">{row.total} PTS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* MATCH PROOF (POV & SCREENSHOTS) */}
      {result && result.proofs && (
        <section className="space-y-6">
          <div className="border-b border-bgmi-border/60 pb-4">
            <h2 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-bgmi-green" /> Verified Anti-Cheat & POV Proofs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* POV Videos */}
            <div className="bg-bgmi-surface border border-bgmi-border rounded-xl p-5 clip-tactical space-y-3">
              <h3 className="font-display font-bold text-sm text-bgmi-gold uppercase flex items-center gap-2">
                <Play className="w-4 h-4" /> Winner POV Recordings
              </h3>
              <div className="space-y-2">
                {result.proofs.povVideos?.map((v, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      setSelectedMedia({
                        title: v.title,
                        type: 'POV',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        team: result.winner?.teamName,
                        match: `Match #${match.matchNumber}`,
                        date: match.date,
                      })
                    }
                    className="p-3 bg-bgmi-dark/80 hover:bg-bgmi-dark rounded-lg border border-bgmi-border/60 flex items-center justify-between text-xs cursor-pointer group transition-colors"
                  >
                    <span className="font-bold text-white group-hover:text-bgmi-gold">{v.title}</span>
                    <Badge variant="red" size="sm">
                      Play Video
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Screenshots */}
            <div className="bg-bgmi-surface border border-bgmi-border rounded-xl p-5 clip-tactical space-y-3">
              <h3 className="font-display font-bold text-sm text-bgmi-cyan uppercase flex items-center gap-2">
                <Image className="w-4 h-4" /> Scoreboard Proof Screenshots
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {result.proofs.screenshots?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Proof"
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
                    className="w-full h-24 object-cover rounded-lg border border-bgmi-border hover:border-bgmi-gold cursor-pointer transition-all hover:scale-105"
                  />
                ))}
              </div>
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
    </div>
  );
}
