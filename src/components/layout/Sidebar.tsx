'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LucideIcon,
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label }) => {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <li className="list-none">
      <Link
        href={href}
        className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors group ${
          active
            ? 'text-white'
            : 'text-slate-300 hover:text-white'
        }`}
      >
        <Icon
          className={`h-4 w-4 transition-colors ${
            active ? 'text-[#F6B85E]' : 'text-slate-400 group-hover:text-[#F6B85E]'
          }`}
        />
        {label}
      </Link>
    </li>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="shrink-0 bg-[#0D1B2E] text-white">
      <div className="h-2 bg-[#F6B85E]" />
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-black text-[#F26E42]">O</span>
            <span className="hidden text-lg font-bold tracking-[0.18em] text-white sm:inline">OUTCOME360</span>
          </Link>
          <div className="hidden items-center gap-2 text-xs text-slate-400 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> OBE management portal
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto pb-1">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/programs" icon={GraduationCap} label="Academics" />
          <NavItem href="/courses" icon={BookOpen} label="Courses" />
          <NavItem href="/course-outcomes" icon={BookOpen} label="Outcomes" />
          <NavItem href="/reports" icon={BookOpen} label="Reports" />
          <button className="flex items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">
            More <ChevronDown className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </aside>
  );
};
