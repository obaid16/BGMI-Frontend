'use client';

import React from 'react';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import Button from '../common/Button';

export default function Step2PlayerDetails({ formData, updateFormData, onNext, onPrev }) {
  const rolesList = ['IGL', 'Assaulter', 'Entry Fragger', 'Sniper', 'Support', 'Substitute'];

  const handlePlayerChange = (index, field, value) => {
    const updated = [...formData.players];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData({ players: updated });
  };

  const addSubstitute = () => {
    if (formData.players.length >= 5) return;
    updateFormData({
      players: [
        ...formData.players,
        {
          name: '',
          ign: '',
          bgmiId: '',
          role: 'Substitute',
          photo: '',
          isSub: true,
        },
      ],
    });
  };

  const removeSubstitute = (index) => {
    const updated = formData.players.filter((_, i) => i !== index);
    updateFormData({ players: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-bgmi-border/60 pb-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-display text-white uppercase flex items-center gap-2">
            <Users className="w-5 h-5 text-bgmi-cyan" /> Step 2: Player Roster & Roles
          </h3>
          <p className="text-xs text-slate-400">Fill in details for 4 main players + 1 optional substitute.</p>
        </div>

        {formData.players.length < 5 && (
          <Button type="button" variant="outline" size="sm" icon={UserPlus} onClick={addSubstitute}>
            Add Substitute (5th Player)
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {formData.players.map((player, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border clip-tactical relative transition-all ${
              idx === 0
                ? 'bg-bgmi-surface/90 border-bgmi-gold/40'
                : 'bg-bgmi-surface/60 border-bgmi-border/60'
            }`}
          >
            <div className="flex items-center justify-between mb-4 border-b border-bgmi-border/40 pb-2">
              <span className="font-display font-black text-sm uppercase tracking-wider text-bgmi-gold">
                {idx < 4 ? `Player 0${idx + 1} (${idx === 0 ? 'Captain / IGL' : 'Starter'})` : 'Player 05 (Substitute)'}
              </span>
              {player.isSub && (
                <button
                  type="button"
                  onClick={() => removeSubstitute(idx)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Sub
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-300">
                  Full Name <span className="text-bgmi-gold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Real Name"
                  value={player.name}
                  onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                  className="w-full px-3 py-2 bg-bgmi-dark border border-bgmi-border rounded-lg text-white text-xs focus:outline-none focus:border-bgmi-gold"
                />
              </div>

              {/* IGN */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-300">
                  In-Game Name (IGN) <span className="text-bgmi-gold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIPER_X"
                  value={player.ign}
                  onChange={(e) => handlePlayerChange(idx, 'ign', e.target.value)}
                  className="w-full px-3 py-2 bg-bgmi-dark border border-bgmi-border rounded-lg text-white text-xs focus:outline-none focus:border-bgmi-gold font-bold text-bgmi-gold"
                />
              </div>

              {/* BGMI ID */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-300">
                  BGMI Character ID <span className="text-bgmi-gold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5123987410"
                  value={player.bgmiId}
                  onChange={(e) => handlePlayerChange(idx, 'bgmiId', e.target.value)}
                  className="w-full px-3 py-2 bg-bgmi-dark border border-bgmi-border rounded-lg text-white text-xs focus:outline-none focus:border-bgmi-gold"
                />
              </div>

              {/* Photo URL */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-300">
                  Photo URL <span className="text-bgmi-gold">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="e.g. Image URL"
                  value={player.photo || ''}
                  onChange={(e) => handlePlayerChange(idx, 'photo', e.target.value)}
                  className="w-full px-3 py-2 bg-bgmi-dark border border-bgmi-border rounded-lg text-white text-xs focus:outline-none focus:border-bgmi-gold"
                />
              </div>

              {/* Player Role */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-300">
                  Player Role <span className="text-bgmi-gold">*</span>
                </label>
                <select
                  value={player.role}
                  onChange={(e) => handlePlayerChange(idx, 'role', e.target.value)}
                  className="w-full px-3 py-2 bg-bgmi-dark border border-bgmi-border rounded-lg text-white text-xs focus:outline-none focus:border-bgmi-gold"
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
        <Button type="button" variant="secondary" size="md" onClick={onPrev}>
          ← Back
        </Button>
        <Button type="submit" variant="primary" size="md">
          Proceed to Student Proofs →
        </Button>
      </div>
    </form>
  );
}
