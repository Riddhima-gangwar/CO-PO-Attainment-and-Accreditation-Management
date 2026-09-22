'use client';

import React from 'react';
import { CourseOutcome } from '@/data/mockData';
import { Target, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';

interface COCardProps {
  co: CourseOutcome;
  onDelete?: (id: string) => void;
}

const bloomColors: Record<string, string> = {
  Remember: 'bg-purple-50 text-purple-700 border-purple-200',
  Understand: 'bg-blue-50 text-blue-700 border-blue-200',
  Apply: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Analyze: 'bg-amber-50 text-amber-700 border-amber-200',
  Evaluate: 'bg-rose-50 text-rose-700 border-rose-200',
  Create: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export const COCard: React.FC<COCardProps> = ({ co, onDelete }) => {
  const isTargetMet =
    co.actualAttainment !== undefined && co.actualAttainment >= co.targetAttainment;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
            {co.code}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
              bloomColors[co.bloomLevel] || 'bg-gray-50 text-gray-700'
            }`}
          >
            Bloom's: {co.bloomLevel}
          </span>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(co.id)}
            className="text-gray-400 hover:text-rose-600 p-1 rounded hover:bg-gray-50"
            title="Delete CO"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-700 leading-relaxed font-normal">
        {co.statement}
      </p>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Target className="h-3.5 w-3.5 text-blue-600" />
          <span>Target Attainment: <strong>{co.targetAttainment}%</strong></span>
        </div>

        {co.actualAttainment !== undefined && (
          <div
            className={`flex items-center gap-1 font-semibold ${
              isTargetMet ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {isTargetMet ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
            <span>Attained: {co.actualAttainment}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
