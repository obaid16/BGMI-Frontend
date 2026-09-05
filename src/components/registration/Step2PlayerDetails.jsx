'use client';

import React from 'react';
import { Users, UserCheck, ShieldAlert } from 'lucide-react';
import Button from '../common/Button';

export default function Step2PlayerDetails({ formData, updateFormData, onNext, onPrev }) {
  const rolesList = ['IGL', 'Assaulter', 'Entry Fragger', 'Support', 'Substitute'];

  const handlePlayerChange = (index, field, value) => {
    const updated = [...(formData.players || [])];
    
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
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300 font-sans">
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-4">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase flex items-center gap-2">
          <Users className="w-5 h-5 text-bgmi-red" /> Step 2: Player Roster, IGN & BGMI Player IDs
        </h3>
        <p className="text-xs text-slate-500 font-normal">
          Enter Full Name, In-Game Name (IGN), and BGMI Character ID for your 4 starters and optional 5th substitute.
        </p>
      </div>

      {/* 4 MAIN STARTERS */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-bgmi-red flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-bgmi-red" /> 4 Main Starting Roster Members (Required)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {starters.map((player, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#E7E3DA] dark:border-[#1E2638] bg-[#FAF8F5] dark:bg-[#0B0E14] space-y-3.5 shadow-editorial-sm"
            >
              <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white">
                  Player #{idx + 1} {idx === 0 ? '(Captain / IGL)' : ''}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  {player.role || 'Player'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={player.name}
                    onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 mb-1">In-Game Name (IGN)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JonathanOP"
                    value={player.ign}
                    onChange={(e) => handlePlayerChange(idx, 'ign', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 mb-1">BGMI Character ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5123987410"
                      value={player.bgmiId}
                      onChange={(e) => handlePlayerChange(idx, 'bgmiId', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 mb-1">Team Role</label>
                    <select
                      value={player.role}
                      onChange={(e) => handlePlayerChange(idx, 'role', e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
                    >
                      {rolesList.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5TH SUBSTITUTE PLAYER */}
      <div className="p-5 rounded-2xl border border-dashed border-[#E7E3DA] dark:border-[#1E2638] bg-[#FAF8F5]/60 dark:bg-[#0B0E14]/60 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-2">
          <span className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> 5th Substitute Player (Optional)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
            Substitute
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Substitute Full Name"
              value={subPlayer.name}
              onChange={(e) => handlePlayerChange(4, 'name', e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">IGN</label>
            <input
              type="text"
              placeholder="Substitute IGN"
              value={subPlayer.ign}
              onChange={(e) => handlePlayerChange(4, 'ign', e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-slate-500 mb-1">BGMI Character ID</label>
            <input
              type="text"
              placeholder="Character ID"
              value={subPlayer.bgmiId}
              onChange={(e) => handlePlayerChange(4, 'bgmiId', e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-xl text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:border-bgmi-red shadow-editorial-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-between">
        <Button type="button" variant="secondary" size="md" onClick={onPrev}>
          ← Back to Squad Overview
        </Button>
        <Button type="submit" variant="primary" size="md">
          Review Roster Details →
        </Button>
      </div>
    </form>
  );
}
