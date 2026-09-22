'use client';

import React, { useState, useEffect } from 'react';
import { ReportItem } from '@/data/mockData';
import { attainmentService } from '@/services/attainmentService';
import { ReportTable } from '@/components/reports/ReportTable';
import { FileText, Plus, ShieldCheck } from 'lucide-react';

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
    </div>
  );
}
