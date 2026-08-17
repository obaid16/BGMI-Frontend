'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // All Admin routes (including /admin/login) get their own standalone layout: no public navbar/footer
  const isAdminRoute = pathname.startsWith('/admin');

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

