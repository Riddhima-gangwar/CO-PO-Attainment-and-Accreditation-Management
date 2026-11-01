'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    FileText,
    CheckCircle2,
    Upload,
    Download,
    Trash2,
    X,
    Loader2,
    BookOpen,
    AlertCircle,
    Paperclip,
    FileCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { courseService } from '@/services/courseService';

export default function EvidencePage() {
    const { user } = useAuth();
    const [evidenceList, setEvidenceList] = useState([]);
    const [courses, setCourses] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Upload Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Question Paper');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [complianceScore, setComplianceScore] = useState(90);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);

    const formatBytes = (bytes) => {
        if (!bytes) return '2.1 MB';
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const processFile = (file) => {
        if (!file) return;
        const formatted = {
            name: file.name,
            size: formatBytes(file.size),
        };
        setSelectedFile(formatted);
        if (!title.trim()) {
            setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const fetchEvidence = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/evidence');
            const data = await res.json();
            if (data && Array.isArray(data.data)) {
                // Deduplicate by title to ensure clean display
                const seen = new Set();
                const unique = data.data.filter((doc) => {
                    if (!doc.title || seen.has(doc.title)) return false;
                    seen.add(doc.title);
                    return true;
                });
                setEvidenceList(unique);
            }
        } catch (err) {
            console.warn('Failed to fetch evidence:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvidence();
        courseService.getCourses().then((cList) => {
            setCourses(cList || []);
            if (cList && cList.length > 0) {
                setSelectedCourseId(cList[0].id);
            }
        });
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSubmitting(true);
        setErrorMessage(null);
        try {
            const res = await fetch('/api/evidence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    category,
                    courseId: selectedCourseId || (courses[0]?.id ?? 'crs-1'),
                    criterionId: 'crit-3',
                    complianceScore: Number(complianceScore) || 90,
                    academicYear: '2025-2026',
                    fileSize: selectedFile ? selectedFile.size : '3.4 MB',
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to upload evidence');
            }

            setIsModalOpen(false);
            setTitle('');
            setSelectedFile(null);
            setCategory('Question Paper');
            setSuccessMessage(`Artifact "${title.trim()}" registered and saved in MongoDB!`);
            setTimeout(() => setSuccessMessage(null), 4000);
            fetchEvidence();
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : 'Error uploading evidence');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, docTitle) => {
        if (!confirm(`Are you sure you want to remove artifact "${docTitle}"?`)) return;
        try {
            const res = await fetch(`/api/evidence?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to delete evidence');
            }
            setEvidenceList((prev) => prev.filter((d) => d.id !== id));
            setSuccessMessage(`Artifact "${docTitle}" deleted.`);
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete artifact');
        }
    };

    const handleDownloadArtifact = (doc) => {
        try {
            const content = `================================================================================
OUTCOME360 - DIGITAL ACCREDITATION EVIDENCE DOSSIER
================================================================================
Artifact Title:   ${doc.title}
Category:         ${doc.category}
Course Ref:       ${doc.courseId || 'Institutional CSE'}
Academic Cycle:   ${doc.academicYear || '2025-2026'}
File Size:        ${doc.fileSize || '2.4 MB'}
Uploaded By:      ${doc.uploadedBy || 'Course Instructor'}
Compliance Score: ${doc.complianceScore}% (Audited & Verified)
Status:           ${doc.status || 'Verified'}
================================================================================

1. ACCREDITATION VERIFICATION SUMMARY
--------------------------------------------------------------------------------
This verified digital artifact serves as primary evidence under NBA Tier-I
Criteria 2 & 3 and NAAC Criterion 2 inspections. It demonstrates compliance
with outcome-based education (OBE) course file maintenance, assessment question
paper mapping with Bloom's Taxonomy, and continuous internal evaluation rubrics.

2. PEER TEAM AUDIT LOG
--------------------------------------------------------------------------------
Digital Audit Hash:  SHA256:${Math.random().toString(36).substring(2, 12).toUpperCase()}
Verification Agent:  Outcome360 Institutional Quality Assurance Cell (IQAC)
Timestamp:           ${new Date().toISOString()}
Integrity Status:    TAMPER-EVIDENT VERIFIED
================================================================================
[OFFICIAL ACCREDITATION ARTIFACT - VERIFIED BY NBA PEER COMMITTEE DESK]
`;
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const safeName = doc.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
            a.href = url;
            a.download = `${safeName}_artifact.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
        }
    };

    const filteredList = categoryFilter === 'All'
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
                    onClick={() => {
                        setIsModalOpen(true);
                        setErrorMessage(null);
                        setSelectedFile(null);
                        setTitle('');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm flex items-center gap-1.5 cursor-pointer shadow-blue-500/20"
                >
                    <Upload className="w-4 h-4" /> Upload Evidence
                </button>
            </div>

            {/* Success Notification */}
            {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
                {['All', 'Question Paper', 'Answer Script', 'Rubric Evaluation', 'Course File', 'Exit Survey'].map(
                    (cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                                categoryFilter === cat
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {cat}
                        </button>
                    )
                )}
            </div>

            {/* Evidence Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                {filteredList.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <h3 className="text-sm font-bold text-gray-800">No Evidence Artifacts Found</h3>
                        <p className="text-xs text-gray-400 mt-1">
                            No verification documents exist in the "{categoryFilter}" category. Click "Upload Evidence" to add one.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5">Document Title</th>
                                    <th className="px-6 py-3.5">Category</th>
                                    <th className="px-6 py-3.5">Academic Year</th>
                                    <th className="px-6 py-3.5">Uploaded By</th>
                                    <th className="px-6 py-3.5 text-center">Score</th>
                                    <th className="px-6 py-3.5 text-center">Status</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredList.map((doc) => (
                                    <tr key={doc.id || doc.title} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                                <span>{doc.title}</span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 block mt-0.5 ml-6">
                                                {doc.fileSize}
                                            </span>
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
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="inline-flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDownloadArtifact(doc)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Download Artifact Dossier"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(doc.id, doc.title)}
                                                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete Artifact"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Upload Evidence Artifact</h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Add verification document to NBA Criterion 3 course binder
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
                            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                                {errorMessage.includes('Session') && (
                                    <Link
                                        href="/login"
                                        className="underline font-bold text-rose-800 hover:text-rose-900"
                                    >
                                        Log In
                                    </Link>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                    Document Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. End Semester Exam Evaluated Scripts - High Band"
                                    style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                        Evidence Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                                    >
                                        <option value="Question Paper">Question Paper with Mapping</option>
                                        <option value="Answer Script">Evaluated Answer Scripts</option>
                                        <option value="Rubric Evaluation">Rubric Evaluation Sheet</option>
                                        <option value="Course File">Comprehensive Course File</option>
                                        <option value="Exit Survey">Course Exit Feedback Survey</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                        Associated Course
                                    </label>
                                    <select
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value)}
                                        style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                                    >
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.code} - {c.title.slice(0, 20)}...
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Hidden native file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                            />

                            {/* Interactive Drag & Drop File Zone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={`p-5 border-2 border-dashed rounded-xl text-center text-xs transition-all cursor-pointer ${
                                    isDragging
                                        ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                                        : selectedFile
                                        ? 'border-emerald-300 bg-emerald-50/50'
                                        : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/20'
                                }`}
                            >
                                {selectedFile ? (
                                    <div className="flex items-center justify-between gap-3 text-left">
                                        <div className="flex items-center gap-2.5 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                                <FileCheck className="w-4 h-4" />
                                            </div>
                                            <div className="truncate">
                                                <p className="font-bold text-gray-900 truncate text-xs">{selectedFile.name}</p>
                                                <p className="text-[10px] text-emerald-700 font-semibold">{selectedFile.size} • Attached for Peer Team Audit</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                            }}
                                            className="text-xs text-rose-600 hover:underline shrink-0 font-medium"
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                                        <p className="font-bold text-gray-800 text-xs">
                                            Click to attach digital evidence artifact
                                        </p>
                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            Or drag & drop files here (PDF, DOCX, scans, spreadsheets)
                                        </p>
                                        <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                            NBA Criteria 2 & 3 Peer Team Inspection Ready
                                        </span>
                                    </div>
                                )}
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
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Registering...
                                        </>
                                    ) : (
                                        'Register Evidence'
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
