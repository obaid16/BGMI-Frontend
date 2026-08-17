'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Flame, ChevronRight, Users } from 'lucide-react';

export default function TeamCard({ team }) {
  if (!team) return null;

  const rankStr = String(team.rank || 1).padStart(2, '0');

  return (
    <Link href={`/teams/${team.shortName || team.registrationId || team.id || team._id}`}>
      <div className="group relative bg-white dark:bg-[#121620] border-2 border-slate-200 dark:border-white/10 hover:border-bgmi-red rounded-xl p-5 clip-tactical shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-full font-sans">
        
        {/* HEADER BADGE */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 mb-4">
          <span className="font-mono font-black text-xs px-2.5 py-0.5 bg-slate-900 text-amber-400 rounded">
            RANK #{rankStr}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED ROSTER
          </span>
        </div>

        {/* TEAM LOGO & IDENTITY BLOCK */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 rounded-lg border border-bgmi-red/50 p-1 flex items-center justify-center text-bgmi-red font-broadcast font-black text-2xl flex-shrink-0 shadow-red-glow">
              {team.logo ? (
                <img src={team.logo} alt={team.teamName || team.name} className="w-full h-full object-cover rounded" />
              ) : (
                <span>{(team.teamName || team.name)?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h3 className="font-broadcast font-black text-xl text-slate-900 dark:text-white uppercase group-hover:text-bgmi-red transition-colors line-clamp-1">
                {team.teamName || team.name}
              </h3>
              <p className="text-xs font-mono text-slate-500 font-bold">
                CAPTAIN: {team.captainName || team.captain?.name || 'LEADER'}
              </p>
            </div>
          </div>

          {/* 4-SLOT ROSTER CHIPS */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest block">
              SQUAD ROSTER (4 STARTERS)
            </span>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
              {(team.players || [1, 2, 3, 4]).slice(0, 4).map((p, idx) => (
                <div key={idx} className="p-1.5 bg-slate-100 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/10 rounded text-center truncate font-bold text-slate-700 dark:text-slate-300">
                  {typeof p === 'object' ? (p.ign || p.name || `P${idx+1}`) : `P${idx+1}`}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METRICS & ACTION FOOTER */}
        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <span>🍗 <strong className="text-amber-500">{team.wwcd || 0}</strong></span>
            <span><Flame className="w-3 h-3 text-sky-400 inline" /> <strong className="text-sky-400">{team.kills || team.killPoints || 0}</strong></span>
            <span>PTS: <strong className="text-slate-900 dark:text-white font-black">{team.totalPoints !== undefined ? team.totalPoints : team.points || 0}</strong></span>
          </div>

          <span className="text-bgmi-red font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
            DETAILS <ChevronRight className="w-4 h-4" />
          </span>
        </div>

      </div>
    </Link>
  );
}
