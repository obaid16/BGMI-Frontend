'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, ShieldAlert, Trophy, RotateCcw, MessageCircle } from 'lucide-react';
import Button from '../common/Button';

export default function Step5Success({ registrationId, onReset }) {
  return (
    <div className="text-center py-8 space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-300 font-sans">
      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-editorial-sm">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-bgmi-red text-xs font-mono font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" /> STATUS: PENDING ADMIN REVIEW
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white uppercase tracking-tight">
          Registration Confirmed
        </h2>

        <div className="p-4 sm:p-5 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl max-w-lg mx-auto space-y-2 text-left shadow-editorial-sm">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-bgmi-red shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-normal">
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                Your squad registration has been received.
              </p>
              <p>
                A confirmation email has been dispatched. Once verified by tournament referees, your squad will be slotted into the official tournament bracket.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION ID CARD */}
      <div className="p-6 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl shadow-editorial space-y-2 max-w-md mx-auto">
        <p className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-widest">Official Registration Pass ID</p>
        <p className="font-display font-black text-3xl sm:text-4xl text-bgmi-red tracking-widest">
          {registrationId || 'BGMI-2026-001'}
        </p>
        <p className="text-[11px] text-slate-500 italic">
          "Save this Registration ID for referee reference and custom room lobby slots."
        </p>
      </div>

      {/* JOIN WHATSAPP ACTION CARD */}
      <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl space-y-3 max-w-md mx-auto text-center shadow-editorial-sm">
        <h4 className="font-display font-bold text-sm text-emerald-800 dark:text-emerald-400 uppercase tracking-wide flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-600" /> Join Captains' WhatsApp Group
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-normal">
          All team captains must join the official WhatsApp Group to receive live custom lobby room IDs, passwords, schedule drops, and referee support.
        </p>
        <a
          href="https://chat.whatsapp.com/E8vPQ1JZOPV4BNPF9FPLKG?s=cl&p=a&ilr=4"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-editorial transition-all"
        >
          <span>Join WhatsApp Lobby</span>
        </a>
      </div>

      {/* ACTION FOOTER */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Button variant="secondary" size="md" icon={RotateCcw} onClick={onReset}>
          Register Another Squad
        </Button>
        <Link
          href="/matches"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-editorial"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>View Match Schedule</span>
        </Link>
      </div>
    </div>
  );
}
