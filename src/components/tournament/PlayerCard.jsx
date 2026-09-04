'use client';

import React from 'react';

export default function PlayerCard({ player }) {
  if (!player) return null;

  return (
    <div className="bg-white dark:bg-[#121620] border-2 border-slate-200 dark:border-white/10 rounded-xl p-5 clip-tactical relative group hover:border-bgmi-red transition-all shadow-md">
      <div className="space-y-2">
        {/* Player Header: IGN & Full Name */}
        <div>
          <h4 className="font-display font-black text-xl text-slate-900 dark:text-white tracking-wide group-hover:text-bgmi-red transition-colors">
            {player.ign}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{player.name}</p>
        </div>

        {/* Role and BGMI ID */}
        <div className="pt-1 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-bgmi-red/10 text-bgmi-red border-bgmi-red/30">
            {player.role || 'Assaulter'}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold uppercase">
            ID: {player.bgmiId || '5123987410'}
          </span>
        </div>
      </div>

      {/* Player Stats Footer */}
      {(player.kills !== undefined || player.kdRatio !== undefined) && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 gap-2 text-center bg-slate-50 dark:bg-[#0B0E14] rounded-lg p-2 font-mono">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Tournament Kills</span>
            <p className="font-display font-bold text-base text-bgmi-red">{player.kills || 0}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">K/D Ratio</span>
            <p className="font-display font-bold text-base text-amber-600 dark:text-bgmi-gold">{player.kdRatio || '0.00'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
