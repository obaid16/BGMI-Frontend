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
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SkeletonCard />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState title="Team Not Found" message="The requested squad profile could not be found." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-sans">
      
      {/* BACK BUTTON */}
      <Link href="/teams" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 text-bgmi-red" /> Back to Teams Roster
      </Link>

      {/* TEAM BANNER & HERO CARD */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl shadow-editorial-lg border border-[#E7E3DA] dark:border-[#1E2638]">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={team.logo || team.banner || '/images/bgmi-hero-bg.jpg'}
            alt={team.teamName || team.name}
            className="w-full h-full object-cover object-center scale-105 filter blur-[1px] brightness-50 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/80 to-[#0B0E14]/50" />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 min-h-[220px]">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
              <span className="font-mono font-black text-xs text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 backdrop-blur-sm">
                RANK #{team.rank || 1}
              </span>
              {(team.status === 'Approved' || team.verified) && (
                <Badge variant="green" size="sm">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> Verified
                </Badge>
              )}
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
              {team.teamName || team.name}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-slate-300 flex items-center justify-center md:justify-start gap-2">
              <span className="font-mono text-slate-400">Captain:</span>
              <span className="text-white font-bold">{team.captainName || team.captain?.name || 'N/A'}</span>
            </p>
          </div>

          {/* TEAM QUICK STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#0B0E14]/80 backdrop-blur-md rounded-2xl border border-white/10 text-center w-full md:w-auto shadow-editorial">
            <div className="px-2">
              <p className="text-[10px] text-slate-400 font-mono uppercase font-medium">Matches</p>
              <p className="font-display font-black text-xl text-white flex items-center justify-center gap-1">
                <Swords className="w-4 h-4 text-bgmi-red" /> {team.matchesPlayed || team.matches || 4}
              </p>
            </div>
            <div className="border-l border-white/10 px-2">
              <p className="text-[10px] text-slate-400 font-mono uppercase font-medium">WWCD</p>
              <p className="font-display font-black text-xl text-amber-400 flex items-center justify-center gap-1">
                🍗 {team.wwcd || 0}
              </p>
            </div>
            <div className="border-l border-white/10 px-2">
              <p className="text-[10px] text-slate-400 font-mono uppercase font-medium">Kills</p>
              <p className="font-display font-black text-xl text-red-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-red-400" /> {team.kills || team.killPoints || 0}
              </p>
            </div>
            <div className="border-l border-white/10 px-2">
              <p className="text-[10px] text-slate-400 font-mono uppercase font-medium">Total Pts</p>
              <p className="font-display font-black text-xl text-white">{team.totalPoints !== undefined ? team.totalPoints : team.points || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PLAYER ROSTER SECTION */}
      <section className="space-y-6">
        <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-4">
          <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <Users className="w-6 h-6 text-bgmi-red" /> Official Player Roster
          </h2>
          <p className="text-xs text-slate-500 font-medium">Verified roster members competing in Championship 2026.</p>
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
