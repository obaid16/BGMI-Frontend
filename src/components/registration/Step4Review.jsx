'use client';

import React from 'react';
import { Shield, Users, Edit3, Send } from 'lucide-react';
import Button from '../common/Button';

export default function Step4Review({ formData, onSubmit, onPrev, goToStep, submitting }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-premium-border pb-6">
        <h3 className="text-2xl font-bold text-premium-text tracking-tight flex items-center gap-3">
          <Shield className="w-6 h-6 text-premium-text-secondary" /> Step 3: Registration Review
        </h3>
        <p className="text-sm text-premium-text-secondary font-medium mt-2">Please review all submitted squad details before final submission.</p>
      </div>

      {/* SECTION 1: TEAM INFORMATION */}
      <div className="bg-premium-surface border border-premium-border rounded-[24px] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-premium-border pb-4">
          <h4 className="font-bold text-base text-premium-text flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" /> Squad Overview
          </h4>
          <button
            onClick={() => goToStep(1)}
            disabled={submitting}
            className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1.5 font-bold disabled:opacity-50 transition-colors uppercase tracking-widest"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary block">Squad Name</span>
            <span className="font-bold text-premium-text text-base">{formData.teamName}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary block">Squad Captain</span>
            <span className="font-bold text-premium-text text-base">{formData.captainName}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary block">WhatsApp Contact</span>
            <span className="font-bold text-premium-sage text-sm mt-0.5">{formData.captainPhone}</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary block">Student Email</span>
            <span className="font-semibold text-premium-text text-sm truncate block mt-0.5" title={formData.captainEmail}>{formData.captainEmail}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ROSTER SUMMARY */}
      <div className="bg-premium-surface border border-premium-border rounded-[24px] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-premium-border pb-4">
          <h4 className="font-bold text-base text-premium-text flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" /> 4 Starting Roster Members
          </h4>
          <button
            onClick={() => goToStep(2)}
            disabled={submitting}
            className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1.5 font-bold disabled:opacity-50 transition-colors uppercase tracking-widest"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {(formData.players || []).slice(0, 4).map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-[16px] border border-premium-border bg-premium-background shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between border-b border-premium-border pb-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  Player 0{idx + 1} • {p.role || (idx === 0 ? 'IGL' : 'Core')}
                </span>
                {p.bgmiId && (
                  <span className="text-[10px] font-bold text-premium-text-secondary bg-white px-2 py-0.5 rounded border border-premium-border uppercase tracking-widest">
                    ID: {p.bgmiId}
                  </span>
                )}
              </div>
              <p className="font-bold text-premium-text text-base">{p.name || 'Unnamed Player'}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm font-medium">
                <span className="text-premium-text-secondary">IGN: <strong className="text-premium-text">{p.ign || p.name || 'N/A'}</strong></span>
                <span className="text-premium-text-secondary">Character ID: <strong className="text-premium-text">{p.bgmiId || 'N/A'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-premium-border flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
        <Button type="button" variant="secondary" size="md" onClick={onPrev} disabled={submitting} className="w-full sm:w-auto">
          Back to Players
        </Button>
        <Button type="button" variant="primary" size="lg" icon={Send} onClick={onSubmit} disabled={submitting} className="w-full sm:w-auto">
          {submitting ? 'Submitting...' : 'Submit Registration Pass'}
        </Button>
      </div>
    </div>
  );
}
