'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Shield, CheckCircle2, Swords } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await loginAdmin(email, password);
      setLoading(false);

      if (res && res.success) {
        showToast('Admin Access Granted. Welcome Back!', 'success');
        router.push('/admin');
      } else {
        setErrorMsg(res?.message || 'Invalid credentials');
        showToast(res?.message || 'Invalid credentials', 'error');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Login failed. Please check your credentials.');
      showToast('Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] dark:bg-[#0B0E14] flex items-center justify-center p-4 sm:p-8 font-sans transition-colors duration-200">
      
      {/* 2-PANEL EDITORIAL LAYOUT INSPIRED BY REFERENCE */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF8F5] dark:bg-[#0B0E14]">
        
        {/* LEFT BRAND & IDENTITY COLUMN (7 COLS) */}
        <div className="lg:col-span-7 space-y-8 relative pr-0 lg:pr-8">
          
          {/* HEADER BRANDING */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              </div>
              <span className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">
                BGMI <span className="text-bgmi-red">PORTAL</span>
              </span>
            </Link>

            <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase font-bold hidden sm:block">
              NEXCORE CHAMPIONSHIP
            </span>
          </div>

          <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">
            REFEREE &amp; TOURNAMENT OPERATIONS DESK
          </div>

          {/* LARGE TYPOGRAPHIC HEADLINE */}
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-slate-900 dark:text-white leading-[0.95] tracking-tight">
              Admin <br />
              Control <br />
              <span className="text-[#C5A059]">Console</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal pt-2 max-w-md">
              Official administrator operations for squad verifications, custom room lobby management, and score certification.
            </p>
          </div>

          {/* 3 AUTHENTIC CAPABILITY PILLS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
            <div className="p-4 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl">
              <Shield className="w-5 h-5 text-[#C5A059] mb-1.5" />
              <span className="font-display font-bold text-xs text-slate-900 dark:text-white block">
                Squad Approvals
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Review &amp; Verify</span>
            </div>

            <div className="p-4 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl">
              <Swords className="w-5 h-5 text-[#C5A059] mb-1.5" />
              <span className="font-display font-bold text-xs text-slate-900 dark:text-white block">
                Room Lobbies
              </span>
              <span className="text-[10px] text-slate-500 font-mono">ID &amp; Password</span>
            </div>

            <div className="p-4 bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-[#C5A059] mb-1.5" />
              <span className="font-display font-bold text-xs text-slate-900 dark:text-white block">
                Results
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Certification</span>
            </div>
          </div>

          {/* BOTTOM NOTICE */}
          <div className="pt-4 border-t border-[#E7E3DA] dark:border-[#1E2638]">
            <p className="text-xs text-slate-500 font-mono">
              Authorized tournament officials only. All access is logged for audit integrity.
            </p>
          </div>

        </div>

        {/* RIGHT FLOATING LOGIN CARD (5 COLS) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#121620] border border-[#E7E3DA] dark:border-[#1E2638] rounded-[32px] p-8 sm:p-10 shadow-2xl space-y-6">
            
            <div className="space-y-1">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                Admin Sign In
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Enter your credentials to access the tournament operations console
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-bold block">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="admin@bgmi.esports"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 font-bold block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-[#FAF8F5] dark:bg-[#0B0E14] border border-[#E7E3DA] dark:border-[#1E2638] rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#E7E3DA] text-slate-900 focus:ring-0 accent-slate-900 cursor-pointer"
                  />
                  <span>Remember this terminal</span>
                </label>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-2xl shadow-editorial hover:shadow-editorial-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-4 text-center text-xs text-slate-500 border-t border-[#E7E3DA] dark:border-[#1E2638]">
                <Link href="/" className="hover:text-slate-900 dark:hover:text-white font-medium">
                  ← Return to Public Tournament Portal
                </Link>
              </div>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
