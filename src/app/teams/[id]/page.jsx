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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SkeletonCard />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState title="Team Not Found" message="The requested squad profile could not be found." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* BACK BUTTON */}
      <Link href="/teams" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-bgmi-red transition-colors">
        <ArrowLeft className="w-4 h-4 text-bgmi-red" /> Back to Teams Roster
      </Link>

      {/* TEAM BANNER & HERO CARD */}
      <div className="relative overflow-hidden bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-white border border-bgmi-border dark:border-bgmi-border light:border-slate-200 rounded-2xl clip-tactical shadow-2xl">
        <div className="h-48 w-full relative">
          <img src={team.banner || team.logo} alt={team.teamName || team.name} className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-bgmi-surface dark:from-bgmi-surface light:from-white via-transparent to-transparent" />
        </div>

        <div className="p-6 sm:p-8 -mt-20 relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-bgmi-dark dark:bg-bgmi-dark light:bg-slate-100 border-2 border-bgmi-red p-2 shadow-red-glow flex items-center justify-center flex-shrink-0">
              {team.logo ? (
                <img src={team.logo} alt={team.teamName || team.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="font-display font-black text-3xl text-bgmi-red">{(team.teamName || team.name)?.charAt(0)}</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="font-display font-black text-sm text-bgmi-gold dark:text-bgmi-gold light:text-amber-600 bg-bgmi-gold/10 px-2.5 py-0.5 rounded border border-bgmi-gold/30">
                  RANK #{team.rank || 1}
                </span>
                {(team.status === 'Approved' || team.verified) && (
                  <Badge variant="green" size="sm">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> Verified
                  </Badge>
                )}
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white dark:text-white light:text-slate-900 uppercase tracking-tight">
                {team.teamName || team.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-400 light:text-slate-600">Captain: {team.captainName || team.captain?.name || 'N/A'}</p>
            </div>
          </div>

          {/* TEAM QUICK STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-bgmi-dark/90 dark:bg-bgmi-dark/90 light:bg-slate-100 rounded-xl border border-bgmi-border dark:border-bgmi-border light:border-slate-200 text-center w-full md:w-auto">
            <div className="px-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold uppercase">Matches</p>
              <p className="font-display font-black text-xl text-white dark:text-white light:text-slate-900 flex items-center justify-center gap-1">
                <Swords className="w-4 h-4 text-bgmi-red" /> {team.matchesPlayed || team.matches || 4}
              </p>
            </div>
            <div className="border-l border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 px-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold uppercase">WWCD</p>
              <p className="font-display font-black text-xl text-bgmi-gold dark:text-bgmi-gold light:text-amber-600 flex items-center justify-center gap-1">
                🍗 {team.wwcd || 0}
              </p>
            </div>
            <div className="border-l border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 px-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold uppercase">Kills</p>
              <p className="font-display font-black text-xl text-bgmi-cyan dark:text-bgmi-cyan light:text-sky-600 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-bgmi-cyan dark:text-bgmi-cyan light:text-sky-600" /> {team.kills || team.killPoints || 0}
              </p>
            </div>
            <div className="border-l border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 px-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold uppercase">Total Pts</p>
              <p className="font-display font-black text-xl text-white dark:text-white light:text-slate-900">{team.totalPoints !== undefined ? team.totalPoints : team.points || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PLAYER ROSTER SECTION */}
      <section className="space-y-6">
        <div className="border-b border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 pb-4">
          <h2 className="font-display font-black text-2xl text-white dark:text-white light:text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Users className="w-6 h-6 text-bgmi-red" /> Official Player Roster
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium">Verified roster competing in the championship.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.players?.map((player, idx) => (
            <PlayerCard key={player.id || player._id || idx} player={player} />
          ))}
        </div>
      </section>

    </div>
  );
}
