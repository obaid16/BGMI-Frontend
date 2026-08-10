'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, Trophy, Flame } from 'lucide-react';
import Badge from '../common/Badge';

export default function TeamCard({ team }) {
  if (!team) return null;

  return (
    <Link href={`/teams/${team.id}`}>
      <div className="group relative bg-bgmi-surface hover:bg-bgmi-card border border-bgmi-border hover:border-bgmi-gold/60 rounded-xl p-5 transition-all duration-300 transform hover:-translate-y-1 clip-tactical shadow-lg">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-lg text-bgmi-gold">#{team.rank || 1}</span>
            {team.verified ? (
              <Badge variant="green" size="sm">
                <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified
              </Badge>
            ) : (
              <Badge variant="pending" size="sm">
                Pending
              </Badge>
            )}
          </div>
          <span className="text-xs font-bold text-slate-400 bg-bgmi-dark/80 px-2 py-1 rounded border border-bgmi-border">
            {team.shortName}
          </span>
        </div>

        {/* Team Identity */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-bgmi-dark rounded-xl border border-bgmi-border/80 overflow-hidden flex items-center justify-center p-2 group-hover:border-bgmi-gold transition-colors">
            {team.logo ? (
              <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="font-black text-xl text-bgmi-gold">{team.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white group-hover:text-bgmi-gold transition-colors line-clamp-1">
              {team.name}
            </h3>
            <p className="text-xs font-medium text-slate-400">Captain: {team.captain?.name || 'N/A'}</p>
          </div>
        </div>

        {/* Team Performance Mini Stats */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-bgmi-dark/70 rounded-lg border border-bgmi-border/40 text-center">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">WWCD</p>
            <p className="font-display font-bold text-sm text-bgmi-gold flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" /> {team.wwcd || 0}
            </p>
          </div>
          <div className="border-x border-bgmi-border/40">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Kills</p>
            <p className="font-display font-bold text-sm text-bgmi-cyan flex items-center justify-center gap-1">
              <Flame className="w-3 h-3" /> {team.kills || 0}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Points</p>
            <p className="font-display font-bold text-sm text-white">{team.points || 0}</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-4 pt-3 border-t border-bgmi-border/40 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" /> {team.players?.length || 4} Squad Members
          </span>
          <span className="text-bgmi-gold group-hover:translate-x-1 transition-transform font-semibold">
            View Roster →
          </span>
        </div>
      </div>
    </Link>
  );
}
