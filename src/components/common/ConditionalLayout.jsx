'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Admin routes get their own sidebar layout — no public nav/footer
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
      <main className={`flex-1 w-full ${isHome ? 'pt-0' : 'pt-28 sm:pt-36'}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
