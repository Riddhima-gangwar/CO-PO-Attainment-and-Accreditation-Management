'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReportItem } from '@/data/mockData';
import { attainmentService } from '@/services/attainmentService';
import { ReportTable } from '@/components/reports/ReportTable';
import { FileText, Plus, ShieldCheck, CheckCircle2, LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    attainmentService.getReports().then((data) => setReports(data));
  }, []);

  const filteredReports =
    selectedType === 'All'
      ? reports
      : reports.filter((r) => r.type.toLowerCase().includes(selectedType.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Accreditation Reports & SSR
          </h1>
          <p className="text-gray-500 mt-1">
            Export outcome attainment registers, criterion evidence bundles, and compliance tables
          </p>
        </div>

        <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium flex items-center gap-2 shadow-blue-500/20">
          <Plus className="h-4 w-4" /> Generate New Report
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 text-sm">
        {['All', 'NBA SSR', 'Attainment Register', 'Course Exit Survey'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedType(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedType === tab
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Report Manifest Component */}
      <ReportTable reports={filteredReports} />

      {/* Primary Workflow Completion Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Primary OBE Workflow Completed
          </div>
          <h3 className="text-sm font-bold text-gray-900 mt-1">Accreditation Evidence Ready</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            You have traversed the complete outcome cycle: <strong>Courses &rarr; Outcomes &rarr; Mapping &rarr; Attainment &rarr; Reports</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/co-attainment"
            className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Attainment
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
