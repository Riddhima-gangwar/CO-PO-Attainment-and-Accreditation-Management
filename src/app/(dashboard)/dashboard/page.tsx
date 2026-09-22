'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
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
            href="/courses"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium text-sm shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-1.5"
          >
            Manage Courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Primary Clickable Workflow Quickstart Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-md shadow-blue-600/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Week 5 Interactive Evaluation
            </span>
            <span className="text-xs text-blue-100 font-medium">Demonstration Walkthrough</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1.5">
            Primary Outcome-Based Education (OBE) Workflow
          </h2>
          <p className="text-xs text-blue-100 max-w-2xl mt-0.5 leading-relaxed">
            Follow the guided workflow: <strong>Courses</strong> &rarr; <strong>Course Outcomes</strong> &rarr; <strong>CO-PO Mapping</strong> &rarr; <strong>CO Attainment</strong> &rarr; <strong>Accreditation Reports</strong>.
          </p>
        </div>

        <Link
          href="/courses"
          className="px-4 py-2.5 bg-white text-blue-700 rounded-lg font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
        >
          Launch Workflow &rarr;
        </Link>
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
        <AttainmentTrendChart />
        <ActivityFeed />
      </div>
    </div>
  );
}
