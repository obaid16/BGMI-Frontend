'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Flame, ChevronRight, Trophy } from 'lucide-react';

export default function TeamCard({ team }) {
  if (!team) return null;

  const rankStr = String(team.rank || 1).padStart(2, '0');
  const teamLogo = team.logo || team.logoUrl;

  return (
    <Link href={`/teams/${team.shortName || team.registrationId || team.id || team._id}`}>
      <div className="group relative bg-premium-surface border border-premium-border hover:border-premium-text rounded-[24px] p-6 shadow-sm hover:shadow-premium-float transition-all duration-300 flex flex-col justify-between h-full">
        
        {/* HEADER BADGE */}
        <div className="flex items-center justify-between border-b border-premium-border pb-4 mb-5">
          <span className="font-semibold text-[10px] px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md uppercase tracking-widest border border-amber-100">
            Rank #{rankStr}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        </div>

        {/* TEAM LOGO & IDENTITY BLOCK */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-premium-surface-soft rounded-2xl border border-premium-border p-1 flex items-center justify-center text-premium-text font-bold text-2xl flex-shrink-0 shadow-sm overflow-hidden">
              {teamLogo ? (
                <img src={teamLogo} alt={team.teamName || team.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span>{(team.teamName || team.name)?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-xl text-premium-text group-hover:text-black transition-colors line-clamp-1 leading-tight">
                {team.teamName || team.name}
              </h3>
              <p className="text-xs font-medium text-premium-text-secondary mt-1">
                Captain: {team.captainName || team.captain?.name || 'Leader'}
              </p>
            </div>
          </div>

          {/* 4-SLOT ROSTER CHIPS */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-semibold text-premium-text-secondary uppercase tracking-widest block">
              Starting Lineup
            </span>
            <div className="grid grid-cols-4 gap-2 text-[10px] font-medium">
              {(team.players || [1, 2, 3, 4]).slice(0, 4).map((p, idx) => (
                <div key={idx} className="px-1.5 py-2 bg-premium-background border border-premium-border rounded-lg text-center truncate text-premium-text">
                  {typeof p === 'object' ? (p.ign || p.name || `P${idx+1}`) : `P${idx+1}`}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METRICS & ACTION FOOTER */}
        <div className="pt-5 mt-5 border-t border-premium-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-medium text-premium-text-secondary inline-flex items-center">
              <Trophy className="w-3.5 h-3.5 text-amber-500 mr-1" />
              <strong className="text-amber-600">{team.wwcd || 0}</strong>
            </span>
            <span className="font-medium text-premium-text-secondary inline-flex items-center">
              <Flame className="w-3.5 h-3.5 text-premium-sage mr-0.5" />
              <strong className="text-premium-sage">{team.kills || team.killPoints || 0}</strong>
            </span>
            <span className="font-semibold text-premium-text-secondary uppercase tracking-widest text-[10px] ml-1">
              Pts: <strong className="text-premium-text text-sm ml-0.5">{team.totalPoints !== undefined ? team.totalPoints : team.points || 0}</strong>
            </span>
          </div>

          <span className="text-premium-text font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[10px] uppercase tracking-widest">
            Profile <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    </Link>
  );
}
