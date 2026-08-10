'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Admin routes get their own sidebar layout — no public nav/footer
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </>
  );
}
