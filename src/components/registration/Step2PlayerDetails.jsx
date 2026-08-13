'use client';

import React from 'react';
import { Users } from 'lucide-react';
import Button from '../common/Button';

export default function Step2PlayerDetails({ formData, updateFormData, onNext, onPrev }) {
  const rolesList = ['IGL', 'Assaulter', 'Entry Fragger', 'Support'];

  const handlePlayerChange = (index, field, value) => {
    const updated = [...formData.players];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData({ players: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase flex items-center gap-2">
          <Users className="w-5 h-5 text-bgmi-red" /> Step 2: Player Roster & Roles
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Fill in player details for your 4 main squad members.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {formData.players.slice(0, 4).map((player, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border clip-tactical space-y-4 transition-all ${
              idx === 0
                ? 'bg-slate-50 border-bgmi-red/50 dark:bg-bgmi-surface/90 dark:border-bgmi-red/50 shadow-md dark:shadow-red-glow/20'
                : 'bg-white border-slate-200 dark:bg-bgmi-surface/70 dark:border-bgmi-border/80 shadow-sm'
            }`}
          >
            <div className="border-b border-slate-200 dark:border-bgmi-border/40 pb-2">
              <span className="font-display font-black text-xs uppercase tracking-wider text-bgmi-red">
                Player 0{idx + 1} {idx === 0 ? '(Captain / IGL)' : '(Starter)'}
              </span>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Name <span className="text-bgmi-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Player Full Name"
                  value={player.name}
                  onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-bgmi-red transition-colors"
                />
              </div>

              {/* Player Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Player Role <span className="text-bgmi-red">*</span>
                </label>
                <select
                  value={player.role}
                  onChange={(e) => handlePlayerChange(idx, 'role', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-bgmi-dark border border-slate-300 dark:border-bgmi-border rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-bgmi-red transition-colors cursor-pointer"
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
