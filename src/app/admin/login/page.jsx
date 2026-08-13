'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/common/Button';
import { Crosshair, AlertCircle, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-[#0a0b0e] bg-tactical-grid select-none">
      <div className="w-full max-w-md bg-[#12141c] border border-white/15 rounded-lg p-8 clip-tactical space-y-6 shadow-2xl">
        
        {/* BRANDING HEADER */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-slate-900 border border-white/15 rounded p-0.5 clip-tactical flex items-center justify-center text-white mx-auto">
            <Crosshair className="w-6 h-6 text-bgmi-red" />
          </div>
          <h1 className="font-broadcast font-bold text-2xl text-white uppercase tracking-wider">
            TOURNAMENT <span className="text-bgmi-red">CONTROL CENTER</span>
          </h1>
          <p className="text-xs font-mono text-slate-400">Esports Administrator & Referee Portal</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-bgmi-red/10 border border-bgmi-red/30 rounded text-xs text-rose-300 flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-bgmi-red" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase text-slate-300">Administrator Email</label>
            <input
              type="email"
              required
              placeholder="obaidullahshaikh07@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0b0e] border border-white/10 rounded text-white text-xs font-mono focus:outline-none focus:border-bgmi-red"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase text-slate-300">Security Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0b0e] border border-white/10 rounded text-white text-xs font-mono focus:outline-none focus:border-bgmi-red"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full mt-2">
            {loading ? 'AUTHENTICATING...' : 'LOGIN TO CONTROL CENTER'}
          </Button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-bgmi-gold" /> OFFICIAL NIT CHAMPIONSHIP ARENA
          </p>
        </div>

      </div>
    </div>
  );
}

