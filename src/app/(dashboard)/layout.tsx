'use client';

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
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const NavItem = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
    const active = isActive(href);
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
          <Icon className={`mr-3 h-5 w-5 transition-colors ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
          {label}
        </Link>
      </li>
    );
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">
      {children}
    </h3>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">Outcome360</span>
          </div>
        </div>
        
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

            <SectionTitle>Accreditation</SectionTitle>
            <ul className="space-y-1">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96 hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                placeholder="Search programs, courses, or outcomes..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              <Bell className="h-5 w-5" />
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 group-hover:ring-2 group-hover:ring-blue-500 group-hover:ring-offset-2 transition-all">
                AD
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Admin User</p>
                <p className="text-gray-500 text-xs">Accreditation Head</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
