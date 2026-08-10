'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { Menu, X } from 'lucide-react';

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
          // Token expired
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

  // Loading indicator while verifying credentials
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-bgmi-dark flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-bgmi-gold border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Verifying Admin Access...</p>
      </div>
    );
  }

  // Admin Login page gets a clean standalone layout
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-bgmi-dark bg-tactical-grid bg-hero-radial flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bgmi-dark text-slate-100">

      {/* DESKTOP SIDEBAR (hidden on mobile) */}
      <div className="hidden lg:block flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* MAIN ADMIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile hamburger toggle inside topbar */}
        <div className="flex items-center gap-3 bg-bgmi-surface/90 border-b border-bgmi-border/60 px-4 h-16 lg:hidden sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-bgmi-card border border-bgmi-border"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-black text-sm text-white uppercase tracking-wide">
            TOURNAMENT <span className="text-bgmi-gold">ADMIN</span>
          </span>
        </div>

        {/* Desktop topbar */}
        <div className="hidden lg:block">
          <AdminTopbar />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
