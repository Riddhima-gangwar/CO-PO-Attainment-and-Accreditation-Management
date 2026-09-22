'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { AttainmentTrendChart } from '@/components/dashboard/AttainmentTrendChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Overview</h1>
          <p className="text-gray-500 mt-1">Monitor attainment metrics and accreditation status</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link
            href="/reports"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Download Report
          </Link>
          <Link
            href="/co-po-mapping"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium text-sm shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Generate Mapping
          </Link>
        </div>
      </div>

      {/* Modular KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Programs"
          value="12"
          change="14%"
          changeType="positive"
          timeframe="from last semester"
          icon={GraduationCap}
          colorScheme="blue"
        />

        <KPICard
          title="Total Students"
          value="3,492"
          change="5%"
          changeType="positive"
          timeframe="from last year"
          icon={Users}
          colorScheme="indigo"
        />

        <KPICard
          title="Avg PO Attainment"
          value="76.4%"
          change="2.1%"
          changeType="positive"
          timeframe="across all branches"
          icon={BarChart3}
          colorScheme="emerald"
        />

        <KPICard
          title="Accreditation Readiness"
          value="82%"
          change="In Progress"
          changeType="neutral"
          timeframe="3 pending items"
          icon={CheckCircle2}
          colorScheme="amber"
        />
      </div>

      {/* Main Content Area: Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attainment Trend Chart Component */}
        <AttainmentTrendChart />

        {/* Activity & Action Items Component */}
        <ActivityFeed />
      </div>
    </div>
  );
}
