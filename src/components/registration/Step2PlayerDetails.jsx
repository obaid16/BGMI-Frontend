'use client';

import React from 'react';
import { Users, UserCheck } from 'lucide-react';
import Button from '../common/Button';

export default function Step2PlayerDetails({ formData, updateFormData, onNext, onPrev }) {
  const rolesList = ['IGL', 'Assaulter', 'Entry Fragger', 'Support'];

  const handlePlayerChange = (index, field, value) => {
    const updated = [...(formData.players || [])];
    
    // Ensure array has enough elements (up to 4 starters)
    while (updated.length <= index) {
      updated.push({
        name: '',
        ign: '',
        bgmiId: '',
        role: index === 0 ? 'IGL' : 'Assaulter',
        verificationStatus: 'Pending Verification'
      });
    }

    updated[index] = { ...updated[index], [field]: value };
    updateFormData({ players: updated.slice(0, 4) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const starters = (formData.players || []).slice(0, 4);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-premium-border pb-6">
        <h3 className="text-2xl font-bold text-premium-text tracking-tight flex items-center gap-3">
          <Users className="w-6 h-6 text-amber-600" /> Step 2: Player Roster & Identifiers
        </h3>
        <p className="text-sm text-premium-text-secondary font-medium mt-2">
          Enter Full Name, In-Game Name (IGN), and BGMI Character ID for your 4 starting squad members.
        </p>
      </div>

      {/* 4 MAIN STARTERS */}
      <div className="space-y-6">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-premium-text flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600" /> 4 Starting Roster Members <span className="text-amber-600">(Required)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {starters.map((player, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-[20px] border space-y-4 transition-all ${
                idx === 0
                  ? 'bg-amber-50/30 border-amber-200 shadow-sm'
                  : 'bg-premium-background border-premium-border shadow-sm'
              }`}
            >
              <div className="border-b border-premium-border pb-3 flex items-center justify-between">
                <span className={`font-bold text-sm tracking-tight ${idx === 0 ? 'text-amber-700' : 'text-premium-text'}`}>
                  Player 0{idx + 1} {idx === 0 ? '(Captain / IGL)' : '(Starter)'}
                </span>
                <span className="text-[9px] font-bold text-premium-text-secondary uppercase tracking-widest bg-premium-surface px-2 py-1 rounded border border-premium-border">
                  {idx === 0 ? 'Captain' : 'Core'}
                </span>
              </div>

              <div className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">
                    Full Name <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={player.name || ''}
                    onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-medium focus:outline-none focus:border-premium-text transition-colors shadow-sm"
                  />
                </div>

                {/* In-Game Name (IGN) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">
                    In-Game Name (IGN) <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JONATHAN_Gaming"
                    value={player.ign || ''}
                    onChange={(e) => handlePlayerChange(idx, 'ign', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-semibold focus:outline-none focus:border-premium-text transition-colors shadow-sm"
                  />
                </div>

                {/* BGMI Player ID */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">
                    BGMI Player ID (Character ID) <span className="text-amber-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5123456789"
                    value={player.bgmiId || ''}
                    onChange={(e) => handlePlayerChange(idx, 'bgmiId', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-semibold focus:outline-none focus:border-premium-text transition-colors shadow-sm"
                  />
                </div>

                {/* Player Role */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">
                    Tactical Role <span className="text-amber-600">*</span>
                  </label>
                  <select
                    value={player.role || (idx === 0 ? 'IGL' : 'Assaulter')}
                    onChange={(e) => handlePlayerChange(idx, 'role', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text transition-colors cursor-pointer shadow-sm appearance-none"
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

      <div className="pt-6 border-t border-premium-border flex items-center justify-between">
        <Button type="button" variant="outline" size="md" onClick={onPrev}>
          Back
        </Button>
        <Button type="submit" variant="primary" size="md">
          Proceed to Review
        </Button>
      </div>
    </form>
  );
}
