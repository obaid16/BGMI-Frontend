'use client';

import React from 'react';
import { Shield, Users, Edit3, Send } from 'lucide-react';
import Button from '../common/Button';

export default function Step4Review({ formData, onSubmit, onPrev, goToStep, submitting }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      <div className="border-b border-[#E7E3DA] dark:border-[#1E2638] pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-bgmi-red" /> Step 3: Registration Review
        </h3>
        <p className="text-xs text-slate-500 font-normal">Please verify all submitted squad details before final confirmation.</p>
      </div>

      {/* SECTION 1: TEAM INFORMATION */}
      <div className="bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl p-5 space-y-3 shadow-editorial-sm">
        <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-2">
          <h4 className="font-display font-bold text-sm text-bgmi-red uppercase flex items-center gap-2">
            <Shield className="w-4 h-4" /> Squad Overview
          </h4>
          <button
            onClick={() => goToStep(1)}
            disabled={submitting}
            className="text-xs text-bgmi-red hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
          >
            <Edit3 className="w-3 h-3" /> Edit Section
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Squad Name:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm font-sans">{formData.teamName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Captain:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm font-sans">{formData.captainName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">WhatsApp:</span>
            <span className="font-bold text-slate-900 dark:text-white">{formData.captainPhone}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] font-medium">Student Email:</span>
            <span className="font-bold text-slate-900 dark:text-white truncate block">{formData.captainEmail}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ROSTER SUMMARY */}
      <div className="bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl p-5 space-y-3 shadow-editorial-sm">
        <div className="flex items-center justify-between border-b border-[#E7E3DA] dark:border-[#1E2638] pb-2">
          <h4 className="font-display font-bold text-sm text-sky-600 dark:text-sky-400 uppercase flex items-center gap-2">
            <Users className="w-4 h-4" /> Roster Members & Player IDs ({formData.players.filter(p => p.name || p.ign).length} Registered)
          </h4>
          <button
            onClick={() => goToStep(2)}
            disabled={submitting}
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
          >
            <Edit3 className="w-3 h-3" /> Edit Section
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {formData.players.filter(p => p.name || p.ign).map((player, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-[#121620] rounded-xl border border-[#E7E3DA] dark:border-[#1E2638] space-y-1 shadow-editorial-sm">
              <div className="flex justify-between font-bold">
                <span className="text-slate-900 dark:text-white font-sans">{player.ign || 'Player'}</span>
                <span className="text-bgmi-red text-[10px] uppercase">{player.role}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans">{player.name}</p>
              <p className="text-[10px] text-slate-400">ID: {player.bgmiId || 'Pending'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="pt-6 border-t border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-between">
        <Button type="button" variant="secondary" size="md" onClick={onPrev} disabled={submitting}>
          ← Edit Roster Details
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          icon={Send}
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting Registration...' : 'Confirm & Register Squad'}
        </Button>
      </div>
    </div>
  );
}
