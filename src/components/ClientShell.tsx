'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/Toast';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const WaterCursor = dynamic(() => import('@/components/WaterCursor'), { ssr: false });
const Mascot = dynamic(() => import('@/components/Mascot'), { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden overflow-y-visible underwater-bg">
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-35"
        style={{
          background:
            'linear-gradient(105deg, rgba(255,255,255,0.2) 8%, transparent 24%, transparent 42%, rgba(255,255,255,0.12) 56%, transparent 72%), linear-gradient(180deg, transparent 0%, rgba(0,119,255,0.04) 100%)',
          mixBlendMode: 'normal',
        }}
      />
      <WaterCursor />
      <Mascot />
      <Navbar />
      <ToastContainer />

      <div className="relative z-10 pb-10 sm:pb-14 md:pb-32 lg:pb-40">
        {children}
      </div>

      <Footer />
    </main>
  );
}
