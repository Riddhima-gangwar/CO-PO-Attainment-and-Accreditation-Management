'use client';
import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
export default function ProgramsPage() {
    const { role } = useAuth();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Form state
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [degree, setDegree] = useState('B.Tech');
    const [intake, setIntake] = useState(120);
    const [departmentName, setDepartmentName] = useState('Computer Science & Engineering');
    const [submitting, setSubmitting] = useState(false);
    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/programs');
            const data = await res.json();
            if (data.data)
                setPrograms(data.data);
        }
        catch (err) {
            console.warn('Failed to fetch programs:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPrograms();
    }, []);
    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/programs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, name, degree, departmentName, intake }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to create program');
            }
            setIsModalOpen(false);
            setCode('');
            setName('');
            fetchPrograms();
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Error';
            alert(msg);
        }
        finally {
            setSubmitting(false);
        }
    };
    const isHodOrAdmin = role === 'Admin' || role === 'HOD';
    return (<div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Academic Programs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              Curriculum Onboarding
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Maintain institutional degree programs and monitor accreditation cycles
          </p>
        </div>

        {isHodOrAdmin && (<button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4"/> Add Degree Program
          </button>)}
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((p) => (<div key={p.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {p.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3"/> {p.accreditationStatus}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-1">{p.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                <Building2 className="w-3.5 h-3.5 text-gray-400"/>
                {p.departmentName}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="text-gray-400 block text-[11px]">Degree Type</span>
                <strong className="text-gray-800">{p.degree}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Approved Intake</span>
                <strong className="text-gray-800">{p.intake} Students</strong>
              </div>
            </div>
          </div>))}
      </div>

      {/* Modal */}
      {isModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Add Academic Program</h2>
            <p className="text-xs text-gray-500 mb-4">Configure a new degree program in MongoDB</p>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Program Code</label>
                <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. BTECH-AI" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Degree Title</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. B.Tech in Artificial Intelligence & Machine Learning" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Degree</label>
                  <select value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="Ph.D.">Ph.D.</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Annual Intake</label>
                  <input type="number" min="10" max="500" value={intake} onChange={(e) => setIntake(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Program'}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
}
