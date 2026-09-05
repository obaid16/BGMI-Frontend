'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Flame, ChevronRight } from 'lucide-react';

export default function TeamCard({ team }) {
  if (!team) return null;

  const rankStr = String(team.rank || 1).padStart(2, '0');

  return (
    <Link href={`/teams/${team.shortName || team.registrationId || team.id || team._id}`}>
      <div className="group relative bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] hover:border-slate-400 dark:hover:border-slate-600 rounded-3xl p-5 sm:p-6 shadow-editorial-sm hover:shadow-editorial hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-full font-sans">
        
        {/* HEADER BADGE */}
        <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-3 mb-4">
          <span className="font-mono font-black text-xs px-2.5 py-0.5 bg-[#FAF8F5] dark:bg-[#0B0E14] text-slate-900 dark:text-amber-400 rounded-lg border border-[#E7E3DA] dark:border-[#1E2638]">
            RANK #{rankStr}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED ROSTER
          </span>
        </div>

        {/* TEAM LOGO & IDENTITY BLOCK */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#FAF8F5] dark:bg-[#0B0E14] rounded-2xl border border-[#E7E3DA] dark:border-[#1E2638] p-1 flex items-center justify-center text-bgmi-red font-display font-black text-2xl shrink-0 shadow-editorial-sm">
              {team.logo ? (
                <img src={team.logo} alt={team.teamName || team.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span>{(team.teamName || team.name)?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white uppercase group-hover:text-bgmi-red transition-colors line-clamp-1">
                {team.teamName || team.name}
              </h3>
              <p className="text-xs font-mono text-slate-500 font-medium">
                CAPTAIN: {team.captainName || team.captain?.name || 'LEADER'}
              </p>
            </div>
          </div>

          {/* 4-SLOT ROSTER CHIPS */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              SQUAD ROSTER (4 STARTERS)
            </span>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
              {(team.players || [1, 2, 3, 4]).slice(0, 4).map((p, idx) => (
                <div key={idx} className="p-1.5 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-center truncate font-bold text-slate-700 dark:text-slate-300">
                  {typeof p === 'object' ? (p.ign || p.name || `P${idx+1}`) : `P${idx+1}`}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* METRICS & ACTION FOOTER */}
        <div className="pt-4 mt-4 border-t border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <span>🍗 <strong className="text-amber-600 dark:text-amber-400">{team.wwcd || 0}</strong></span>
            <span><Flame className="w-3.5 h-3.5 text-bgmi-red inline" /> <strong className="text-bgmi-red">{team.kills || team.killPoints || 0}</strong></span>
            <span>PTS: <strong className="text-slate-900 dark:text-white font-black">{team.totalPoints !== undefined ? team.totalPoints : team.points || 0}</strong></span>
          </div>

          <span className="text-slate-900 dark:text-white font-bold flex items-center gap-0.5 group-hover:text-bgmi-red group-hover:translate-x-0.5 transition-all text-xs font-display">
            VIEW <ChevronRight className="w-4 h-4" />
          </span>
        </div>

      </div>
    </Link>
  );
}
