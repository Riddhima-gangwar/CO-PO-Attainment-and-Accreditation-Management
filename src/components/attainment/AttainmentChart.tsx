'use client';

import React from 'react';
import { COAttainmentData } from '@/data/mockData';
import { BarChart3 } from 'lucide-react';

interface AttainmentChartProps {
  data: COAttainmentData[];
}

export const AttainmentChart: React.FC<AttainmentChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">Target vs. Attained Performance</h3>
          <p className="text-xs text-gray-500">Visual attainment comparison per Course Outcome</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block"></span>
            <span>Attained Overall (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gray-200 inline-block"></span>
            <span>Target Threshold (%)</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const isMet = item.overallAttainment >= item.targetPercent;

          return (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-800">{item.coCode}</span>
                <span className="text-gray-500">
                  Attained: <strong>{item.overallAttainment}%</strong> / Target: {item.targetPercent}%
                </span>
              </div>

              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                  style={{ left: `${item.targetPercent}%` }}
                ></div>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isMet
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      : 'bg-gradient-to-r from-rose-400 to-rose-500'
                  }`}
                  style={{ width: `${item.overallAttainment}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
