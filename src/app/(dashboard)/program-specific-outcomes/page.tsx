'use client';

import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle2, Award, Info, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PSOItem {
  id: string;
  code: string;
  title: string;
  statement: string;
  targetScore: number;
}

export default function ProgramSpecificOutcomesPage() {
  const { role } = useAuth();
  const [psos, setPsos] = useState<PSOItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [code, setCode] = useState('PSO3');
  const [title, setTitle] = useState('');
  const [statement, setStatement] = useState('');
  const [targetScore, setTargetScore] = useState(2.5);
  const [submitting, setSubmitting] = useState(false);

  const fetchPSOs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pso');
      const data = await res.json();
      if (data.data) setPsos(data.data);
    } catch (err) {
      console.warn('Failed to fetch PSOs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPSOs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/pso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, title, statement, targetScore }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create PSO');
      }
      setIsModalOpen(false);
      setTitle('');
      setStatement('');
      fetchPSOs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isHodOrAdmin = role === 'HOD' || role === 'Admin';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Program Specific Outcomes (PSO)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
              Discipline Specific
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Department-tailored outcomes describing skills specific to Computer Science & Engineering
          </p>
        </div>

        {isHodOrAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Formulate PSO
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-800">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">NBA Criteria 3.1 & 3.2: Departmental PSOs</p>
          <p className="text-xs text-blue-700/90 mt-0.5 leading-relaxed">
            While PO1-PO12 apply universally to all engineering graduates, PSOs define specialized competencies
            required for Computer Science graduates, such as cloud system architectures and algorithmic engineering.
          </p>
        </div>
      </div>

      {/* PSO Cards List */}
      <div className="space-y-4">
        {psos.map((pso) => (
          <div
            key={pso.id}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-sm shrink-0">
                  {pso.code}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{pso.title}</h3>
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{pso.statement}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-gray-400 block font-semibold uppercase">Target Attainment</span>
                <span className="text-xl font-extrabold text-blue-600">{pso.targetScore.toFixed(1)} / 3.0</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Formulate New PSO</h2>
            <p className="text-xs text-gray-500 mb-4">
              Define a program-specific graduate competency for this engineering branch
            </p>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">PSO Identifier</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. PSO3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Short Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cyber Security & Cryptographic Protocols"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Outcome Statement</label>
                <textarea
                  required
                  rows={3}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Describe measurable skills and behaviors..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Score (1.0 to 3.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="3"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save PSO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
