'use client';

import React from 'react';
import Link from 'next/link';
import { Target, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';

interface MilestoneItem {
  id: string;
  criterion: string;
  item: string;
  responsible: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Action Required';
  progress: number;
}

const MILESTONES: MilestoneItem[] = [
  {
    id: 'm1',
    criterion: 'Criterion 3',
    item: 'Course Outcomes formulated for all 24 department courses with Bloom levels',
    responsible: 'Faculty Coordinators',
    dueDate: '2026-09-30',
    status: 'Completed',
    progress: 100,
  },
  {
    id: 'm2',
    criterion: 'Criterion 3',
    item: 'CO-PO correlation matrices established with standard 1, 2, 3 scale',
    responsible: 'Course Instructors',
    dueDate: '2026-10-15',
    status: 'Completed',
    progress: 100,
  },
  {
    id: 'm3',
    criterion: 'Criterion 3',
    item: 'Direct (80%) CIE assessment marks ingested and mapped to questions',
    responsible: 'Exam Committee',
    dueDate: '2026-11-10',
    status: 'Completed',
    progress: 95,
  },
  {
    id: 'm4',
    criterion: 'Criterion 3',
    item: 'Course exit survey indirect attainment calculation (20%)',
    responsible: 'IQAC Cell',
    dueDate: '2026-11-25',
    status: 'In Progress',
    progress: 75,
  },
  {
    id: 'm5',
    criterion: 'Criterion 4',
    item: 'Graduating batch placement and higher education evidence consolidation',
    responsible: 'Training & Placement Officer',
    dueDate: '2026-12-05',
    status: 'Action Required',
    progress: 40,
  },
  {
    id: 'm6',
    criterion: 'Criterion 2',
    item: 'Digital Course File binders compiled with sample evaluated scripts',
    responsible: 'All Faculty',
    dueDate: '2026-12-15',
    status: 'In Progress',
    progress: 80,
  },
];

export default function ComplianceTrackerPage() {
  const completedCount = MILESTONES.filter((m) => m.status === 'Completed').length;
  const inProgressCount = MILESTONES.filter((m) => m.status === 'In Progress').length;
  const actionRequiredCount = MILESTONES.filter((m) => m.status === 'Action Required').length;
  const overallCompliance = Math.round(
    (MILESTONES.reduce((sum, m) => sum + m.progress, 0) / (MILESTONES.length * 100)) * 100
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Compliance Tracker</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              SSR Timeline
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Track NBA Self-Study Report (SSR) milestone progress and audit deliverables
          </p>
        </div>

        <Link
          href="/reports"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm flex items-center gap-1.5"
        >
          <FileCheck className="w-4 h-4" /> Download Compliance Summary
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Overall Readiness
          </span>
          <div className="text-2xl font-black text-gray-900 mt-1">{overallCompliance}%</div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${overallCompliance}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Completed Tasks
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount} Deliverables</div>
          <p className="text-[11px] text-gray-400 mt-1">Verified with evidence artifacts</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            In Progress
          </span>
          <div className="text-2xl font-black text-blue-600 mt-1">{inProgressCount} Items</div>
          <p className="text-[11px] text-gray-400 mt-1">Under active coordinator review</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Remediation Required
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">{actionRequiredCount} Action Items</div>
          <p className="text-[11px] text-gray-400 mt-1">Immediate follow-up required</p>
        </div>
      </div>

      {/* Milestones Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Criterion</th>
              <th className="px-6 py-3.5">Deliverable / Compliance Item</th>
              <th className="px-6 py-3.5">Stakeholder</th>
              <th className="px-6 py-3.5">Due Date</th>
              <th className="px-6 py-3.5 text-center">Progress</th>
              <th className="px-6 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {MILESTONES.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {m.criterion}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900 text-xs">{m.item}</div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">{m.responsible}</td>
                <td className="px-6 py-4 text-xs font-mono text-gray-500">{m.dueDate}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-gray-800">{m.progress}%</span>
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          m.progress === 100
                            ? 'bg-emerald-500'
                            : m.progress >= 70
                            ? 'bg-blue-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${m.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      m.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : m.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {m.status === 'Completed' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : m.status === 'In Progress' ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
