'use client';

import React, { useState } from 'react';
import { Activity, Shield, Clock, Search, Filter, CheckCircle2, User, FileText } from 'lucide-react';

interface LogItem {
  id: string;
  action: string;
  entity: string;
  user: string;
  role: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Info';
  details: string;
}

const INITIAL_LOGS: LogItem[] = [
  {
    id: 'log-1',
    action: 'CO-PO Mapping Saved',
    entity: 'CS301 (Data Structures)',
    user: 'Dr. Sarah Jenkins',
    role: 'Faculty',
    timestamp: 'Just now',
    status: 'Success',
    details: 'Updated correlation matrix across PO1 through PO12',
  },
  {
    id: 'log-2',
    action: 'Direct Attainment Recalculated',
    entity: 'CO1 - CO5',
    user: 'System Attainment Engine',
    role: 'System',
    timestamp: '12 minutes ago',
    status: 'Success',
    details: 'Batch marks scored against >= 60% passing benchmark',
  },
  {
    id: 'log-3',
    action: 'Student Marks Ingestion',
    entity: 'CIE 1 Assessment',
    user: 'Dr. Sarah Jenkins',
    role: 'Faculty',
    timestamp: '25 minutes ago',
    status: 'Success',
    details: 'Ingested question-level scores for 8 enrolled students',
  },
  {
    id: 'log-4',
    action: 'NBA SSR Criterion 3 Generated',
    entity: 'Report Rep-1',
    user: 'Dr. Elena Torres',
    role: 'Accreditation',
    timestamp: '2 hours ago',
    status: 'Info',
    details: 'Generated Self-Study Report compliance package for CSE department',
  },
  {
    id: 'log-5',
    action: 'User Stakeholder Authenticated',
    entity: 'Session Auth',
    user: 'Dr. Robert Vance',
    role: 'HOD',
    timestamp: '4 hours ago',
    status: 'Success',
    details: 'Role token issued with 24-hour validity',
  },
  {
    id: 'log-6',
    action: 'Course Catalog Onboarded',
    entity: 'CS302 (DBMS)',
    user: 'Prof. Alex Richardson',
    role: 'Admin',
    timestamp: 'Yesterday at 16:30',
    status: 'Success',
    details: 'Registered 4-credit course in MongoDB catalog',
  },
];

export default function ActivityLogsPage() {
  const [logs] = useState<LogItem[]>(INITIAL_LOGS);
  const [search, setSearch] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entity.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Activity & Audit Logs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              NBA Traceability
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Complete immutable audit trail of OBE operations, marks ingestion, and accreditation activity
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Action & Event</th>
              <th className="px-6 py-3.5">Target Entity</th>
              <th className="px-6 py-3.5">Initiated By</th>
              <th className="px-6 py-3.5">Timestamp</th>
              <th className="px-6 py-3.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{log.action}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {log.entity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-semibold text-gray-800">{log.user}</div>
                  <span className="text-[10px] text-gray-400 font-medium">{log.role}</span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-gray-500 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4 text-xs text-gray-600 max-w-xs truncate">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
