'use client';

import React from 'react';
import { ProgramOutcome } from '@/data/mockData';
import { Award, Target } from 'lucide-react';

interface POListProps {
  pos: ProgramOutcome[];
}

export const POList: React.FC<POListProps> = ({ pos }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {pos.map((po) => (
        <div
          key={po.id}
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs border border-indigo-100">
                  {po.code}
                </span>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{po.title}</h3>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-600 leading-relaxed font-normal">
              {po.statement}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-indigo-600" /> Target Level
            </span>
            <span className="font-semibold text-gray-900">{po.targetScore} / 3.0</span>
          </div>
        </div>
      ))}
    </div>
  );
};
