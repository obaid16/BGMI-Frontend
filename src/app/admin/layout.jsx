'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { Menu } from 'lucide-react';

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
      <div className="min-h-screen bg-[#0a0b0e] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-bgmi-red border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Verifying Admin Access...</p>
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] bg-tactical-grid flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0b0e] text-slate-100 font-sans">

      {/* DESKTOP SIDEBAR */}
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
        <div className="flex items-center gap-3 bg-[#12141c] border-b border-white/10 px-4 h-16 lg:hidden sticky top-0 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-slate-300 hover:text-white rounded bg-slate-900 border border-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-broadcast font-bold text-sm text-white uppercase tracking-wide">
            TOURNAMENT <span className="text-bgmi-red">ADMIN</span>
          </span>
        </div>

        <div className="hidden lg:block">
          <AdminTopbar />
        </div>

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

