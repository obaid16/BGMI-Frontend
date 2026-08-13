'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, Flame, ChevronRight } from 'lucide-react';
import Badge from '../common/Badge';

export default function TeamCard({ team }) {
  if (!team) return null;

  return (
    <Link href={`/teams/${team.id || team._id}`}>
      <div className="group relative bg-white dark:bg-bgmi-surface/95 border border-slate-200 dark:border-bgmi-border hover:border-bgmi-red rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 clip-tactical shadow-md dark:shadow-xl flex flex-col justify-between h-full">
        
        {/* TOP TRADING CARD BANNER HEADER */}
        <div className="h-24 w-full bg-gradient-to-r from-bgmi-red/20 via-slate-100 to-white dark:from-bgmi-red/30 dark:via-bgmi-dark dark:to-bgmi-surface relative overflow-hidden">
          <div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" />
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <span className="font-display font-black text-xs text-amber-600 dark:text-bgmi-gold bg-white/90 dark:bg-bgmi-dark/90 px-2.5 py-0.5 rounded-full border border-amber-500/40 dark:border-bgmi-gold/40 shadow-sm">
              RANK #{team.rank || 1}
            </span>
          </div>
        </div>

        {/* OVERLAPPING EMBLEM & SQUAD IDENTITY */}
        <div className="px-5 -mt-10 relative z-10 space-y-4">
          <div className="flex items-end justify-between">
            <div className="w-16 h-16 bg-slate-100 dark:bg-bgmi-dark rounded-2xl border-2 border-bgmi-red p-1 flex items-center justify-center shadow-red-glow flex-shrink-0">
              {team.logo ? (
                <img src={team.logo} alt={team.teamName || team.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="font-display font-black text-2xl text-bgmi-red">{(team.teamName || team.name)?.charAt(0)}</span>
              )}
            </div>

            {team.status === 'Approved' || team.verified ? (
              <Badge variant="green" size="sm">
                <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified Roster
              </Badge>
            ) : (
              <Badge variant="pending" size="sm">
                {team.status || 'Pending'}
              </Badge>
            )}
          </div>

          <div>
            <h3 className="font-display font-black text-lg text-slate-900 dark:text-white group-hover:text-bgmi-red transition-colors line-clamp-1">
              {team.teamName || team.name}
            </h3>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Captain: {team.captainName || team.captain?.name || 'N/A'}</p>
          </div>

          {/* HORIZONTAL ROSTER AVATARS STACK */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">ROSTER SLOTS (4/4)</span>
            <div className="flex items-center gap-1.5">
              {(team.players || [1, 2, 3, 4]).slice(0, 4).map((p, idx) => (
                <div key={idx} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-bgmi-dark border border-slate-200 dark:border-bgmi-border flex items-center justify-center text-[10px] font-black text-slate-700 dark:text-slate-300">
                  {typeof p === 'object' ? (p.ign ? p.ign.substring(0, 2).toUpperCase() : `P${idx+1}`) : `P${idx+1}`}
                </div>
              ))}
            </div>
          </div>

          {/* TACTICAL METRICS BAR */}
          <div className="grid grid-cols-3 gap-1.5 p-3 bg-slate-100 dark:bg-bgmi-dark/90 rounded-xl border border-slate-200 dark:border-bgmi-border/60 text-center text-xs">
            <div>
              <p className="text-[9px] text-slate-500 font-extrabold uppercase">WWCD</p>
              <p className="font-display font-black text-amber-600 dark:text-bgmi-gold">
                🍗 {team.wwcd || 0}
              </p>
            </div>
            <div className="border-x border-slate-200 dark:border-bgmi-border/40">
              <p className="text-[9px] text-slate-500 font-extrabold uppercase">Kills</p>
              <p className="font-display font-black text-sky-600 dark:text-bgmi-cyan">
                <Flame className="w-3 h-3 text-sky-600 dark:text-bgmi-cyan inline" /> {team.kills || team.killPoints || 0}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500 font-extrabold uppercase">Points</p>
              <p className="font-display font-black text-slate-900 dark:text-white">{team.totalPoints !== undefined ? team.totalPoints : team.points || 0}</p>
            </div>
          </div>
        </div>

        {/* BOTTOM CARD FOOTER */}
        <div className="p-4 mt-3 border-t border-slate-200 dark:border-bgmi-border/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
            <Users className="w-3.5 h-3.5 text-bgmi-red" /> View Full Roster
          </span>
          <span className="text-bgmi-red group-hover:translate-x-1 transition-transform font-black flex items-center gap-0.5">
            PROFILES <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    </Link>
  );
}
