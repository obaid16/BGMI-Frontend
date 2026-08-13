'use client';

import React from 'react';
import { Shield, Users, Edit3, Send } from 'lucide-react';
import Button from '../common/Button';

export default function Step4Review({ formData, onSubmit, onPrev, goToStep, submitting }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-white dark:text-white light:text-slate-900 uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-bgmi-red" /> Step 3: Registration Review
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-medium">Please review all submitted squad details before final submission.</p>
      </div>

      {/* SECTION 1: TEAM INFORMATION */}
      <div className="bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-slate-50 border border-bgmi-border dark:border-bgmi-border light:border-slate-200 rounded-xl p-5 clip-tactical space-y-3">
        <div className="flex items-center justify-between border-b border-bgmi-border/40 dark:border-bgmi-border/40 light:border-slate-200 pb-2">
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
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 block">Squad Name:</span>
            <span className="font-bold text-white dark:text-white light:text-slate-900 text-sm">{formData.teamName}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 block">Squad Captain:</span>
            <span className="font-bold text-white dark:text-white light:text-slate-900 text-sm">{formData.captainName}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 block">WhatsApp Contact:</span>
            <span className="font-bold text-white dark:text-white light:text-slate-900">{formData.captainPhone}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-600 block">Student Email:</span>
            <span className="font-bold text-white dark:text-white light:text-slate-900">{formData.captainEmail}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ROSTER SUMMARY */}
      <div className="bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-slate-50 border border-bgmi-border dark:border-bgmi-border light:border-slate-200 rounded-xl p-5 clip-tactical space-y-3">
        <div className="flex items-center justify-between border-b border-bgmi-border/40 dark:border-bgmi-border/40 light:border-slate-200 pb-2">
          <h4 className="font-display font-bold text-sm text-bgmi-cyan dark:text-bgmi-cyan light:text-sky-600 uppercase flex items-center gap-2">
            <Users className="w-4 h-4" /> Roster Members ({formData.players.length} Players)
          </h4>
          <button
            onClick={() => goToStep(2)}
            disabled={submitting}
            className="text-xs text-bgmi-cyan dark:text-bgmi-cyan light:text-sky-600 hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
          >
            <Edit3 className="w-3 h-3" /> Edit Section
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {formData.players.slice(0, 4).map((p, idx) => (
            <div key={idx} className="p-3 bg-bgmi-dark dark:bg-bgmi-dark light:bg-slate-100 rounded-lg border border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 text-xs space-y-1">
              <span className="text-[9px] text-bgmi-gold dark:text-bgmi-gold light:text-amber-600 font-bold uppercase block">
                Player 0{idx + 1} • {p.role}
              </span>
              <p className="font-bold text-white dark:text-white light:text-slate-900 text-sm">{p.name || 'Unnamed Player'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-bgmi-border/60 dark:border-bgmi-border/60 light:border-slate-200 flex items-center justify-between">
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
