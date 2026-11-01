'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, CheckCircle2, Search, Filter, Upload, Download, Tag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface EvidenceItem {
  id: string;
  criterionId: string;
  courseId: string;
  title: string;
  category: string;
  uploadedBy: string;
  academicYear: string;
  fileSize: string;
  status: string;
  complianceScore: number;
}

export default function EvidencePage() {
  const { user } = useAuth();
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Question Paper');
  const [submitting, setSubmitting] = useState(false);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/evidence');
      const data = await res.json();
      if (data.data) setEvidenceList(data.data);
    } catch (err) {
      console.warn('Failed to fetch evidence:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          courseId: 'crs-1',
          criterionId: 'crit-3',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed');
      setIsModalOpen(false);
      setTitle('');
      fetchEvidence();
    } catch (err: unknown) {
      alert('Error uploading evidence');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredList =
    categoryFilter === 'All'
      ? evidenceList
      : evidenceList.filter((e) => e.category === categoryFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Evidence & Course File Binders
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Audit Readiness
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Maintain digital verification artifacts for NBA & NAAC peer team inspections
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4" /> Upload Evidence
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
        {['All', 'Question Paper', 'Answer Script', 'Rubric Evaluation', 'Course File', 'Exit Survey'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Evidence Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Document Title</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Academic Year</th>
              <th className="px-6 py-3.5">Uploaded By</th>
              <th className="px-6 py-3.5 text-center">Score</th>
              <th className="px-6 py-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredList.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{doc.title}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 block mt-0.5 ml-6">{doc.fileSize}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                    {doc.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-600">{doc.academicYear}</td>
                <td className="px-6 py-4 text-xs text-gray-600 font-medium">{doc.uploadedBy}</td>
                <td className="px-6 py-4 text-center font-bold text-xs text-blue-700">
                  {doc.complianceScore}%
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> {doc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Upload Evidence Artifact</h2>
            <p className="text-xs text-gray-500 mb-4">
              Add verification document to NBA Criterion 3 course binder
            </p>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. End Semester Exam Evaluated Scripts - High Band"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Evidence Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="Question Paper">Question Paper with Mapping</option>
                  <option value="Answer Script">Evaluated Answer Scripts</option>
                  <option value="Rubric Evaluation">Rubric Evaluation Sheet</option>
                  <option value="Course File">Comprehensive Course File</option>
                  <option value="Exit Survey">Course Exit Feedback Survey</option>
                </select>
              </div>

              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-500">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="font-semibold text-gray-700">Digital Attachment Simulation</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Metadata and verification score persist in MongoDB</p>
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
                  {submitting ? 'Registering...' : 'Register Evidence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
