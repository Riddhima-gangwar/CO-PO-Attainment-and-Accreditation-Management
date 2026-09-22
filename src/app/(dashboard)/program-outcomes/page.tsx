'use client';

import React, { useState, useEffect } from 'react';
import { ProgramOutcome } from '@/data/mockData';
import { outcomeService } from '@/services/outcomeService';
import { POList } from '@/components/outcomes/POList';
import { Award, Info } from 'lucide-react';

export default function ProgramOutcomesPage() {
  const [pos, setPos] = useState<ProgramOutcome[]>([]);

  useEffect(() => {
    outcomeService.getPOs().then((data) => setPos(data));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Program Outcomes (PO)
          </h1>
          <p className="text-gray-500 mt-1">
            Standard Graduate Attributes defined by the National Board of Accreditation (NBA)
          </p>
        </div>
      </div>

      {/* Information Banner */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-800">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">NBA Graduate Attributes Framework</p>
          <p className="text-xs text-blue-700/90 mt-0.5 leading-relaxed">
            Program Outcomes PO1 through PO12 define the knowledge, skills, and attitudes that students
            must possess upon graduation from an accredited engineering program. Course outcomes are
            mapped against these POs to derive cumulative program attainment.
          </p>
        </div>
      </div>

      {/* PO Grid */}
      <POList pos={pos} />
    </div>
  );
}
