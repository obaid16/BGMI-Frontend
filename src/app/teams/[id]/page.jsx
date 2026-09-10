'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PlayerCard from '@/components/tournament/PlayerCard';
import Badge from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/Skeleton';
import { getTeamById } from '@/services/api';
import { Flame, ShieldCheck, Users, ArrowLeft, Swords } from 'lucide-react';
import Link from 'next/link';

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params?.id;
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      if (!teamId) return;
      setLoading(true);
      const data = await getTeamById(teamId);
      setTeam(data);
      setLoading(false);
    }
    fetchTeam();
  }, [teamId]);

  if (loading) {
    return (
      <div className="max-w-[1500px] mx-auto px-6 py-20 text-premium-text-secondary text-center">
        <SkeletonCard />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-[1500px] mx-auto px-6 py-20">
        <EmptyState title="Team Not Found" message="The requested squad profile could not be found." />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 space-y-12">
      
      {/* BACK BUTTON */}
      <Link href="/teams" className="group inline-flex items-center gap-2 text-sm font-medium text-premium-text-secondary hover:text-black transition-colors">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Teams Directory
      </Link>

      {/* TEAM BANNER & HERO CARD */}
      <div className="relative overflow-hidden bg-premium-surface border border-premium-border rounded-[28px] shadow-sm">
        <div className="h-48 sm:h-56 w-full relative bg-premium-surface-soft">
          <img src={team.banner || team.logo} alt={team.teamName || team.name} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-premium-surface via-transparent to-transparent" />
        </div>

        <div className="p-8 sm:p-10 -mt-20 relative z-10 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white border border-premium-border p-2 shadow-premium-soft flex items-center justify-center flex-shrink-0">
              {team.logo ? (
                <img src={team.logo} alt={team.teamName || team.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="font-bold text-4xl text-premium-text">{(team.teamName || team.name)?.charAt(0)}</span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="font-semibold text-xs text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 uppercase tracking-widest">
                  Rank #{team.rank || 1}
                </span>
                {(team.status === 'Approved' || team.verified) && (
                  <Badge variant="green" size="md">
                    <ShieldCheck className="w-4 h-4 mr-1.5 inline" /> Verified
                  </Badge>
                )}
              </div>
              <h1 className="font-bold text-4xl sm:text-5xl text-premium-text tracking-tight">
                {team.teamName || team.name}
              </h1>
              <p className="text-sm font-medium text-premium-text-secondary">Captain: {team.captainName || team.captain?.name || 'N/A'}</p>
            </div>
          </div>

          {/* TEAM QUICK STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-premium-background rounded-[20px] border border-premium-border text-center w-full lg:w-auto shadow-sm">
            <div className="px-3">
              <p className="text-[10px] text-premium-text-secondary font-semibold uppercase tracking-widest mb-1">Matches</p>
              <p className="font-bold text-2xl text-premium-text flex items-center justify-center gap-1.5">
                <Swords className="w-5 h-5 text-premium-text-secondary" /> {team.matchesPlayed || team.matches || 4}
              </p>
            </div>
            <div className="border-l border-premium-border px-3">
              <p className="text-[10px] text-premium-text-secondary font-semibold uppercase tracking-widest mb-1">WWCD</p>
              <p className="font-bold text-2xl text-amber-600 flex items-center justify-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> {team.wwcd || 0}
              </p>
            </div>
            <div className="border-l border-premium-border px-3">
              <p className="text-[10px] text-premium-text-secondary font-semibold uppercase tracking-widest mb-1">Kills</p>
              <p className="font-bold text-2xl text-premium-sage flex items-center justify-center gap-1.5">
                <Flame className="w-5 h-5 text-premium-sage" /> {team.kills || team.killPoints || 0}
              </p>
            </div>
            <div className="border-l border-premium-border px-3">
              <p className="text-[10px] text-premium-text-secondary font-semibold uppercase tracking-widest mb-1">Total Pts</p>
              <p className="font-bold text-2xl text-premium-text">{team.totalPoints !== undefined ? team.totalPoints : team.points || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PLAYER ROSTER SECTION */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-premium-border pb-4">
          <h2 className="font-bold text-3xl text-premium-text tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-premium-text-secondary" /> Official Lineup
          </h2>
          <p className="text-sm text-premium-text-secondary font-medium mt-1">Verified roster competing in the championship.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.players?.map((player, idx) => (
            <PlayerCard key={player.id || player._id || idx} player={player} />
          ))}
        </div>
      </section>

    </div>
  );
}
