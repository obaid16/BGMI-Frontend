'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // All Admin routes (including /admin/login) and standalone pages (like /media/submit) get their own layout: no public navbar/footer
  const isStandaloneRoute = pathname.startsWith('/admin') || pathname === '/media/submit';

  if (isStandaloneRoute) {
    return <>{children}</>;
  }

  const isHome = pathname === '/';

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}

