'use client';

import React from 'react';
import { Shield, Users, FileCheck, Edit3, Send } from 'lucide-react';
import Button from '../common/Button';

export default function Step4Review({ formData, onSubmit, onPrev, goToStep, submitting }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-bgmi-border/60 pb-4 mb-6">
        <h3 className="text-xl font-bold font-display text-white uppercase flex items-center gap-2">
          <Shield className="w-5 h-5 text-bgmi-gold" /> Step 4: Final Registration Review
        </h3>
        <p className="text-xs text-slate-400">Please review all submitted squad information before final submission.</p>
      </div>

      {/* SECTION 1: TEAM INFORMATION */}
      <div className="bg-bgmi-surface border border-bgmi-border rounded-xl p-5 clip-tactical space-y-3">
        <div className="flex items-center justify-between border-b border-bgmi-border/40 pb-2">
          <h4 className="font-display font-bold text-sm text-bgmi-gold uppercase flex items-center gap-2">
            <Shield className="w-4 h-4" /> Team Overview
          </h4>
          <button
            onClick={() => goToStep(1)}
            disabled={submitting}
            className="text-xs text-bgmi-cyan hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
          >
            <Edit3 className="w-3 h-3" /> Edit Section
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Team Name:</span>
            <span className="font-bold text-white text-sm">{formData.teamName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Team Captain:</span>
            <span className="font-bold text-white text-sm">{formData.captainName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Contact Phone:</span>
            <span className="font-bold text-white">{formData.captainPhone}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Official Email:</span>
            <span className="font-bold text-white">{formData.captainEmail}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ROSTER SUMMARY */}
      <div className="bg-bgmi-surface border border-bgmi-border rounded-xl p-5 clip-tactical space-y-3">
        <div className="flex items-center justify-between border-b border-bgmi-border/40 pb-2">
          <h4 className="font-display font-bold text-sm text-bgmi-cyan uppercase flex items-center gap-2">
            <Users className="w-4 h-4" /> Player Roster ({formData.players.length} Players)
          </h4>
          <button
            onClick={() => goToStep(2)}
            disabled={submitting}
            className="text-xs text-bgmi-cyan hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
          >
            <Edit3 className="w-3 h-3" /> Edit Section
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {formData.players.slice(0, 4).map((p, idx) => (
            <div key={idx} className="p-3 bg-bgmi-dark rounded-lg border border-bgmi-border/40 text-xs space-y-1">
              <span className="text-[10px] text-bgmi-gold font-bold uppercase block">
                Player 0{idx + 1} • {p.role}
              </span>
              <p className="font-bold text-white text-sm">{p.name || 'Unnamed Player'}</p>
            </div>
          ))}
        </div>
      </div>



      <div className="pt-6 border-t border-bgmi-border/60 flex items-center justify-between">
        <Button type="button" variant="secondary" size="md" onClick={onPrev} disabled={submitting}>
          ← Back
        </Button>
        <Button type="button" variant="primary" size="lg" icon={Send} onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Submitting Registration...' : 'SUBMIT REGISTRATION'}
        </Button>
      </div>
    </div>
  );
}
