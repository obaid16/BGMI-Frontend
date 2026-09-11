'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { Menu, Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    const token = localStorage.getItem('bgmi_esports_admin_token');
    const userStr = localStorage.getItem('bgmi_esports_admin_user');

    if (!token || !userStr) {
      localStorage.removeItem('bgmi_esports_admin_token');
      localStorage.removeItem('bgmi_esports_admin_user');
      router.push('/admin/login');
    } else {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem('bgmi_esports_admin_token');
          localStorage.removeItem('bgmi_esports_admin_user');
          router.push('/admin/login');
        }
      } catch (e) {
        localStorage.removeItem('bgmi_esports_admin_token');
        localStorage.removeItem('bgmi_esports_admin_user');
        router.push('/admin/login');
      } finally {
        setCheckingAuth(false);
      }
    }
  }, [isLoginPage, router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-premium-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-premium-text-secondary animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-premium-text-secondary">Verifying Access</p>
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-premium-background flex items-center justify-center p-6">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-premium-background text-premium-text font-sans">
      {/* DESKTOP SIDEBAR - FIXED & STICKY */}
      <div className="hidden lg:block h-full flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden transition-all"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-[280px] bg-[#111215] shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* MAIN ADMIN CONTENT AREA - ONLY THIS SCROLLS */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        <div className="flex items-center justify-between bg-premium-background border-b border-premium-border px-6 h-20 lg:hidden sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2.5 text-premium-text-secondary hover:text-black rounded-xl bg-premium-surface border border-premium-border shadow-sm transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-lg text-premium-text tracking-tight">
              Championship Admin
            </span>
          </div>
        </div>

        <div className="hidden lg:block sticky top-0 z-20 bg-premium-background border-b border-premium-border">
          <AdminTopbar />
        </div>

        <main className="p-6 lg:p-10 flex-1 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
