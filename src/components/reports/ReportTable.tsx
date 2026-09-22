'use client';

import React from 'react';
import { ReportItem } from '@/data/mockData';
import { ReportDownload } from './ReportDownload';
import { FileText, Calendar, Building } from 'lucide-react';

interface ReportTableProps {
  reports: ReportItem[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ reports }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Accreditation Document Manifest</h3>
        <span className="text-xs text-gray-500">{reports.length} generated documents</span>
      </div>

      <div className="divide-y divide-gray-100">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900">{report.title}</h4>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                    {report.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" /> {report.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Cycle: {report.academicYear}
                  </span>
                  <span>Size: {report.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  report.status === 'Ready'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {report.status}
              </span>
              <ReportDownload reportTitle={report.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
