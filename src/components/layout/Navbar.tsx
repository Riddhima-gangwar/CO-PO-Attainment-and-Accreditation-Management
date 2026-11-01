'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, LogOut, User as UserIcon, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/auth';

interface NavbarProps {
  userName?: string;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName: fallbackName,
  userRole: fallbackRole,
}) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeName = user?.name || fallbackName || 'Dr. Sarah Jenkins';
  const activeRole: UserRole = user?.role || (fallbackRole as UserRole) || 'Faculty';
  const activeDepartment = user?.department || 'Computer Science & Engineering';

  // Role color styles
  const roleStyles: Record<UserRole, { badge: string; avatar: string; border: string }> = {
    Admin: {
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      avatar: 'bg-purple-100 text-purple-700 border-purple-300',
      border: 'hover:ring-purple-500',
    },
    Faculty: {
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      avatar: 'bg-blue-100 text-blue-700 border-blue-300',
      border: 'hover:ring-blue-500',
    },
    HOD: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      avatar: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      border: 'hover:ring-emerald-500',
    },
    Accreditation: {
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      avatar: 'bg-amber-100 text-amber-700 border-amber-300',
      border: 'hover:ring-amber-500',
    },
  };

  const style = roleStyles[activeRole] || roleStyles.Faculty;

  // Extract initials
  const initials = activeName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Global Search */}
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

      {/* User Actions & Profile */}
      <div className="flex items-center space-x-5">
        {/* Role Badge Indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style.badge}`}>
            {activeRole}
          </span>
        </div>

        <button
          aria-label="Notifications"
          className="relative text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
        >
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          <Bell className="h-5 w-5" />
        </button>

        <div className="h-6 w-px bg-gray-200"></div>

        {/* User Profile Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none"
          >
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center font-bold border transition-all group-hover:ring-2 group-hover:ring-offset-2 ${style.avatar} ${style.border}`}
            >
              {initials}
            </div>
            <div className="hidden md:block text-left text-sm">
              <p className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors leading-tight">
                {activeName}
              </p>
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                <span>{activeRole}</span>
                <span>•</span>
                <span className="truncate max-w-[120px]">{activeDepartment}</span>
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200" />
          </button>

          {/* Popover Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                  Signed in as
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">{activeName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'faculty@outcome360.edu'}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${style.badge}`}>
                    Role: {activeRole}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/login"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                  Switch Role / Change User
                </Link>

                <Link
                  href="/users"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  <Shield className="w-4 h-4 mr-2 text-gray-400" />
                  Role-Based User Directory
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
