'use client';

import React from 'react';
import { Users, UserCheck, ShieldAlert } from 'lucide-react';
import Button from '../common/Button';

export default function Step2PlayerDetails({ formData, updateFormData, onNext, onPrev }) {
  const rolesList = ['IGL', 'Assaulter', 'Entry Fragger', 'Support', 'Substitute'];

  const handlePlayerChange = (index, field, value) => {
    const updated = [...(formData.players || [])];
    
    // Ensure array has enough elements
    while (updated.length <= index) {
      updated.push({
        name: '',
        ign: '',
        bgmiId: '',
        substituteId: '',
        role: index === 4 ? 'Substitute' : 'Support',
        isSub: index === 4,
        verificationStatus: 'Pending Verification'
      });
    }

    updated[index] = { ...updated[index], [field]: value };
    updateFormData({ players: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const starters = (formData.players || []).slice(0, 4);
  const subPlayer = (formData.players || [])[4] || { name: '', ign: '', bgmiId: '', substituteId: '', role: 'Substitute', isSub: true };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-4">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase flex items-center gap-2">
          <Users className="w-5 h-5 text-bgmi-red" /> Step 2: Player Roster, IGN & BGMI Player IDs
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Enter Full Name, In-Game Name (IGN), BGMI Player ID, and Substitute ID for your 4 starters and 5th substitute player.
        </p>
      </div>

      {/* 4 MAIN STARTERS */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-bgmi-red flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-bgmi-red" /> 4 Main Starting Roster Members (Required)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {starters.map((player, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-xl border clip-tactical space-y-4 transition-all ${
                idx === 0
                  ? 'bg-slate-50 border-bgmi-red/50 dark:bg-bgmi-surface/90 dark:border-bgmi-red/50 shadow-md dark:shadow-red-glow/20'
                  : 'bg-white border-slate-200 dark:bg-bgmi-surface/70 dark:border-bgmi-border/80 shadow-sm'
              }`}
            >
              <div className="border-b border-slate-200 dark:border-bgmi-border/40 pb-2 flex items-center justify-between">
                <span className="font-display font-black text-xs uppercase tracking-wider text-bgmi-red">
                  Player 0{idx + 1} {idx === 0 ? '(Captain / IGL)' : '(Starter)'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Starter</span>
              </div>

              <div className="space-y-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-bgmi-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={player.name || ''}
                    onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-bgmi-red transition-colors"
                  />
                </div>

                {/* In-Game Name (IGN) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    In-Game Name (IGN) <span className="text-bgmi-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JONATHAN_Gaming"
                    value={player.ign || ''}
                    onChange={(e) => handlePlayerChange(idx, 'ign', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-bgmi-red transition-colors"
                  />
                </div>

                {/* BGMI Player ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    BGMI Player ID (Character ID) <span className="text-bgmi-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5123456789"
                    value={player.bgmiId || ''}
                    onChange={(e) => handlePlayerChange(idx, 'bgmiId', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-bgmi-red transition-colors"
                  />
                </div>

                {/* Substitute Player ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Substitute Player ID (Backup Character ID)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5987654321"
                    value={player.substituteId || ''}
                    onChange={(e) => handlePlayerChange(idx, 'substituteId', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-bgmi-red transition-colors"
                  />
                </div>

                {/* Player Role */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Player Role <span className="text-bgmi-red">*</span>
                  </label>
                  <select
                    value={player.role || (idx === 0 ? 'IGL' : 'Assaulter')}
                    onChange={(e) => handlePlayerChange(idx, 'role', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-bgmi-red transition-colors cursor-pointer"
                  >
                    {rolesList.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBSTITUTE PLAYER SECTION */}
      <div className="pt-4 border-t border-slate-200 dark:border-bgmi-border/60 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-bgmi-gold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" /> Dedicated 5th Substitute Player Details (Optional)
          </h4>
          <span className="text-[10px] font-mono text-slate-500 uppercase bg-slate-100 dark:bg-bgmi-dark px-2 py-0.5 rounded border border-slate-200 dark:border-bgmi-border">
            Substitute Roster
          </span>
        </div>

        <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-bgmi-surface/80 clip-tactical space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Substitute Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Substitute Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Substitute Name"
                value={subPlayer.name || ''}
                onChange={(e) => handlePlayerChange(4, 'name', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Substitute In-Game Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Substitute In-Game Name (IGN)
              </label>
              <input
                type="text"
                placeholder="e.g. Sub_Mortal"
                value={subPlayer.ign || ''}
                onChange={(e) => handlePlayerChange(4, 'ign', e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Substitute Player ID */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Substitute BGMI Player ID
              </label>
              <input
                type="text"
                placeholder="e.g. 5987654321"
                value={subPlayer.bgmiId || subPlayer.substituteId || ''}
                onChange={(e) => {
                  handlePlayerChange(4, 'bgmiId', e.target.value);
                  handlePlayerChange(4, 'substituteId', e.target.value);
                }}
                className="w-full px-3.5 py-2 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-bgmi-border/60 flex items-center justify-between">
        <Button type="button" variant="outline" size="md" onClick={onPrev}>
          ← Back to Squad Info
        </Button>
        <Button type="submit" variant="primary" size="md">
          Proceed to Review →
        </Button>
      </div>
    </form>
  );
}
