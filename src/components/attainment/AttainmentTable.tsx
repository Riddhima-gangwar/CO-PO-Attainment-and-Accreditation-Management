'use client';

import React from 'react';
import { COAttainmentData } from '@/data/mockData';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface AttainmentTableProps {
  data: COAttainmentData[];
}

export const AttainmentTable: React.FC<AttainmentTableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Direct & Indirect CO Attainment</h3>
          <p className="text-xs text-gray-500">
            Formulation: 80% Direct CIE/SEE Assessment + 20% Course Exit Survey
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <th className="py-3 px-4 font-bold text-gray-800">CO Code</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Outcome Statement</th>
              <th className="py-3 px-3 font-semibold text-gray-700 text-center">Target (%)</th>
              <th className="py-3 px-3 font-semibold text-gray-700 text-center">Direct (80%)</th>
              <th className="py-3 px-3 font-semibold text-gray-700 text-center">Indirect (20%)</th>
              <th className="py-3 px-3 font-semibold text-gray-700 text-center">Overall (%)</th>
              <th className="py-3 px-3 font-semibold text-gray-700 text-center">NBA Level</th>
              <th className="py-3 px-4 font-semibold text-gray-700 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-3 px-4 font-bold text-blue-700">{row.coCode}</td>
                <td className="py-3 px-4 text-gray-700 max-w-sm truncate">{row.statement}</td>
                <td className="py-3 px-3 text-center text-gray-600 font-medium">
                  {row.targetPercent}%
                </td>
                <td className="py-3 px-3 text-center text-gray-800">{row.directScore}%</td>
                <td className="py-3 px-3 text-center text-gray-800">{row.indirectScore}%</td>
                <td className="py-3 px-3 text-center font-bold text-gray-900">
                  {row.overallAttainment}%
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    Level {row.attainmentLevel}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      row.status === 'Met'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {row.status === 'Met' ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
