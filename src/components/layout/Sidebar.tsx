'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Target,
  FileCheck,
  ClipboardList,
  PenTool,
  BarChart4,
  Award,
  ShieldCheck,
  FileText,
  PieChart,
  Users,
  Settings,
  Activity,
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
    <li>
      <Link
        href={href}
        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
          active
            ? 'bg-blue-50 text-blue-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon
          className={`mr-3 h-5 w-5 transition-colors ${
            active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
          }`}
        />
        {label}
      </Link>
    </li>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">
    {children}
  </h3>
);

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            Outcome360
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <nav className="space-y-1">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard overview" />

          <SectionTitle>Academic Management</SectionTitle>
          <ul className="space-y-1">
            <NavItem href="/programs" icon={GraduationCap} label="Programs" />
            <NavItem href="/courses" icon={BookOpen} label="Courses" />
            <NavItem href="/course-outcomes" icon={Target} label="CO Management" />
            <NavItem href="/program-outcomes" icon={FileCheck} label="PO Management" />
            <NavItem href="/program-specific-outcomes" icon={FileCheck} label="PSO Management" />
          </ul>

          <SectionTitle>Attainment</SectionTitle>
          <ul className="space-y-1">
            <NavItem href="/assessments" icon={ClipboardList} label="Assessments" />
            <NavItem href="/student-marks" icon={PenTool} label="Student Marks" />
            <NavItem href="/co-attainment" icon={BarChart4} label="CO Attainment" />
            <NavItem href="/co-po-mapping" icon={PieChart} label="CO-PO Mapping" />
            <NavItem href="/po-attainment" icon={Award} label="PO Attainment" />
          </ul>

          <SectionTitle>Accreditation & Reports</SectionTitle>
          <ul className="space-y-1">
            <NavItem href="/reports" icon={FileText} label="Reports & SSR" />
            <NavItem href="/accreditation/criteria" icon={ShieldCheck} label="Criteria framework" />
            <NavItem href="/accreditation/evidence" icon={FileText} label="Evidence & Documents" />
            <NavItem href="/accreditation/compliance" icon={Target} label="Compliance Tracker" />
          </ul>

          <SectionTitle>Administration</SectionTitle>
          <ul className="space-y-1 pb-4">
            <NavItem href="/users" icon={Users} label="User Management" />
            <NavItem href="/settings" icon={Settings} label="System Settings" />
            <NavItem href="/activity-logs" icon={Activity} label="Activity Logs" />
          </ul>
        </nav>
      </div>
    </aside>
  );
};
