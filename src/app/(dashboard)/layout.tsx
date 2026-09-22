'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#132A42]">
      <Sidebar />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
