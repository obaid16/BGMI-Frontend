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
    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-300">
      <div className="border-b border-premium-border pb-6">
        <h3 className="text-2xl font-bold text-premium-text tracking-tight flex items-center gap-3">
          <Users className="w-6 h-6 text-premium-text-secondary" /> Step 2: Player Roster & Identifiers
        </h3>
        <p className="text-sm text-premium-text-secondary font-medium mt-2">
          Enter Full Name, In-Game Name (IGN), BGMI Player ID, and Substitute ID for your 4 starters and 5th substitute player.
        </p>
      </div>

      {/* 4 MAIN STARTERS */}
      <div className="space-y-6">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-premium-text flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600" /> 4 Main Starting Roster Members <span className="text-amber-600">(Required)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {starters.map((player, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-[20px] border space-y-5 transition-all ${
                idx === 0
                  ? 'bg-amber-50/30 border-amber-200 shadow-sm'
                  : 'bg-premium-background border-premium-border shadow-sm'
              }`}
            >
              <div className="border-b border-premium-border pb-3 flex items-center justify-between">
                <span className={`font-bold text-sm tracking-tight ${idx === 0 ? 'text-amber-700' : 'text-premium-text'}`}>
                  Player 0{idx + 1} {idx === 0 ? '(Captain / IGL)' : '(Starter)'}
                </span>
                <span className="text-[9px] font-bold text-premium-text-secondary uppercase tracking-widest bg-premium-surface px-2 py-1 rounded border border-premium-border">Starter</span>
              </div>

              <div className="space-y-4">
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

                {/* Substitute Player ID */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">
                    Substitute Player ID (Backup)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5987654321"
                    value={player.substituteId || ''}
                    onChange={(e) => handlePlayerChange(idx, 'substituteId', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-semibold focus:outline-none focus:border-premium-text transition-colors shadow-sm"
                  />
                </div>

                {/* Player Role */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">
                    Player Role <span className="text-amber-600">*</span>
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

      {/* SUBSTITUTE PLAYER SECTION */}
      <div className="pt-6 border-t border-premium-border space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-premium-text-secondary flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-premium-text-secondary" /> Dedicated 5th Substitute Player <span className="text-premium-text-secondary font-medium">(Optional)</span>
          </h4>
          <span className="text-[9px] font-bold text-premium-text-secondary uppercase tracking-widest bg-premium-background px-2.5 py-1 rounded-md border border-premium-border">
            Sub Roster
          </span>
        </div>

        <div className="p-6 rounded-[20px] border border-premium-border bg-premium-surface-soft shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Substitute Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">
                Substitute Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Substitute Name"
                value={subPlayer.name || ''}
                onChange={(e) => handlePlayerChange(4, 'name', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-medium focus:outline-none focus:border-premium-text transition-colors shadow-sm"
              />
            </div>

            {/* Substitute In-Game Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">
                Substitute In-Game Name (IGN)
              </label>
              <input
                type="text"
                placeholder="e.g. Sub_Mortal"
                value={subPlayer.ign || ''}
                onChange={(e) => handlePlayerChange(4, 'ign', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-semibold focus:outline-none focus:border-premium-text transition-colors shadow-sm"
              />
            </div>

            {/* Substitute Player ID */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">
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
                className="w-full px-4 py-2.5 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-semibold focus:outline-none focus:border-premium-text transition-colors shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-premium-border flex items-center justify-between">
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
