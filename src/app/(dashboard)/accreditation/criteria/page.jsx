'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    CheckCircle2,
    AlertTriangle,
    FileText,
    ChevronDown,
    ChevronUp,
    Edit3,
    Download,
    FolderKanban,
    X,
    Save,
    Sparkles,
    Check,
    Loader2,
} from 'lucide-react';

export default function CriteriaFrameworkPage() {
    const [criteria, setCriteria] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedCriterion, setExpandedCriterion] = useState(null);

    // Edit Criterion Modal State
    const [editingCriterion, setEditingCriterion] = useState(null);
    const [editAttainedMarks, setEditAttainedMarks] = useState(0);
    const [editStatus, setEditStatus] = useState('Compliant');
    const [editDescription, setEditDescription] = useState('');
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Generate SSR Document Modal State
    const [isSSRModalOpen, setIsSSRModalOpen] = useState(false);
    const [ssrYear, setSsrYear] = useState('2024-2025');
    const [ssrDepartment, setSsrDepartment] = useState('Computer Science & Engineering');
    const [isGeneratingSSR, setIsGeneratingSSR] = useState(false);

    // Toast Notification
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    // 1. Fetch criteria and summary on mount
    const fetchCriteria = async () => {
        try {
            const res = await fetch('/api/accreditation');
            if (res.ok) {
                const data = await res.json();
                if (data.data) setCriteria(data.data);
                if (data.summary) setSummary(data.summary);
            }
        } catch (err) {
            console.error('[Accreditation] Failed to fetch criteria:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCriteria();
    }, []);

    // 2. Open Edit Criterion Modal
    const handleOpenEdit = (criterion) => {
        setEditingCriterion(criterion);
        setEditAttainedMarks(criterion.attainedMarks);
        setEditStatus(criterion.status);
        setEditDescription(criterion.description || '');
    };

    // 3. Save Edited Criterion Marks & Status to MongoDB
    const handleSaveCriterion = async (e) => {
        e.preventDefault();
        if (!editingCriterion) return;
        setIsSavingEdit(true);

        const marksNum = Number(editAttainedMarks);
        const max = editingCriterion.maxMarks;
        const validMarks = Math.min(max, Math.max(0, isNaN(marksNum) ? 0 : marksNum));

        try {
            const res = await fetch('/api/accreditation', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingCriterion.id,
                    criterionNumber: editingCriterion.criterionNumber,
                    attainedMarks: validMarks,
                    status: editStatus,
                    description: editDescription,
                }),
            });

            const json = await res.json();
            if (res.ok && json.success) {
                // Update local state
                setCriteria((prev) =>
                    prev.map((c) =>
                        c.id === editingCriterion.id
                            ? {
                                  ...c,
                                  attainedMarks: validMarks,
                                  percentageScore: json.data?.percentageScore || Math.round((validMarks / max) * 1000) / 10,
                                  status: editStatus,
                                  description: editDescription,
                              }
                            : c
                    )
                );
                if (json.summary) {
                    setSummary(json.summary);
                }
                showToast(`Criterion ${editingCriterion.code} updated & persisted successfully!`);
                setEditingCriterion(null);
            } else {
                alert(json.error || 'Failed to update criterion');
            }
        } catch (err) {
            console.error('[Accreditation Save Error]', err);
            alert('Error updating criterion');
        } finally {
            setIsSavingEdit(false);
        }
    };

    // 4. Generate & Download Official NBA Tier-I SSR Document
    const handleGenerateAndDownloadSSR = async (format = 'csv') => {
        setIsGeneratingSSR(true);
        try {
            // Register in database Reports
            const res = await fetch('/api/accreditation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    academicYear: ssrYear,
                    department: ssrDepartment,
                }),
            });
            await res.json().catch(() => ({}));

            // Generate client-side formatted file
            const totalMax = criteria.reduce((sum, c) => sum + (c.maxMarks || 0), 0);
            const totalAttained = criteria.reduce((sum, c) => sum + (c.attainedMarks || 0), 0);
            const overallPct = totalMax > 0 ? ((totalAttained / totalMax) * 100).toFixed(1) : '0';

            let fileContent = '';
            let mimeType = 'text/plain;charset=utf-8;';
            let fileName = `NBA_Tier_I_SSR_${ssrDepartment.replace(/\s+/g, '_')}_${ssrYear}`;

            if (format === 'csv') {
                mimeType = 'text/csv;charset=utf-8;';
                fileName += '.csv';
                fileContent =
                    `"NBA TIER-I SELF-STUDY REPORT (SSR) SUMMARY"\n` +
                    `"Department","${ssrDepartment}"\n` +
                    `"Academic Cycle","${ssrYear}"\n` +
                    `"Total Attained Marks","${totalAttained}"\n` +
                    `"Total Maximum Marks","${totalMax}"\n` +
                    `"Overall Percentage Score","${overallPct}%"\n` +
                    `"Accreditation Evaluation Status","${overallPct >= 75 ? 'Ready for NBA Tier-I Evaluation' : 'Substantially Compliant'}"\n\n` +
                    `"Criterion Number","Criterion Code","Criterion Title","Maximum Marks","Attained Marks","Score (%)","Compliance Status"\n` +
                    criteria
                        .map(
                            (c) =>
                                `"${c.criterionNumber}","${c.code}","${c.name.replace(/"/g, '""')}","${c.maxMarks}","${c.attainedMarks}","${c.percentageScore}%","${c.status}"`
                        )
                        .join('\n');
            } else {
                fileName += '.txt';
                fileContent =
                    `================================================================================\n` +
                    `               NBA TIER-I ACCREDITATION SELF-STUDY REPORT (SSR)                \n` +
                    `================================================================================\n` +
                    `Department:      ${ssrDepartment}\n` +
                    `Academic Cycle:  ${ssrYear}\n` +
                    `Overall Score:   ${totalAttained} / ${totalMax} (${overallPct}%)\n` +
                    `Audit Status:    ${overallPct >= 75 ? 'Ready for NBA Tier-I Evaluation' : 'Substantially Compliant'}\n` +
                    `Generated Date:  ${new Date().toLocaleDateString()}\n` +
                    `--------------------------------------------------------------------------------\n\n` +
                    `CRITERIA BREAKDOWN:\n\n` +
                    criteria
                        .map(
                            (c) =>
                                `[${c.code}] ${c.name}\n` +
                                `  - Maximum Marks:   ${c.maxMarks}\n` +
                                `  - Attained Marks:  ${c.attainedMarks} (${c.percentageScore}%)\n` +
                                `  - Compliance:      ${c.status}\n` +
                                `  - Description:     ${c.description}\n` +
                                (c.subCriteria && c.subCriteria.length > 0
                                    ? `  - Sub-Criteria:\n` +
                                      c.subCriteria
                                          .map(
                                              (sub) =>
                                                  `      * ${sub.code}: ${sub.name} (${sub.attainedMarks}/${sub.maxMarks} Marks)`
                                          )
                                          .join('\n') +
                                      '\n'
                                    : '') +
                                `\n`
                        )
                        .join('') +
                    `================================================================================\n` +
                    `End of NBA Tier-I SSR Evaluation Summary.\n`;
            }

            const blob = new Blob([fileContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast(`NBA SSR Document (${format.toUpperCase()}) compiled and downloaded!`);
            setIsSSRModalOpen(false);
        } catch (err) {
            console.error('[SSR Gen Error]', err);
            alert('Failed to generate SSR Document');
        } finally {
            setIsGeneratingSSR(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl pb-12">
            {/* Header & Prominent Action */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            NBA Criteria Framework
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            Tier-I SSR Manual
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                        Monitor compliance scoring across all 9 National Board of Accreditation evaluated criteria
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => setIsSSRModalOpen(true)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
                    >
                        <FileText className="w-4 h-4" />
                        Generate SSR Document
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="flex items-center gap-2.5 text-sm font-semibold text-emerald-800 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200 shadow-sm animate-in fade-in duration-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Summary KPI Banner */}
            {summary && (
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            Accreditation Readiness Overview
                        </span>
                        <h2 className="text-3xl font-black mt-1.5 tracking-tight">
                            Score: {summary.totalAttainedMarks} / {summary.totalMaxMarks} ({summary.overallPercentage}%)
                        </h2>
                        <p className="text-xs text-blue-200 mt-1.5">
                            Status:{' '}
                            <strong className="text-emerald-300 font-bold px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-700/50 ml-1">
                                {summary.readinessStatus}
                            </strong>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/accreditation/evidence"
                            className="px-4 py-2.5 bg-white text-blue-900 rounded-xl font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-1.5"
                        >
                            <FolderKanban className="w-4 h-4 text-blue-600" />
                            Inspect Evidence Binders &rarr;
                        </Link>
                    </div>
                </div>
            )}

            {/* Criteria Breakdown Grid */}
            <div className="space-y-4">
                {criteria.map((c) => {
                    const isCompliant = c.status === 'Compliant';
                    const isSubstantial = c.status === 'Substantially Compliant';
                    const isExpanded = expandedCriterion === c.id;

                    return (
                        <div
                            key={c.id}
                            className={`bg-white rounded-2xl border transition-all shadow-sm ${
                                isExpanded
                                    ? 'border-blue-400 ring-2 ring-blue-100'
                                    : 'border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            {/* Card Header / Summary Row */}
                            <div className="p-5 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0 shadow-xs">
                                            C{c.criterionNumber}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                    {c.code}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                                        isCompliant
                                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                            : isSubstantial
                                                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                                                            : 'bg-rose-50 text-rose-800 border-rose-200'
                                                    }`}
                                                >
                                                    {isCompliant ? (
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                    ) : (
                                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                                    )}
                                                    {c.status}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 mt-1">{c.name}</h3>
                                            <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                                        </div>
                                    </div>

                                    {/* Score and Action Controls */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                                        <div className="text-right">
                                            <div className="text-lg font-black text-slate-900">
                                                {c.attainedMarks}{' '}
                                                <span className="text-xs text-slate-500 font-semibold">
                                                    / {c.maxMarks}
                                                </span>
                                            </div>
                                            <div className="text-xs font-bold text-blue-600 mt-0.5">
                                                {c.percentageScore}% Scored
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEdit(c)}
                                                className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1"
                                                title="Evaluate & edit criterion marks"
                                            >
                                                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                                Evaluate
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExpandedCriterion(isExpanded ? null : c.id)
                                                }
                                                className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1"
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        Hide Details <ChevronUp className="w-3.5 h-3.5" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Sub-Criteria <ChevronDown className="w-3.5 h-3.5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            isCompliant
                                                ? 'bg-emerald-500'
                                                : isSubstantial
                                                ? 'bg-amber-500'
                                                : 'bg-rose-500'
                                        }`}
                                        style={{ width: `${Math.min(100, c.percentageScore)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Expanded Sub-Criteria Section */}
                            {isExpanded && (
                                <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                            NBA Sub-Criteria Evaluation Breakdown
                                        </h4>
                                        <Link
                                            href={`/accreditation/evidence`}
                                            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <FolderKanban className="w-3.5 h-3.5" /> View Attached Evidence
                                        </Link>
                                    </div>

                                    {c.subCriteria && c.subCriteria.length > 0 ? (
                                        <div className="space-y-2">
                                            {c.subCriteria.map((sub) => (
                                                <div
                                                    key={sub.code}
                                                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                                            {sub.code}
                                                        </span>
                                                        <span className="font-semibold text-slate-800">
                                                            {sub.name}
                                                        </span>
                                                    </div>
                                                    <div className="font-bold text-slate-900 shrink-0">
                                                        {sub.attainedMarks}{' '}
                                                        <span className="text-slate-400 font-normal">
                                                            / {sub.maxMarks} Marks
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 italic">
                                            No sub-criteria recorded. Click "Evaluate" to update overall criterion score.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 1. Modal: Evaluate / Edit Criterion Score */}
            {editingCriterion && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                    {editingCriterion.code}
                                </span>
                                <h3 className="text-base font-bold text-slate-900 mt-1">
                                    Evaluate Criterion {editingCriterion.criterionNumber}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingCriterion(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCriterion} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">
                                    Criterion Title
                                </label>
                                <p className="text-sm font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    {editingCriterion.name}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">
                                        Attained Marks (Max: {editingCriterion.maxMarks})
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={editingCriterion.maxMarks}
                                        value={editAttainedMarks}
                                        onChange={(e) => setEditAttainedMarks(Number(e.target.value))}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                    <span className="text-[11px] text-blue-600 font-bold mt-1 block">
                                        Score:{' '}
                                        {editingCriterion.maxMarks > 0
                                            ? ((editAttainedMarks / editingCriterion.maxMarks) * 100).toFixed(1)
                                            : 0}
                                        %
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">
                                        Compliance Status
                                    </label>
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                                    >
                                        <option value="Compliant">Compliant (&ge; 75%)</option>
                                        <option value="Substantially Compliant">Substantially Compliant (60-74%)</option>
                                        <option value="Remediation Required">Remediation Required (&lt; 60%)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-1">
                                    Audit Remarks / Compliance Description
                                </label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter audit remarks or evidence references..."
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingCriterion(null)}
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSavingEdit}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
                                >
                                    {isSavingEdit ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-3.5 h-3.5" /> Save Evaluation
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Modal: Generate & Download Official NBA Tier-I SSR Document */}
            {isSSRModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                    Accreditation Deliverable
                                </span>
                                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                                    Generate NBA Tier-I Self-Study Report (SSR)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsSSRModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                                <div className="font-bold">
                                    Ready to compile Self-Study Report across all 9 Criteria:
                                </div>
                                <div className="text-blue-800">
                                    Score:{' '}
                                    <strong>
                                        {summary?.totalAttainedMarks || 0} / {summary?.totalMaxMarks || 0} (
                                        {summary?.overallPercentage || 0}%)
                                    </strong>
                                </div>
                                <div className="text-emerald-700 font-semibold">
                                    Status: {summary?.readinessStatus}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">
                                        Academic Cycle
                                    </label>
                                    <select
                                        value={ssrYear}
                                        onChange={(e) => setSsrYear(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                                    >
                                        <option value="2025-2026">2025-2026 (Active Offering)</option>
                                        <option value="2024-2025">2024-2025 (Audit Archive)</option>
                                        <option value="2023-2024">2023-2024 (Historical Data)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-800 mb-1">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        value={ssrDepartment}
                                        onChange={(e) => setSsrDepartment(e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <span className="block text-xs font-bold text-slate-700 mb-2">
                                    Select Download Format:
                                </span>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        disabled={isGeneratingSSR}
                                        onClick={() => handleGenerateAndDownloadSSR('csv')}
                                        className="p-3.5 border-2 border-slate-200 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center text-center transition hover:bg-blue-50/50 group cursor-pointer"
                                    >
                                        <Download className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-bold text-slate-900">
                                            Spreadsheet (.CSV)
                                        </span>
                                        <span className="text-[10px] text-slate-500 mt-0.5">
                                            Compliance registers & scoring
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        disabled={isGeneratingSSR}
                                        onClick={() => handleGenerateAndDownloadSSR('txt')}
                                        className="p-3.5 border-2 border-slate-200 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center text-center transition hover:bg-indigo-50/50 group cursor-pointer"
                                    >
                                        <FileText className="w-5 h-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-bold text-slate-900">
                                            Text Dossier (.TXT)
                                        </span>
                                        <span className="text-[10px] text-slate-500 mt-0.5">
                                            Full criteria & sub-criteria audit
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <Link
                                    href="/reports"
                                    onClick={() => setIsSSRModalOpen(false)}
                                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    Browse Saved Reports Archive &rarr;
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setIsSSRModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
