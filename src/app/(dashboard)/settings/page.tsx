'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Database, Shield, Sliders, Calendar } from 'lucide-react';

export default function SettingsPage() {
  const [directWeightage, setDirectWeightage] = useState(80);
  const [indirectWeightage, setIndirectWeightage] = useState(20);
  const [targetStudentPercent, setTargetStudentPercent] = useState(60);
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [semesterCycle, setSemesterCycle] = useState('Odd Semester (Autumn)');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
              Institutional Parameters
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Configure institutional attainment calculation formulas, NBA grading thresholds, and database parameters
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Settings updated
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Attainment Calculation Formula Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <Sliders className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-gray-900">OBE Attainment Calculation Formula</h2>
              <p className="text-xs text-gray-500">Configure direct assessment vs indirect exit survey proportions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Direct Assessment Weightage (%)
              </label>
              <input
                type="number"
                min="50"
                max="90"
                value={directWeightage}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDirectWeightage(val);
                  setIndirectWeightage(100 - val);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">NBA recommended standard: 80%</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Indirect Survey Weightage (%)
              </label>
              <input
                type="number"
                min="10"
                max="50"
                value={indirectWeightage}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setIndirectWeightage(val);
                  setDirectWeightage(100 - val);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Course Exit & Employer Surveys: 20%</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Student Passing Benchmark (%)
              </label>
              <input
                type="number"
                min="40"
                max="80"
                value={targetStudentPercent}
                onChange={(e) => setTargetStudentPercent(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Minimum marks required for a student to achieve attainment
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                NBA Rubric Level Mapping
              </label>
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
                <div>Level 3: &ge; 70% students score &ge; benchmark</div>
                <div>Level 2: 60% &ndash; 69% students</div>
                <div>Level 1: 50% &ndash; 59% students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Calendar Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-gray-900">Academic Calendar Cycle</h2>
              <p className="text-xs text-gray-500">Active evaluation cycle for current batch attainment calculations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="2025-2026">2025-2026 (Active Offering)</option>
                <option value="2024-2025">2024-2025 (Audit Archive)</option>
                <option value="2023-2024">2023-2024 (Historical Data)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Term</label>
              <select
                value={semesterCycle}
                onChange={(e) => setSemesterCycle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Odd Semester (Autumn)">Odd Semester (Autumn: Semesters 1, 3, 5, 7)</option>
                <option value="Even Semester (Spring)">Even Semester (Spring: Semesters 2, 4, 6, 8)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database & Security Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
            <Database className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-gray-900">Database & Security Configuration</h2>
              <p className="text-xs text-gray-500">Active persistence engine and session parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-gray-400 block font-semibold mb-0.5">MongoDB URI</span>
              <code className="text-emerald-700 font-mono font-bold">mongodb://localhost:27017/outcome360</code>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-gray-400 block font-semibold mb-0.5">Session Security</span>
              <span className="text-gray-800 font-semibold">HMAC-SHA256 JWT (24-Hour Expiry)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-xs shadow-sm flex items-center gap-2 shadow-blue-500/20"
          >
            <Save className="w-4 h-4" /> Save Configuration Parameters
          </button>
        </div>
      </form>
    </div>
  );
}
