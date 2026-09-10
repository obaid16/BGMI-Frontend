'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/common/Button';
import { LayoutDashboard, AlertCircle, Shield } from 'lucide-react';

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
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-premium-background select-none">
      <div className="w-full max-w-md bg-white border border-premium-border rounded-[24px] p-10 space-y-8 shadow-sm">
        
        {/* BRANDING HEADER */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-[12px] flex items-center justify-center text-amber-600 mx-auto shadow-sm">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <h1 className="font-bold text-2xl text-premium-text tracking-tight">
            Control Center
          </h1>
          <p className="text-sm font-medium text-premium-text-secondary">Administrator & Referee Portal</p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-[12px] text-sm text-red-600 flex items-center gap-3 font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">Administrator Email</label>
            <input
              type="email"
              required
              placeholder="obaidullahshaikh07@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text shadow-sm transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">Security Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-premium-border rounded-[12px] text-premium-text text-sm font-bold focus:outline-none focus:border-premium-text shadow-sm transition-colors"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full mt-2">
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </Button>
        </form>

        <div className="pt-6 border-t border-premium-border text-center">
          <p className="text-[10px] font-bold text-premium-text-secondary uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Official Championship Arena
          </p>
        </div>

      </div>
    </div>
  );
}
