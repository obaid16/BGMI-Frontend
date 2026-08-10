'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/common/Button';
import { Shield, Lock, Mail, Crosshair, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('admin@bgmi-esports.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await loginAdmin(email, password);
    setLoading(false);

    if (res.success) {
      showToast('Admin Access Granted. Welcome, Director!', 'success');
      router.push('/admin');
    } else {
      setErrorMsg(res.message);
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-tactical-grid bg-hero-radial">
      <div className="w-full max-w-md bg-bgmi-surface border border-bgmi-gold/40 rounded-2xl p-8 clip-tactical shadow-gold-glow space-y-6">
        
        {/* BRANDING HEADER */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-bgmi-gold rounded-xl p-0.5 clip-tactical flex items-center justify-center text-slate-950 font-bold mx-auto shadow-gold-glow">
            <Crosshair className="w-8 h-8" />
          </div>
          <h1 className="font-display font-black text-2xl text-white uppercase tracking-wider">
            TOURNAMENT <span className="text-bgmi-gold">CONTROL CENTER</span>
          </h1>
          <p className="text-xs text-slate-400">Esports Administrator & Referee Portal</p>
        </div>

        {/* DEMO CREDENTIALS NOTICE */}
        <div className="p-3 bg-bgmi-dark/90 border border-bgmi-gold/30 rounded-xl text-xs space-y-1">
          <p className="font-bold text-bgmi-gold flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Demo Administrator Credentials
          </p>
          <p className="text-slate-300">Email: <span className="font-mono text-white">admin@bgmi-esports.in</span></p>
          <p className="text-slate-300">Password: <span className="font-mono text-white">admin123</span></p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-bgmi-red/20 border border-bgmi-red/40 rounded-lg text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-300">Administrator Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-xs focus:outline-none focus:border-bgmi-gold font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-300">Security Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-bgmi-dark border border-bgmi-border rounded-xl text-white text-xs focus:outline-none focus:border-bgmi-gold font-medium"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
            {loading ? 'AUTHENTICATING...' : 'LOGIN TO CONTROL CENTER'}
          </Button>
        </form>

      </div>
    </div>
  );
}
