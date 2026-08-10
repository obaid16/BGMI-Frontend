'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PlayerCard from '@/components/tournament/PlayerCard';
import Badge from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/Skeleton';
import { getTeamById } from '@/services/api';
import { Trophy, Flame, ShieldCheck, Users, Mail, Phone, ArrowLeft, Swords } from 'lucide-react';
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
      <Link href="/teams" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Teams List
      </Link>

      {/* TEAM BANNER & HERO CARD */}
      <div className="relative overflow-hidden bg-bgmi-surface border border-bgmi-border rounded-2xl clip-tactical shadow-2xl">
        <div className="h-48 w-full relative">
          <img src={team.banner} alt={team.name} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-bgmi-surface via-bgmi-surface/60 to-transparent"></div>
        </div>

        <div className="p-6 sm:p-8 -mt-20 relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-bgmi-dark border-2 border-bgmi-gold p-2 shadow-gold-glow flex items-center justify-center flex-shrink-0">
              <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-xl" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="font-display font-black text-2xl text-bgmi-gold">#{team.rank} RANK</span>
                {team.verified && (
                  <Badge variant="green" size="sm">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> College Verified
                  </Badge>
                )}
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                {team.name}
              </h1>
              <p className="text-sm font-semibold text-slate-400">Captain: {team.captain?.name || 'N/A'}</p>
            </div>
          </div>

          {/* TEAM QUICK STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-bgmi-dark/80 rounded-xl border border-bgmi-border text-center w-full md:w-auto">
            <div className="px-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Matches</p>
              <p className="font-display font-black text-xl text-white flex items-center justify-center gap-1">
                <Swords className="w-4 h-4 text-bgmi-gold" /> {team.matchesPlayed || 0}
              </p>
            </div>
            <div className="border-l border-bgmi-border/60 px-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">WWCD</p>
              <p className="font-display font-black text-xl text-bgmi-gold flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4" /> {team.wwcd || 0}
              </p>
            </div>
            <div className="border-l border-bgmi-border/60 px-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Kills</p>
              <p className="font-display font-black text-xl text-bgmi-cyan flex items-center justify-center gap-1">
                <Flame className="w-4 h-4" /> {team.kills || 0}
              </p>
            </div>
            <div className="border-l border-bgmi-border/60 px-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Pts</p>
              <p className="font-display font-black text-xl text-white">{team.points || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PLAYER ROSTER SECTION */}
      <section className="space-y-6">
        <div className="border-b border-bgmi-border/60 pb-4">
          <h2 className="font-display font-black text-2xl text-white uppercase tracking-wide flex items-center gap-2">
            <Users className="w-6 h-6 text-bgmi-gold" /> Official Player Roster
          </h2>
          <p className="text-xs text-slate-400">Verified roster competing in the championship.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.players?.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </section>

    </div>
  );
}
