'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { attainmentService } from '@/services/attainmentService';
import { ReportTable } from '@/components/reports/ReportTable';
import { Plus, CheckCircle2, LayoutDashboard, ArrowLeft, X, Loader2 } from 'lucide-react';

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [selectedType, setSelectedType] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('NBA SSR');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchReports = () => {
        attainmentService.getReports().then((data) => setReports(data || []));
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMessage(null);
        try {
            await attainmentService.generateReport({
                title: title.trim(),
                type,
                department: 'Computer Science & Engineering',
            });
            setIsModalOpen(false);
            setTitle('');
            fetchReports();
        }
        catch (err) {
            setErrorMessage(err instanceof Error ? err.message : 'Error generating report');
        }
        finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReport = async (id, reportTitle) => {
        if (!confirm(`Are you sure you want to delete "${reportTitle}"?`)) return;
        try {
            await attainmentService.deleteReport(id);
            setReports((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete report');
        }
    };

    const filteredReports = selectedType === 'All'
        ? reports
        : reports.filter((r) => r.type.toLowerCase().includes(selectedType.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Accreditation Reports & SSR
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Export outcome attainment registers, criterion evidence bundles, and compliance tables
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setErrorMessage(null);
                    }}
                    className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium flex items-center gap-2 shadow-blue-500/20 cursor-pointer"
                >
                    <Plus className="h-4 w-4" /> Generate New Report
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3 text-sm">
                {['All', 'NBA SSR', 'Attainment Register', 'Course Exit Survey', 'NAAC Criterion'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedType(tab)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            selectedType === tab
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Report Manifest Component */}
            <ReportTable reports={filteredReports} onDeleteReport={handleDeleteReport} />

            {/* Primary Workflow Completion Banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Primary OBE Workflow Completed
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mt-1">Accreditation Evidence Ready</h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                        You have traversed the complete outcome cycle: <strong>Courses &rarr; Outcomes &rarr; Mapping &rarr; Attainment &rarr; Reports</strong>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/co-attainment"
                        className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Attainment
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
                    >
                        <LayoutDashboard className="h-3.5 w-3.5" /> Return to Dashboard
                    </Link>
                </div>
            </div>

            {/* Generate Report Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Generate Compliance Report</h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Compile outcome calculation tables and evidence for official submission
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleGenerateReport} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Report Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. NBA Tier-I SSR Criterion 3.2 Evaluation"
                                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Report Format
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                                >
                                    <option value="NBA SSR">NBA Tier-I Self Study Report (SSR)</option>
                                    <option value="Attainment Register">Direct & Indirect Attainment Register (CSV)</option>
                                    <option value="Course Exit Survey">Course Exit Feedback Summary</option>
                                    <option value="NAAC Criterion">NAAC AQAR Criterion 2 Table</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !title.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Compiling...
                                        </>
                                    ) : (
                                        'Compile Report'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
