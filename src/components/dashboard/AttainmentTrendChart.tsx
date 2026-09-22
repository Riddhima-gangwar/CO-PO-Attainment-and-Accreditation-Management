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
    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Program Attainment Trends</h2>
          <p className="text-sm text-gray-500">Comparing PO attainment across departments</p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 block p-2"
        >
          <option>Last 4 Semesters</option>
          <option>Last Year</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Visual Chart Bars */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-end gap-6 text-xs text-gray-500 pb-2 border-b border-gray-100">
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
                <span className="font-medium text-gray-800">
                  {dept.name} <span className="text-xs text-gray-400">({dept.code})</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Target: {dept.target}%</span>
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
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
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
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500'
                  }`}
                  style={{ width: `${dept.attained}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Footer Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
          Average Institutional Attainment: <strong>72.4%</strong>
        </span>
        <span>NBA Benchmark Threshold: 60.0%</span>
      </div>
    </div>
  );
};
