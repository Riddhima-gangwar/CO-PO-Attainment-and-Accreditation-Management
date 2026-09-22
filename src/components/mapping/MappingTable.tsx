'use client';

import React from 'react';
import { CourseOutcome, ProgramOutcome } from '@/data/mockData';

interface MappingTableProps {
  cos: CourseOutcome[];
  pos: ProgramOutcome[];
  mappings: Record<string, number>;
  onCellClick: (coId: string, poId: string) => void;
}

export const MappingTable: React.FC<MappingTableProps> = ({
  cos,
  pos,
  mappings,
  onCellClick,
}) => {
  // Calculate average correlation per PO
  const calculatePOAverage = (poId: string) => {
    let sum = 0;
    let count = 0;
    cos.forEach((co) => {
      const val = mappings[`${co.id}_${poId}`] || 0;
      if (val > 0) {
        sum += val;
        count++;
      }
    });
    return count > 0 ? (sum / count).toFixed(2) : '-';
  };

  const getScoreBadge = (score: number) => {
    switch (score) {
      case 3:
        return 'bg-blue-600 text-white font-bold';
      case 2:
        return 'bg-blue-100 text-blue-800 font-semibold';
      case 1:
        return 'bg-gray-100 text-gray-700 font-medium';
      default:
        return 'bg-transparent text-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <th className="py-3 px-4 text-left font-bold text-gray-800 min-w-[200px]">
                Course Outcomes (CO)
              </th>
              {pos.map((po) => (
                <th
                  key={po.id}
                  className="py-3 px-2 font-semibold text-gray-700 min-w-[50px] border-l border-gray-100"
                  title={`${po.code}: ${po.title}`}
                >
                  {po.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cos.map((co) => (
              <tr key={co.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="py-3 px-4 text-left font-medium text-gray-800 flex items-center justify-between">
                  <span className="font-bold text-blue-700">{co.code}</span>
                  <span className="text-[10px] text-gray-400 max-w-[140px] truncate ml-2">
                    {co.statement}
                  </span>
                </td>

                {pos.map((po) => {
                  const key = `${co.id}_${po.id}`;
                  const score = mappings[key] || 0;

                  return (
                    <td key={po.id} className="py-2 px-1 border-l border-gray-100">
                      <button
                        type="button"
                        onClick={() => onCellClick(co.id, po.id)}
                        className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all cursor-pointer hover:ring-2 hover:ring-blue-400 ${getScoreBadge(
                          score
                        )}`}
                        title={`Click to cycle correlation (Current: ${score || 'None'})`}
                      >
                        {score > 0 ? score : '—'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Average Correlation Row */}
            <tr className="bg-gray-50/80 font-bold border-t-2 border-gray-200 text-gray-800">
              <td className="py-3 px-4 text-left">Average PO Correlation</td>
              {pos.map((po) => (
                <td key={po.id} className="py-3 px-1 border-l border-gray-100 text-blue-700">
                  {calculatePOAverage(po.id)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Matrix Correlation Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">Correlation Scale:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
              3
            </span>
            <span>High (Substantial)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-blue-100 text-blue-800 font-semibold flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Medium (Moderate)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-gray-100 text-gray-700 font-medium flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Low (Slight)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-bold text-sm">—</span>
            <span>No Correlation (0)</span>
          </div>
        </div>

        <span className="text-gray-400 text-[11px]">
          * Click any cell to cycle through correlation levels (0 → 1 → 2 → 3 → 0)
        </span>
      </div>
    </div>
  );
};
