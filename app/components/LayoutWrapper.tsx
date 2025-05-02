'use client';

import React from 'react'
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname && pathname.startsWith('/conversations');

  return (
    <>
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
