'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { attainmentService } from '@/services/attainmentService';
import { Award, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';
export default function POAttainmentPage() {
    const [poList, setPoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchPOData = () => {
        setLoading(true);
        attainmentService
            .getPOAttainment('prog-btech-cse')
            .then((data) => setPoList(data))
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchPOData();
    }, []);
    const metCount = poList.filter((p) => p.status === 'Met').length;
    const unmetCount = poList.filter((p) => p.status === 'Unmet').length;
    const avgAttainment = poList.length > 0
        ? Math.round((poList.reduce((sum, p) => sum + p.overallAttainment, 0) / poList.length) * 100) / 100
        : 0;
    return (<div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Program Outcome (PO) Attainment
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              NBA Criteria 3.3
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Weighted aggregation of Course Outcome attainments across all curriculum courses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchPOData} className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-lg shadow-2xs hover:bg-gray-50" title="Refresh Attainment">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/>
          </button>
          <Link href="/reports" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm flex items-center gap-1.5">
            Export SSR Table <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Average PO Attainment
            </span>
            <Award className="w-5 h-5 text-blue-600"/>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">{avgAttainment} / 3.0</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            +0.14 above institutional baseline (2.3)
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Target Achieved (Met)
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600"/>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{metCount} POs</div>
          <div className="text-xs text-gray-500 font-medium mt-1">
            Satisfying NBA graduate threshold
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Continuous Improvement (CQI)
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-500"/>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{unmetCount} Areas</div>
          <div className="text-xs text-gray-500 font-medium mt-1">
            Action plan required from faculty coordinators
          </div>
        </div>
      </div>

      {/* PO Attainment Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600"/> Graduate Attribute Attainment Matrix (Batch 2023-2027)
          </h2>
          <span className="text-xs text-gray-500 font-mono">Formula: Σ(CO × Level) / Σ(Level)</span>
        </div>

        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Outcome Identifier</th>
              <th className="px-6 py-3.5">Graduate Attribute Statement</th>
              <th className="px-6 py-3.5 text-center">Target (1-3)</th>
              <th className="px-6 py-3.5 text-center">Direct (80%)</th>
              <th className="px-6 py-3.5 text-center">Indirect (20%)</th>
              <th className="px-6 py-3.5 text-center">Overall</th>
              <th className="px-6 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {poList.map((p) => {
            const isMet = p.status === 'Met';
            return (<tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 text-xs">
                      {p.poCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-xs">{p.title}</div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div className={`h-full rounded-full ${isMet ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, (p.overallAttainment / 3.0) * 100)}%` }}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-600 text-xs">
                    {p.targetScore.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-700 font-medium">
                    {p.directAttainment.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-700 font-medium">
                    {p.indirectAttainment.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900 text-xs">
                    {p.overallAttainment.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${isMet
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {isMet ? <CheckCircle2 className="w-3 h-3"/> : <AlertTriangle className="w-3 h-3"/>}
                      {p.status}
                    </span>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>

      {/* Navigation footer */}
      <div className="flex items-center justify-between pt-2">
        <Link href="/co-attainment" className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4"/> Back to CO Attainment
        </Link>
        <Link href="/reports" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5">
          Proceed to SSR Reports <ArrowRight className="w-4 h-4"/>
        </Link>
      </div>
    </div>);
}
