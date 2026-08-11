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
      <div className="border-b border-bgmi-border/60 pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-white uppercase flex items-center gap-2">
          <Users className="w-5 h-5 text-bgmi-cyan" /> Step 2: Player Roster & Roles
        </h3>
        <p className="text-xs text-slate-400">Fill in details for the 4 main squad players.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {formData.players.slice(0, 4).map((player, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border clip-tactical space-y-4 transition-all ${
              idx === 0
                ? 'bg-bgmi-surface/90 border-bgmi-gold/40 shadow-gold-glow/20'
                : 'bg-bgmi-surface/60 border-bgmi-border/60'
            }`}
          >
            <div className="border-b border-bgmi-border/40 pb-2">
              <span className="font-display font-black text-sm uppercase tracking-wider text-bgmi-gold">
                Player 0{idx + 1} {idx === 0 ? '(Captain / IGL)' : '(Starter)'}
              </span>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Full Name <span className="text-bgmi-gold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Player Full Name"
                  value={player.name}
                  onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                  className="w-full px-4 py-2.5 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-xs focus:outline-none focus:border-bgmi-gold transition-colors"
                />
              </div>

              {/* Player Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Player Role <span className="text-bgmi-gold">*</span>
                </label>
                <select
                  value={player.role}
                  onChange={(e) => handlePlayerChange(idx, 'role', e.target.value)}
                  className="w-full px-4 py-2.5 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-xs focus:outline-none focus:border-bgmi-gold transition-colors cursor-pointer"
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

      <div className="pt-6 border-t border-bgmi-border/60 flex items-center justify-between">
        <Button type="button" variant="outline" size="md" onClick={onPrev}>
          ← Back to Team Details
        </Button>
        <Button type="submit" variant="primary" size="md">
          Proceed to Review →
        </Button>
      </div>
    </form>
  );
}
