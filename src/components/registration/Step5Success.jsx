'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Trophy, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

export default function Step5Success({ registrationId, onReset }) {
  return (
    <div className="text-center py-8 space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-bgmi-green/20 border border-bgmi-green text-bgmi-green rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
          REGISTRATION <span className="text-bgmi-green">SUCCESSFUL</span>
        </h2>
        <p className="text-sm text-slate-300">
          Your college BGMI squad has been successfully submitted to the tournament review panel.
        </p>
      </div>

      {/* REGISTRATION ID CARD */}
      <div className="p-6 bg-bgmi-surface border border-bgmi-gold/60 rounded-2xl clip-tactical shadow-gold-glow space-y-2 max-w-md mx-auto">
        <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Official Registration ID</p>
        <p className="font-display font-black text-3xl sm:text-4xl text-bgmi-gold tracking-widest">
          {registrationId || 'BGMI-2026-001'}
        </p>
        <p className="text-[11px] text-slate-400 italic">
          "Save this Registration ID for future communication & lobby entry."
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link href="/matches">
          <Button variant="primary" size="lg" icon={Trophy} className="w-full sm:w-auto">
            View Tournament Schedule
          </Button>
        </Link>
        <Button variant="secondary" size="lg" icon={RotateCcw} onClick={onReset} className="w-full sm:w-auto">
          Register Another Squad
        </Button>
      </div>
    </div>
  );
}
