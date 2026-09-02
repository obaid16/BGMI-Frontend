'use client';

import React from 'react';
import { ShieldCheck, Crosshair, Target, Award, User } from 'lucide-react';
import Badge from '../common/Badge';

export default function PlayerCard({ player }) {
  if (!player) return null;

  return (
    <div className="bg-white dark:bg-[#121620] border-2 border-slate-200 dark:border-white/10 rounded-xl p-5 clip-tactical relative group hover:border-bgmi-red transition-all shadow-md">
      <div className="flex items-start gap-4">
        
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-xl bg-slate-900 border border-bgmi-red/50 overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-broadcast font-black text-2xl">
          {player.avatar ? (
            <img src={player.avatar} alt={player.ign} className="w-full h-full object-cover" />
          ) : (
            <span>{(player.ign || player.name || 'P')?.charAt(0).toUpperCase()}</span>
          )}
        </div>

        {/* Player Details */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-display font-black text-base text-slate-900 dark:text-white tracking-wide group-hover:text-bgmi-red transition-colors">
              {player.ign}
            </h4>
            {player.verificationStatus === 'Verified' || player.verified ? (
              <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 flex items-center gap-0.5 flex-shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                ✓ COLLEGE VERIFIED
              </span>
            ) : player.verificationStatus === 'Rejected' ? (
              <span className="text-[10px] font-black text-bgmi-red flex items-center gap-0.5 flex-shrink-0 bg-bgmi-red/10 px-1.5 py-0.5 rounded border border-bgmi-red/20">
                ✕ REJECTED
              </span>
            ) : (
              <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 flex items-center gap-0.5 flex-shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                PENDING
              </span>
            )}
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{player.name}</p>

          <div className="pt-2 flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-bgmi-red/10 text-bgmi-red border-bgmi-red/30">
              {player.role || 'Assaulter'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold uppercase">
              ID: {player.bgmiId || '5123987410'}
            </span>
          </div>
        </div>

      </div>

      {/* Player Stats Footer */}
      {(player.kills !== undefined || player.kdRatio !== undefined) && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2 text-center bg-slate-50 dark:bg-[#0B0E14] rounded-lg p-2 font-mono">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Tournament Kills</span>
            <p className="font-display font-bold text-sm text-bgmi-red">{player.kills || 0}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">K/D Ratio</span>
            <p className="font-display font-bold text-sm text-amber-600 dark:text-bgmi-gold">{player.kdRatio || '0.00'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
