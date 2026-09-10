'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, ShieldAlert, Trophy, RotateCcw, MessageCircle } from 'lucide-react';
import Button from '../common/Button';

export default function Step5Success({ registrationId, onReset }) {
  return (
    <div className="text-center py-10 space-y-8 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="w-24 h-24 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-[28px] flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
      </div>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-[10px] font-bold uppercase tracking-widest shadow-sm">
          <ShieldAlert className="w-4 h-4" /> Pending Admin Review
        </div>

        <h2 className="font-bold text-4xl sm:text-5xl text-premium-text tracking-tight">
          Registration Confirmed
        </h2>

        <div className="p-6 bg-premium-background border border-premium-border rounded-[24px] max-w-xl mx-auto text-left shadow-sm mt-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white border border-premium-border flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-premium-text-secondary" />
            </div>
            <div className="space-y-2 text-sm text-premium-text-secondary font-medium pt-0.5">
              <p className="font-bold text-premium-text text-base">
                Your squad registration has been received.
              </p>
              <p className="leading-relaxed">
                You will be notified via email. Once the admin team approves your squad, the team captain will receive an official verification pass with match lobby details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION ID CARD */}
      <div className="p-8 bg-premium-surface border border-premium-border rounded-[28px] shadow-sm space-y-3 max-w-md mx-auto">
        <p className="text-[11px] uppercase font-bold text-premium-text-secondary tracking-widest">Official Pass ID</p>
        <p className="font-bold text-4xl sm:text-5xl text-premium-text tracking-tight">
          {registrationId || 'BGMI-2026-001'}
        </p>
        <p className="text-[11px] text-premium-text-secondary font-medium pt-2 border-t border-premium-border mt-4">
          Save this Registration ID for referee reference and lobby slotting.
        </p>
      </div>

      {/* JOIN WHATSAPP ACTION CARD */}
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[24px] space-y-4 max-w-md mx-auto text-center shadow-sm">
        <h4 className="font-bold text-base text-emerald-800 flex items-center justify-center gap-2">
          <MessageCircle className="w-5 h-5" /> Captains' WhatsApp Group
        </h4>
        <p className="text-sm text-emerald-700/80 font-medium">
          All team captains must join the official group to receive live custom lobby room IDs, passwords, and schedules.
        </p>
        <a
          href="https://chat.whatsapp.com/E8vPQ1JZOPV4BNPF9FPLKG?s=cl&p=a&ilr=4"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-[16px] text-sm transition-all shadow-sm active:scale-95"
        >
          <span>Join WhatsApp Community</span>
        </a>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <Link href="/matches">
          <Button variant="primary" size="lg" icon={Trophy} className="w-full sm:w-auto">
            View Schedule
          </Button>
        </Link>
        <Button variant="secondary" size="lg" icon={RotateCcw} onClick={onReset} className="w-full sm:w-auto">
          Register Another
        </Button>
      </div>
    </div>
  );
}
