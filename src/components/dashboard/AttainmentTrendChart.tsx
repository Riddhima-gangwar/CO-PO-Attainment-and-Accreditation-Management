'use client';

import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface DepartmentTrend {
  code: string;
  name: string;
  target: number;
  attained: number;
}

const trendData: Record<string, DepartmentTrend[]> = {
  'Last 4 Semesters': [
    { code: 'CSE', name: 'Computer Science', target: 70, attained: 76.4 },
    { code: 'ECE', name: 'Electronics & Comm.', target: 70, attained: 72.1 },
    { code: 'MECH', name: 'Mechanical Eng.', target: 65, attained: 68.5 },
    { code: 'CIVIL', name: 'Civil Eng.', target: 65, attained: 63.2 },
  ],
  'Last Year': [
    { code: 'CSE', name: 'Computer Science', target: 70, attained: 74.8 },
    { code: 'ECE', name: 'Electronics & Comm.', target: 70, attained: 70.5 },
    { code: 'MECH', name: 'Mechanical Eng.', target: 65, attained: 67.0 },
    { code: 'CIVIL', name: 'Civil Eng.', target: 65, attained: 61.8 },
  ],
  'All Time': [
    { code: 'CSE', name: 'Computer Science', target: 70, attained: 75.2 },
    { code: 'ECE', name: 'Electronics & Comm.', target: 70, attained: 71.3 },
    { code: 'MECH', name: 'Mechanical Eng.', target: 65, attained: 66.8 },
    { code: 'CIVIL', name: 'Civil Eng.', target: 65, attained: 64.0 },
  ],
};

export const AttainmentTrendChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>('Last 4 Semesters');
  const departments = trendData[timeframe] || trendData['Last 4 Semesters'];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(13,27,46,0.12)] lg:col-span-2">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#10243A]">Program Attainment Trends</h2>
          <p className="text-sm text-slate-500">Comparing PO attainment across departments</p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="block rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700 focus:border-[#F6B85E] focus:ring-[#F6B85E]"
        >
          <option>Last 4 Semesters</option>
          <option>Last Year</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Visual Chart Bars */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-end gap-6 border-b border-slate-100 pb-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block"></span>
            <span>Attained Score (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-gray-200 inline-block"></span>
            <span>Target Threshold (%)</span>
          </div>
        </div>

        {departments.map((dept) => {
          const isTargetMet = dept.attained >= dept.target;

          return (
            <div key={dept.code} className="space-y-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-[#10243A]">
                  {dept.name} <span className="text-xs text-slate-400">({dept.code})</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Target: {dept.target}%</span>
                  <span
                    className={`font-semibold text-xs px-2 py-0.5 rounded-full ${
                      isTargetMet
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {dept.attained}% {isTargetMet ? '✓ Met' : '⚠ Action Req.'}
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="relative h-4 overflow-hidden rounded-full bg-slate-100">
                {/* Target Marker Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                  style={{ left: `${dept.target}%` }}
                  title={`Target: ${dept.target}%`}
                ></div>
                {/* Attained Bar */}
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isTargetMet
                      ? 'bg-gradient-to-r from-[#2E87C8] to-[#1D4E89]'
                      : 'bg-gradient-to-r from-[#F6B85E] to-[#E77B4D]'
                  }`}
                  style={{ width: `${dept.attained}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Footer Indicator */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <BarChart3 className="h-3.5 w-3.5 text-[#E77B4D]" />
          Average Institutional Attainment: <strong>72.4%</strong>
        </span>
        <span>NBA Benchmark Threshold: 60.0%</span>
      </div>
    </div>
  );
};
