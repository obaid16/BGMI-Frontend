'use client';

import React from 'react';
import { Shield, Users, Edit3, Send } from 'lucide-react';
import Button from '../common/Button';

export default function Step4Review({ formData, onSubmit, onPrev, goToStep, submitting }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-200 dark:border-bgmi-border/60 pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-bgmi-red" /> Step 3: Registration Review
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Please review all submitted squad details before final submission.</p>
      </div>

      {/* SECTION 1: TEAM INFORMATION */}
      <div className="bg-slate-50 dark:bg-bgmi-surface/90 border border-slate-200 dark:border-bgmi-border rounded-xl p-5 clip-tactical space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-bgmi-border/40 pb-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-600 dark:text-slate-400 block font-medium">Squad Name:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{formData.teamName}</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400 block font-medium">Squad Captain:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{formData.captainName}</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400 block font-medium">WhatsApp Contact:</span>
            <span className="font-bold text-slate-900 dark:text-white">{formData.captainPhone}</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400 block font-medium">Student Email:</span>
            <span className="font-bold text-slate-900 dark:text-white">{formData.captainEmail}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ROSTER SUMMARY */}
      <div className="bg-slate-50 dark:bg-bgmi-surface/90 border border-slate-200 dark:border-bgmi-border rounded-xl p-5 clip-tactical space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-bgmi-border/40 pb-2">
          <h4 className="font-display font-bold text-sm text-sky-600 dark:text-bgmi-cyan uppercase flex items-center gap-2">
            <Users className="w-4 h-4" /> Roster Members & Player IDs ({formData.players.filter(p => p.name || p.ign).length} Registered)
          </h4>
          <button
            onClick={() => goToStep(2)}
            disabled={submitting}
            className="text-xs text-sky-600 dark:text-bgmi-cyan hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
          >
            <Edit3 className="w-3 h-3" /> Edit Roster
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
          {(formData.players || []).map((p, idx) => {
            if (!p.name && !p.ign && !p.bgmiId && idx >= 4) return null;
            return (
              <div
                key={idx}
                className={`p-3 bg-white dark:bg-bgmi-dark rounded-lg border text-xs space-y-1 ${
                  idx === 4
                    ? 'border-amber-500/40 bg-amber-500/5 dark:bg-bgmi-dark'
                    : 'border-slate-200 dark:border-bgmi-border/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-amber-600 dark:text-bgmi-gold font-bold uppercase">
                    {idx === 4 ? 'Substitute Player' : `Player 0${idx + 1} • ${p.role || 'Starter'}`}
                  </span>
                  {p.bgmiId && (
                    <span className="text-[9px] font-mono text-slate-500">ID: {p.bgmiId}</span>
                  )}
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{p.name || 'Unnamed Player'}</p>
                <div className="flex flex-wrap items-center justify-between gap-x-2 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                  <span>IGN: <strong className="text-bgmi-red">{p.ign || p.name || 'N/A'}</strong></span>
                  <span>ID: <strong className="text-sky-600 dark:text-bgmi-cyan">{p.bgmiId || 'N/A'}</strong></span>
                  {p.substituteId && (
                    <span className="w-full text-slate-500">Sub ID: <strong className="text-amber-500">{p.substituteId}</strong></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-bgmi-border/60 flex items-center justify-between">
        <Button type="button" variant="secondary" size="md" onClick={onPrev} disabled={submitting}>
          ← Back
        </Button>
        <Button type="button" variant="primary" size="lg" icon={Send} onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Submitting Registration...' : 'SUBMIT REGISTRATION PASS'}
        </Button>
      </div>
    </div>
  );
}
