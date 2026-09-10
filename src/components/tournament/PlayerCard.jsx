'use client';

import React from 'react';
import { ShieldCheck, Crosshair, Target, Award, User } from 'lucide-react';
import Badge from '../common/Badge';

export default function PlayerCard({ player }) {
  if (!player) return null;

  const roleColors = {
    IGL: 'bg-amber-50 text-amber-700 border-amber-200',
    Assaulter: 'bg-rose-50 text-rose-700 border-rose-200',
    'Entry Fragger': 'bg-orange-50 text-orange-700 border-orange-200',
    Sniper: 'bg-sky-50 text-sky-700 border-sky-200',
    Support: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Substitute: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="bg-premium-surface border border-premium-border rounded-[20px] p-6 relative group hover:border-premium-text hover:shadow-premium-float transition-all duration-300">
      <div className="flex items-start gap-5">
        
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-2xl bg-premium-background border border-premium-border overflow-hidden flex-shrink-0 shadow-sm">
          {player.avatar ? (
            <img src={player.avatar} alt={player.ign} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-premium-text-secondary">
              <User className="w-7 h-7" />
            </div>
          )}
        </div>

        {/* Player Details */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-lg text-premium-text group-hover:text-black transition-colors leading-tight">
              {player.ign}
            </h4>
            {player.verificationStatus === 'Verified' || player.verified ? (
              <span className="text-[9px] font-bold text-emerald-600 uppercase flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                ✓ Verified
              </span>
            ) : player.verificationStatus === 'Rejected' ? (
              <span className="text-[9px] font-bold text-rose-600 uppercase flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                ✕ Rejected
              </span>
            ) : (
              <span className="text-[9px] font-bold text-amber-600 uppercase flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                Pending
              </span>
            )}
          </div>
          
          <p className="text-xs text-premium-text-secondary font-medium">{player.name}</p>

          <div className="pt-2 flex items-center gap-2">
            <span
              className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${
                roleColors[player.role] || roleColors['Assaulter']
              }`}
            >
              {player.role}
            </span>
            <span className="text-[9px] text-premium-text-secondary font-semibold uppercase tracking-widest">
              ID: {player.bgmiId || '5123987410'}
            </span>
          </div>
        </div>

      </div>

      {/* Player Stats Footer */}
      {(player.kills !== undefined || player.kdRatio !== undefined) && (
        <div className="mt-5 pt-4 border-t border-premium-border grid grid-cols-2 gap-3 text-center">
          <div className="bg-premium-background rounded-xl p-2.5 border border-premium-border">
            <span className="text-[9px] text-premium-text-secondary font-semibold uppercase tracking-widest block mb-1">Tourney Kills</span>
            <p className="font-bold text-base text-premium-sage">{player.kills || 0}</p>
          </div>
          <div className="bg-premium-background rounded-xl p-2.5 border border-premium-border">
            <span className="text-[9px] text-premium-text-secondary font-semibold uppercase tracking-widest block mb-1">K/D Ratio</span>
            <p className="font-bold text-base text-amber-600">{player.kdRatio || '0.00'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
