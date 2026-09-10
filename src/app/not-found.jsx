'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { ShieldAlert, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-premium-background text-center">
      <div className="max-w-md bg-white border border-premium-border rounded-[24px] p-10 shadow-sm space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-sm">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h1 className="font-bold text-6xl text-premium-text tracking-tighter">404</h1>
          <h2 className="font-bold text-xl text-premium-text">
            Page Not Found
          </h2>
          <p className="text-sm text-premium-text-secondary font-medium leading-relaxed">
            The page or route you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link href="/">
          <Button variant="primary" size="lg" icon={Home} className="w-full">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
