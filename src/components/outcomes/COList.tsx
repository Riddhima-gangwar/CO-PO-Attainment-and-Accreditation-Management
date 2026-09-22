'use client';

import React from 'react';
import { CourseOutcome } from '@/data/mockData';
import { COCard } from './COCard';
import { Target } from 'lucide-react';

interface COListProps {
  cos: CourseOutcome[];
  onDeleteCO?: (id: string) => void;
}

export const COList: React.FC<COListProps> = ({ cos, onDeleteCO }) => {
  if (cos.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
        <Target className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-700">No Course Outcomes formulated yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Click "Define Course Outcome" above to add CO statements mapped to Bloom's taxonomy.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cos.map((co) => (
        <COCard key={co.id} co={co} onDelete={onDeleteCO} />
      ))}
    </div>
  );
};
