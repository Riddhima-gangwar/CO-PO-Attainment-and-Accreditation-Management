'use client';

import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

interface NavbarProps {
  userName?: string;
  userRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName = 'Admin User',
  userRole = 'Accreditation Head',
}) => {
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
      <div className="flex items-center space-x-6">
        <button
          aria-label="Notifications"
          className="relative text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          <Bell className="h-5 w-5" />
        </button>

        <div className="h-6 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 group-hover:ring-2 group-hover:ring-blue-500 group-hover:ring-offset-2 transition-all">
            AD
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {userName}
            </p>
            <p className="text-gray-500 text-xs">{userRole}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
        </div>
      </div>
    </header>
  );
};
