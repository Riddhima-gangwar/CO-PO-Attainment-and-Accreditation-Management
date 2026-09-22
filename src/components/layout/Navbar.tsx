'use client';

import React from 'react';
import { Bell, ChevronDown, Search, Sun } from 'lucide-react';

interface NavbarProps {
  userName?: string;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName = 'Admin User',
  userRole = 'Accreditation Head',
}) => {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#10243A] px-4 py-4 text-white sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative hidden w-full max-w-xs md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
              className="block w-full rounded-full border border-white/15 bg-white/5 py-2 pl-10 pr-3 text-sm leading-5 text-white placeholder-slate-400 outline-none transition focus:border-[#F6B85E] focus:ring-2 focus:ring-[#F6B85E]/30"
            placeholder="Search programs, courses, or outcomes..."
          />
          </div>
          <div className="hidden text-sm text-slate-300 lg:block">Academic year 2025-26</div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
        <button aria-label="Toggle theme" className="hidden text-slate-300 transition hover:text-white sm:block">
          <Sun className="h-5 w-5" />
        </button>
        <button
          aria-label="Notifications"
            className="relative rounded-full p-1 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
            <span className="absolute right-0.5 top-0.5 block h-2 w-2 rounded-full bg-[#FF8668] ring-2 ring-[#10243A]" />
          <Bell className="h-5 w-5" />
        </button>

          <div className="h-7 w-px bg-white/15" />

          <div className="group flex cursor-pointer items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#F6B85E] bg-[#1D3B59] text-sm font-bold text-white transition group-hover:ring-2 group-hover:ring-[#F6B85E]/40">
            AD
          </div>
            <div className="hidden text-sm md:block">
              <p className="font-semibold text-white transition-colors group-hover:text-[#F6B85E]">
              {userName}
            </p>
              <p className="text-xs text-slate-400">{userRole}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};
