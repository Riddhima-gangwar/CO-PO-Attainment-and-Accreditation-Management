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
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Reusable Modular Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Reusable Modular Navbar */}
        <Navbar />

        {/* Page Content Viewport */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
