'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Shield, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
      showToast('Admin Access Granted. Welcome!', 'success');
      router.push('/admin');
    } else {
      setErrorMsg(res.message || 'Invalid credentials');
      showToast(res.message || 'Invalid credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#FAF8F5] dark:bg-[#0B0E14] select-none font-sans transition-colors duration-200">
      
      {/* BRANDING HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 px-2.5 py-1 bg-white dark:bg-[#121620] rounded-xl border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center shadow-editorial-sm">
            <img
              src="/images/nit-logo-icon.png"
              alt="NIT Esports Logo"
              className="h-6 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col border-l border-[#E7E3DA] dark:border-[#1E2638] pl-3 text-left">
            <span className="font-display font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              BGMI <span className="text-bgmi-red">PORTAL</span>
            </span>
            <span className="text-[8px] font-mono text-bgmi-gold font-bold uppercase tracking-widest">
              CONTROL CENTER
            </span>
          </div>
        </Link>
      </div>

      {/* LOGIN CARD INSPIRED BY REFERENCE */}
      <div className="w-full max-w-md bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-3xl p-8 sm:p-10 space-y-6 shadow-editorial-lg">
        
        <div className="space-y-1.5">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white uppercase tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Sign in to access tournament administration & referee tools.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="obaidullahshaikh07@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-bgmi-red shadow-editorial-sm transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-bgmi-red shadow-editorial-sm transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 dark:bg-bgmi-red dark:hover:bg-bgmi-red-hover text-white font-display font-bold text-xs uppercase tracking-wider rounded-2xl shadow-editorial hover:shadow-editorial-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#E7E3DA] dark:border-[#1E2638] text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" /> SECURED REFEREE CONTROL DESK
          </p>
        </div>

      </div>

      <div className="mt-6">
        <Link href="/" className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          ← Return to Public Tournament Portal
        </Link>
      </div>

    </div>
  );
}
