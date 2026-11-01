'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
export default function CriteriaFrameworkPage() {
    const [criteria, setCriteria] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch('/api/accreditation')
            .then((res) => res.json())
            .then((data) => {
            if (data.data)
                setCriteria(data.data);
            if (data.summary)
                setSummary(data.summary);
        })
            .finally(() => setLoading(false));
    }, []);
    return (<div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              NBA Criteria Framework
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              Tier-I SSR Manual
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Monitor compliance scoring across all 9 National Board of Accreditation evaluated criteria
          </p>
        </div>

        <Link href="/reports" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm flex items-center gap-1.5">
          <FileText className="w-4 h-4"/> Generate SSR Document
        </Link>
      </div>

      {/* Summary KPI Banner */}
      {summary && (<div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Accreditation Readiness Overview
            </span>
            <h2 className="text-2xl font-black mt-1">
              Score: {summary.totalAttainedMarks} / {summary.totalMaxMarks} ({summary.overallPercentage}%)
            </h2>
            <p className="text-xs text-blue-200 mt-1">
              Status: <strong className="text-emerald-300 font-bold">{summary.readinessStatus}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/accreditation/evidence" className="px-4 py-2.5 bg-white text-blue-900 rounded-xl font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm">
              Inspect Evidence Binders &rarr;
            </Link>
          </div>
        </div>)}

      {/* Criteria Breakdown Grid */}
      <div className="space-y-4">
        {criteria.map((c) => {
            const isCompliant = c.status === 'Compliant';
            return (<div key={c.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0">
                    C{c.criterionNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-400">{c.code}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isCompliant
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {isCompliant ? <CheckCircle2 className="w-3 h-3"/> : <AlertTriangle className="w-3 h-3"/>}
                        {c.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mt-1">{c.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{c.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-gray-900">
                    {c.attainedMarks} <span className="text-xs text-gray-400">/ {c.maxMarks}</span>
                  </div>
                  <div className="text-xs font-bold text-blue-600 mt-0.5">{c.percentageScore}% Scored</div>
                </div>
              </div>
            </div>);
        })}
      </div>
    </div>);
}
