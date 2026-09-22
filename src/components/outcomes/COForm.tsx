'use client';

import React, { useState } from 'react';
import { CourseOutcome } from '@/data/mockData';
import { Plus, X } from 'lucide-react';

interface COFormProps {
  courseId: string;
  nextCoNumber: number;
  onSubmit: (co: Omit<CourseOutcome, 'id'>) => void;
  onCancel: () => void;
}

export const COForm: React.FC<COFormProps> = ({
  courseId,
  nextCoNumber,
  onSubmit,
  onCancel,
}) => {
  const [code, setCode] = useState(`CO${nextCoNumber}`);
  const [statement, setStatement] = useState('');
  const [bloomLevel, setBloomLevel] = useState<CourseOutcome['bloomLevel']>('Apply');
  const [targetAttainment, setTargetAttainment] = useState(70);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) return;

    onSubmit({
      courseId,
      code: code.trim().toUpperCase(),
      statement: statement.trim(),
      bloomLevel,
      targetAttainment: Number(targetAttainment),
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Define Course Outcome</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Outcome Code
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Bloom's Taxonomy Level
            </label>
            <select
              value={bloomLevel}
              onChange={(e) => setBloomLevel(e.target.value as CourseOutcome['bloomLevel'])}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Remember">Remember (L1)</option>
              <option value="Understand">Understand (L2)</option>
              <option value="Apply">Apply (L3)</option>
              <option value="Analyze">Analyze (L4)</option>
              <option value="Evaluate">Evaluate (L5)</option>
              <option value="Create">Create (L6)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Target Attainment Threshold (%)
            </label>
            <input
              type="number"
              min={30}
              max={100}
              value={targetAttainment}
              onChange={(e) => setTargetAttainment(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Course Outcome Statement *
          </label>
          <textarea
            rows={3}
            required
            placeholder="e.g. Design and evaluate multi-threaded client-server communication models using socket APIs..."
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Save Course Outcome
          </button>
        </div>
      </form>
    </div>
  );
};
