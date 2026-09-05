'use client';

import React from 'react';

export default function PlayerCard({ player }) {
  if (!player) return null;

  return (
    <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl p-5 relative group hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-editorial-sm">
      <div className="space-y-2">
        {/* Player Header: IGN & Full Name */}
        <div>
          <h4 className="font-display font-black text-xl text-slate-900 dark:text-white tracking-wide group-hover:text-bgmi-red transition-colors">
            {player.ign}
          </h4>
          <p className="text-xs text-slate-500 font-medium">{player.name}</p>
        </div>

        {/* Role and BGMI ID */}
        <div className="pt-1 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-500/10 text-bgmi-red border border-red-500/20">
            {player.role || 'Assaulter'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono font-medium uppercase">
            ID: {player.bgmiId || '5123987410'}
          </span>
        </div>
      </div>

      {/* Player Stats Footer */}
      {(player.kills !== undefined || player.kdRatio !== undefined) && (
        <div className="mt-4 pt-3 border-t border-[#E7E3DA] dark:border-[#1E2638] grid grid-cols-2 gap-2 text-center bg-[#FAF8F5] dark:bg-[#0B0E14] rounded-xl p-2 font-mono">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">Kills</span>
            <p className="font-display font-bold text-base text-bgmi-red">{player.kills || 0}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">K/D Ratio</span>
            <p className="font-display font-bold text-base text-amber-700 dark:text-bgmi-gold">{player.kdRatio || '0.00'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
