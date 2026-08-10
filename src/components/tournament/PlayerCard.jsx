'use client';

import React from 'react';
import { ShieldCheck, Crosshair, Target, Award, User } from 'lucide-react';
import Badge from '../common/Badge';

export default function PlayerCard({ player }) {
  if (!player) return null;

  const roleColors = {
    IGL: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    Assaulter: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    'Entry Fragger': 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    Sniper: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    Support: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    Substitute: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  };

  return (
    <div className="bg-bgmi-surface border border-bgmi-border rounded-xl p-5 clip-tactical relative group hover:border-bgmi-gold/50 transition-colors">
      <div className="flex items-start gap-4">
        
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-xl bg-bgmi-dark border border-bgmi-border overflow-hidden flex-shrink-0">
          {player.avatar ? (
            <img src={player.avatar} alt={player.ign} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Player Details */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-display font-black text-base text-white tracking-wide group-hover:text-bgmi-gold transition-colors">
              {player.ign}
            </h4>
            {player.verificationStatus === 'Verified' || player.verified ? (
              <span className="text-[10px] font-black text-emerald-400 flex items-center gap-0.5 flex-shrink-0 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                ✓ COLLEGE VERIFIED
              </span>
            ) : player.verificationStatus === 'Rejected' ? (
              <span className="text-[10px] font-black text-rose-400 flex items-center gap-0.5 flex-shrink-0 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                ✕ REJECTED
              </span>
            ) : (
              <span className="text-[10px] font-black text-amber-400 flex items-center gap-0.5 flex-shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                PENDING
              </span>
            )}
          </div>
          
          <p className="text-xs text-slate-400 font-medium">{player.name}</p>

          <div className="pt-2 flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                roleColors[player.role] || roleColors['Assaulter']
              }`}
            >
              {player.role}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase">
              ID: {player.bgmiId || '5123987410'}
            </span>
          </div>
        </div>

      </div>

      {/* Player Stats Footer */}
      {(player.kills !== undefined || player.kdRatio !== undefined) && (
        <div className="mt-4 pt-3 border-t border-bgmi-border/40 grid grid-cols-2 gap-2 text-center bg-bgmi-dark/40 rounded-lg p-2">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Tournament Kills</span>
            <p className="font-display font-bold text-sm text-bgmi-cyan">{player.kills || 0}</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">K/D Ratio</span>
            <p className="font-display font-bold text-sm text-bgmi-gold">{player.kdRatio || '0.00'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
