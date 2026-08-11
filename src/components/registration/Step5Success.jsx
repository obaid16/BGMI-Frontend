'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, ShieldAlert, Trophy, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

export default function Step5Success({ registrationId, onReset }) {
  return (
    <div className="text-center py-8 space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-amber-500/20 border border-bgmi-gold text-bgmi-gold rounded-full flex items-center justify-center mx-auto shadow-gold-glow">
        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-bgmi-gold/40 rounded-full text-bgmi-gold text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" /> STATUS: PENDING ADMIN REVIEW
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
          REGISTRATION <span className="text-bgmi-gold">SUBMITTED</span>
        </h2>

        <div className="p-4 bg-bgmi-dark/90 border border-bgmi-border rounded-xl max-w-lg mx-auto space-y-2 text-left">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-bgmi-gold flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-300">
              <p className="font-bold text-white text-sm">
                Your squad has gone under review.
              </p>
              <p>
                You will be notified via email. Once the admin team approves your squad, the team captain will receive an official approval email with tournament details and custom room lobby instructions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION ID CARD */}
      <div className="p-6 bg-bgmi-surface border border-bgmi-gold/60 rounded-2xl clip-tactical shadow-gold-glow space-y-2 max-w-md mx-auto">
        <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">Official Registration ID</p>
        <p className="font-display font-black text-3xl sm:text-4xl text-bgmi-gold tracking-widest">
          {registrationId || 'BGMI-2026-001'}
        </p>
        <p className="text-[11px] text-slate-400 italic">
          "Save this Registration ID for future communication & referee reference."
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
