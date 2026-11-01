'use client';

import React, { useState, useEffect } from 'react';
import {
    Save,
    CheckCircle2,
    Database,
    Sliders,
    Calendar,
    RotateCcw,
    ShieldCheck,
    Building2,
    AlertCircle,
    Loader2,
} from 'lucide-react';

export default function SettingsPage() {
    // OBE Formula State
    const [directWeightage, setDirectWeightage] = useState(80);
    const [indirectWeightage, setIndirectWeightage] = useState(20);
    const [targetStudentPercent, setTargetStudentPercent] = useState(60);

    // Rubric Thresholds
    const [level3Threshold, setLevel3Threshold] = useState(70);
    const [level2Threshold, setLevel2Threshold] = useState(60);
    const [level1Threshold, setLevel1Threshold] = useState(50);

    // Academic Cycle State
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [semesterCycle, setSemesterCycle] = useState('Even Semester (Spring: Semesters 2, 4, 6, 8)');

    // Institutional Profile State
    const [institutionName, setInstitutionName] = useState('National Institute of Engineering & Technology');
    const [department, setDepartment] = useState('Computer Science & Engineering');

    // UI Status State
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [updatedBy, setUpdatedBy] = useState('System Initializer');
    const [updatedAt, setUpdatedAt] = useState(null);

    // Live Database & Security State
    const [dbInfo, setDbInfo] = useState({
        status: 'Connected',
        uri: 'mongodb://localhost:27017/outcome360',
        sessionSecurity: 'HMAC-SHA256 JWT (15-Minute Expiry & Auto-Logout)',
    });

    // 1. Fetch current settings on component mount
    useEffect(() => {
        let isMounted = true;
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data && isMounted) {
                        const d = json.data;
                        if (d.directAssessmentWeightage != null) setDirectWeightage(Number(d.directAssessmentWeightage));
                        if (d.indirectSurveyWeightage != null) setIndirectWeightage(Number(d.indirectSurveyWeightage));
                        if (d.passingBenchmark != null) setTargetStudentPercent(Number(d.passingBenchmark));
                        if (d.level3Threshold != null) setLevel3Threshold(Number(d.level3Threshold));
                        if (d.level2Threshold != null) setLevel2Threshold(Number(d.level2Threshold));
                        if (d.level1Threshold != null) setLevel1Threshold(Number(d.level1Threshold));
                        if (d.academicYear) setAcademicYear(d.academicYear);
                        if (d.currentTerm) setSemesterCycle(d.currentTerm);
                        if (d.institutionName) setInstitutionName(d.institutionName);
                        if (d.department) setDepartment(d.department);
                        if (d.updatedBy) setUpdatedBy(d.updatedBy);
                        if (d.updatedAt) setUpdatedAt(new Date(d.updatedAt).toLocaleString());

                        if (json.database) {
                            setDbInfo(json.database);
                        }
                    }
                }
            } catch (err) {
                console.warn('[Settings] Failed to fetch settings, using local fallback:', err);
                try {
                    const local = localStorage.getItem('outcome360_institutional_settings');
                    if (local && isMounted) {
                        const parsed = JSON.parse(local);
                        if (parsed.directWeightage) setDirectWeightage(parsed.directWeightage);
                        if (parsed.indirectWeightage) setIndirectWeightage(parsed.indirectWeightage);
                        if (parsed.targetStudentPercent) setTargetStudentPercent(parsed.targetStudentPercent);
                        if (parsed.academicYear) setAcademicYear(parsed.academicYear);
                        if (parsed.semesterCycle) setSemesterCycle(parsed.semesterCycle);
                    }
                } catch {
                    // Ignore localStorage read errors
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        fetchSettings();
        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Direct weightage change with auto-balancing
    const handleDirectWeightageChange = (val) => {
        setDirectWeightage(val);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            setIndirectWeightage(100 - val);
        }
    };

    // 3. Indirect weightage change with auto-balancing
    const handleIndirectWeightageChange = (val) => {
        setIndirectWeightage(val);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            setDirectWeightage(100 - val);
        }
    };

    // 4. Reset to NBA Standard Defaults
    const handleResetDefaults = () => {
        setDirectWeightage(80);
        setIndirectWeightage(20);
        setTargetStudentPercent(60);
        setLevel3Threshold(70);
        setLevel2Threshold(60);
        setLevel1Threshold(50);
        setAcademicYear('2024-2025');
        setSemesterCycle('Even Semester (Spring: Semesters 2, 4, 6, 8)');
        setInstitutionName('National Institute of Engineering & Technology');
        setDepartment('Computer Science & Engineering');
        setSavedMessage('Reset parameters to NBA recommended defaults. Click "Save Configuration" to persist.');
        setTimeout(() => setSavedMessage(null), 4000);
    };

    // 5. Save Configuration Parameters to MongoDB
    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        setErrorMessage(null);
        setSavedMessage(null);

        // Validation: Weights must sum to 100%
        let direct = Number(directWeightage) || 80;
        let indirect = Number(indirectWeightage) || 20;
        if (direct + indirect !== 100) {
            indirect = 100 - direct;
            setIndirectWeightage(indirect);
        }

        const payload = {
            directAssessmentWeightage: direct,
            indirectSurveyWeightage: indirect,
            passingBenchmark: Number(targetStudentPercent) || 60,
            level3Threshold: Number(level3Threshold) || 70,
            level2Threshold: Number(level2Threshold) || 60,
            level1Threshold: Number(level1Threshold) || 50,
            academicYear,
            currentTerm: semesterCycle,
            institutionName,
            department,
        };

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            if (res.ok && json.success) {
                setSavedMessage('Settings successfully saved to MongoDB!');
                if (json.data?.updatedBy) setUpdatedBy(json.data.updatedBy);
                if (json.data?.updatedAt) setUpdatedAt(new Date(json.data.updatedAt).toLocaleString());

                // Cache in localStorage
                try {
                    localStorage.setItem(
                        'outcome360_institutional_settings',
                        JSON.stringify({
                            directWeightage: direct,
                            indirectWeightage: indirect,
                            targetStudentPercent: payload.passingBenchmark,
                            academicYear,
                            semesterCycle,
                            updatedAt: new Date().toISOString(),
                        })
                    );
                } catch {
                    // Ignore localStorage write error
                }
            } else {
                setErrorMessage(json.error || 'Failed to save settings. Please try again.');
            }
        } catch (err) {
            console.error('[Settings Save Error]', err);
            // Fallback localStorage persist
            try {
                localStorage.setItem(
                    'outcome360_institutional_settings',
                    JSON.stringify({
                        directWeightage: direct,
                        indirectWeightage: indirect,
                        targetStudentPercent: payload.passingBenchmark,
                        academicYear,
                        semesterCycle,
                        updatedAt: new Date().toISOString(),
                    })
                );
                setSavedMessage('Settings saved locally (server offline).');
            } catch {
                setErrorMessage('Network error while saving settings.');
            }
        } finally {
            setIsSaving(false);
            setTimeout(() => {
                setSavedMessage(null);
                setErrorMessage(null);
            }, 5000);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl pb-12">
            {/* Header & Prominent Save Action */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Settings</h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                            Institutional Parameters
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                        Configure institutional attainment calculation formulas, NBA grading thresholds, and database parameters
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
                        title="Reset to NBA recommended standard parameters"
                    >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        Reset Defaults
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving Parameters...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Configuration
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Notification Banners */}
            {savedMessage && (
                <div className="flex items-center gap-2.5 text-sm font-semibold text-emerald-800 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200 shadow-sm animate-in fade-in duration-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{savedMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="flex items-center gap-2.5 text-sm font-semibold text-rose-800 bg-rose-50 px-4 py-3 rounded-xl border border-rose-200 shadow-sm animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                {/* 1. Attainment Calculation Formula Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <Sliders className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900">OBE Attainment Calculation Formula</h2>
                                <p className="text-xs text-slate-500">
                                    Configure direct assessment vs indirect exit survey proportions
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                            Total: {Number(directWeightage || 0) + Number(indirectWeightage || 0)}%
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                        {/* Direct Weightage */}
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Direct Assessment Weightage (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={directWeightage}
                                onChange={(e) => handleDirectWeightageChange(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-xs"
                            />
                            <span className="text-[11px] text-slate-500 mt-1.5 block">
                                NBA recommended standard: 80% (Internal + End Semester Exams)
                            </span>
                        </div>

                        {/* Indirect Weightage */}
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Indirect Survey Weightage (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={indirectWeightage}
                                onChange={(e) => handleIndirectWeightageChange(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-xs"
                            />
                            <span className="text-[11px] text-slate-500 mt-1.5 block">
                                Course Exit & Stakeholder Surveys: 20%
                            </span>
                        </div>

                        {/* Student Passing Benchmark */}
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Student Passing Benchmark (%)
                            </label>
                            <input
                                type="number"
                                min="30"
                                max="100"
                                value={targetStudentPercent}
                                onChange={(e) => setTargetStudentPercent(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-xs"
                            />
                            <span className="text-[11px] text-slate-500 mt-1.5 block">
                                Minimum marks percentage required for a student to achieve attainment
                            </span>
                        </div>

                        {/* NBA Rubric Level Mapping */}
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                NBA Rubric Level Mapping (Thresholds)
                            </label>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-emerald-800">Level 3: &ge;</span>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            min="50"
                                            max="95"
                                            value={level3Threshold}
                                            onChange={(e) => setLevel3Threshold(Number(e.target.value))}
                                            className="w-16 px-2 py-1 text-center border border-slate-300 rounded-md font-bold text-slate-900 bg-white"
                                        />
                                        <span className="text-slate-600">% students score &ge; benchmark</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-blue-800">Level 2:</span>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            min="40"
                                            max="85"
                                            value={level2Threshold}
                                            onChange={(e) => setLevel2Threshold(Number(e.target.value))}
                                            className="w-16 px-2 py-1 text-center border border-slate-300 rounded-md font-bold text-slate-900 bg-white"
                                        />
                                        <span className="text-slate-600">% to {level3Threshold - 1}% students</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-amber-800">Level 1:</span>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            min="30"
                                            max="75"
                                            value={level1Threshold}
                                            onChange={(e) => setLevel1Threshold(Number(e.target.value))}
                                            className="w-16 px-2 py-1 text-center border border-slate-300 rounded-md font-bold text-slate-900 bg-white"
                                        />
                                        <span className="text-slate-600">% to {level2Threshold - 1}% students</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Academic Calendar Settings Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Academic Calendar Cycle</h2>
                            <p className="text-xs text-slate-500">
                                Active evaluation cycle for current batch attainment calculations
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Current Academic Year
                            </label>
                            <select
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-xs cursor-pointer"
                            >
                                <option value="2025-2026">2025-2026 (Active Offering)</option>
                                <option value="2024-2025">2024-2025 (Audit Archive)</option>
                                <option value="2023-2024">2023-2024 (Historical Data)</option>
                            </select>
                            <span className="text-[11px] text-slate-500 mt-1.5 block">
                                Sets default academic year filter for courses and attainment matrices
                            </span>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">Current Term</label>
                            <select
                                value={semesterCycle}
                                onChange={(e) => setSemesterCycle(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-xs cursor-pointer"
                            >
                                <option value="Even Semester (Spring: Semesters 2, 4, 6, 8)">
                                    Even Semester (Spring: Semesters 2, 4, 6, 8)
                                </option>
                                <option value="Odd Semester (Autumn: Semesters 1, 3, 5, 7)">
                                    Odd Semester (Autumn: Semesters 1, 3, 5, 7)
                                </option>
                            </select>
                            <span className="text-[11px] text-slate-500 mt-1.5 block">
                                Determines active semester cycle for continuous internal assessments
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Institutional Profile Settings Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Institutional Profile</h2>
                            <p className="text-xs text-slate-500">
                                Parameters printed on NBA self-assessment reports and course exit dossiers
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Institution Name
                            </label>
                            <input
                                type="text"
                                value={institutionName}
                                onChange={(e) => setInstitutionName(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-xs"
                                placeholder="e.g. National Institute of Engineering & Technology"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Primary Department / Program
                            </label>
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition shadow-xs"
                                placeholder="e.g. Computer Science & Engineering"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Database & Security Information Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Database & Security Configuration</h2>
                            <p className="text-xs text-slate-500">
                                Active persistence engine, connection status, and session parameters
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-xs">
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-slate-500 font-bold">MongoDB Persistence Engine</span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                    {dbInfo.status || 'Connected'}
                                </span>
                            </div>
                            <code className="text-emerald-800 font-mono font-bold text-[13px] block mt-1">
                                {dbInfo.uri || 'mongodb://localhost:27017/outcome360'}
                            </code>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-slate-500 font-bold">Session Security & Expiration</span>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Active & Enforced
                                </span>
                            </div>
                            <span className="text-slate-800 font-bold text-[13px] block mt-1">
                                {dbInfo.sessionSecurity || 'HMAC-SHA256 JWT (15-Minute Expiry & Auto-Logout)'}
                            </span>
                        </div>
                    </div>

                    {updatedAt && (
                        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                            <span>Last Persisted: <strong className="text-slate-700">{updatedAt}</strong></span>
                            <span>Audit Actor: <strong className="text-slate-700">{updatedBy}</strong></span>
                        </div>
                    )}
                </div>

                {/* Bottom Submit Actions */}
                <div className="flex items-center justify-between pt-2">
                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" /> Reset to Defaults
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving || isLoading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 flex items-center gap-2.5 transition cursor-pointer"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving Parameters...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Configuration Parameters
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
