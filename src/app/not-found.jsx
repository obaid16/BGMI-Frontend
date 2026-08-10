'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { Crosshair, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-tactical-grid text-center">
      <div className="max-w-md bg-bgmi-surface border border-bgmi-gold/40 rounded-2xl p-8 clip-tactical shadow-gold-glow space-y-6">
        <div className="w-16 h-16 rounded-full bg-bgmi-gold/20 border border-bgmi-gold flex items-center justify-center mx-auto text-bgmi-gold shadow-gold-glow">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-black text-5xl text-white">404</h1>
          <h2 className="font-display font-bold text-xl text-bgmi-gold uppercase">
            OUT OF SAFE ZONE!
          </h2>
          <p className="text-xs text-slate-400">
            The page or custom lobby route you are looking for has been eliminated by the Blue Zone.
          </p>
        </div>

        <Link href="/">
          <Button variant="primary" size="lg" icon={Crosshair} className="w-full">
            RETURN TO SAFE LOBBY (HOME)
          </Button>
        </Link>
      </div>
    </div>
  );
}
