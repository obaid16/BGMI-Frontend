'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, ShieldAlert, Trophy, RotateCcw, MessageCircle } from 'lucide-react';
import Button from '../common/Button';

export default function Step5Success({ registrationId, onReset }) {
  return (
    <div className="text-center py-8 space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-bgmi-red/10 border border-bgmi-red/40 rounded-full text-bgmi-red text-xs font-black uppercase tracking-wider shadow-red-glow">
          <ShieldAlert className="w-4 h-4" /> STATUS: PENDING ADMIN REVIEW
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl text-white dark:text-white light:text-slate-900 uppercase tracking-tight">
          REGISTRATION <span className="text-bgmi-red">CONFIRMED</span>
        </h2>

        <div className="p-4 bg-bgmi-dark/90 dark:bg-bgmi-dark/90 light:bg-slate-100 border border-bgmi-border dark:border-bgmi-border light:border-slate-200 rounded-xl max-w-lg mx-auto space-y-2 text-left">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-bgmi-red flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium">
              <p className="font-bold text-white dark:text-white light:text-slate-900 text-sm">
                Your squad registration has been received.
              </p>
              <p>
                You will be notified via email. Once the admin team approves your squad, the team captain will receive an official verification pass with match lobby details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION ID CARD */}
      <div className="p-6 bg-bgmi-surface/90 dark:bg-bgmi-surface/90 light:bg-white border border-bgmi-red/60 rounded-2xl clip-tactical shadow-red-glow space-y-2 max-w-md mx-auto">
        <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-400 light:text-slate-600 tracking-widest">Official Registration Pass ID</p>
        <p className="font-display font-black text-3xl sm:text-4xl text-bgmi-red tracking-widest">
          {registrationId || 'BGMI-2026-001'}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 italic">
          "Save this Registration ID for referee reference and lobby slotting."
        </p>
      </div>

      {/* JOIN WHATSAPP ACTION CARD */}
      <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3 max-w-md mx-auto text-center clip-tactical">
        <h4 className="font-display font-bold text-sm text-emerald-400 dark:text-emerald-400 light:text-emerald-700 uppercase tracking-wide flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-400 light:text-emerald-700" /> Join Captains' WhatsApp Group
        </h4>
        <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium">
          All team captains must join the official WhatsApp Group to receive live custom lobby room IDs, passwords, schedules, and referee support.
        </p>
        <a
          href="https://chat.whatsapp.com/E8vPQ1JZOPV4BNPF9FPLKG?s=cl&p=a&ilr=4"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          <span>Join WhatsApp Community</span>
        </a>
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
