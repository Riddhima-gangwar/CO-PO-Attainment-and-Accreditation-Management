'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { courseService } from '@/services/courseService';
import { outcomeService } from '@/services/outcomeService';
import { MappingTable } from '@/components/mapping/MappingTable';
import { BookOpen, Save, CheckCircle2, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function COPOMappingPage() {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [cos, setCOs] = useState([]);
    const [pos, setPOs] = useState([]);
    const [mappings, setMappings] = useState({});
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        courseService.getCourses().then((courseData) => {
            setCourses(courseData);
            if (courseData.length > 0) {
                setSelectedCourseId(courseData[0].id);
            }
        });
        outcomeService.getPOs().then((poData) => {
            setPOs(poData);
        });
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            outcomeService.getCOs(selectedCourseId).then((coData) => {
                setCOs(coData);
            });
            outcomeService.getMapping(selectedCourseId).then((mapData) => {
                setMappings(mapData || {});
            });
            setIsSaved(false);
            setSaveError(null);
        }
    }, [selectedCourseId]);

    // Immutable state update: Cycling correlation value 0 -> 1 -> 2 -> 3 -> 0
    const handleCellClick = (coId, poId, coCode, poCode) => {
        const idKey = `${coId}_${poId}`;
        const codeKey = coCode && poCode ? `${coCode}_${poCode}` : null;
        const currentScore = mappings[idKey] ?? (codeKey ? mappings[codeKey] : 0) ?? 0;
        const nextScore = currentScore >= 3 ? 0 : currentScore + 1;

        setMappings((prevMappings) => {
            const next = {
                ...prevMappings,
                [idKey]: nextScore,
            };
            if (codeKey) {
                next[codeKey] = nextScore;
            }
            return next;
        });
        setIsSaved(false);
        setSaveError(null);
    };

    const handleSave = async () => {
        if (!selectedCourseId) return;
        try {
            setIsSaving(true);
            setSaveError(null);

            // Compile clean CO x PO pairs for active course to keep payload small & fast
            const cleanMatrix = {};
            cos.forEach((co) => {
                pos.forEach((po) => {
                    const keys = [
                        `${co.id}_${po.id}`,
                        `${co.code}_${po.code}`,
                        `${co.code.toLowerCase()}_${po.code.toLowerCase()}`,
                        `co-${co.code.replace(/\D/g, '')}_po-${po.code.replace(/\D/g, '')}`,
                    ];
                    let val = 0;
                    for (const k of keys) {
                        if (mappings[k] !== undefined && mappings[k] !== null) {
                            val = Number(mappings[k]);
                            break;
                        }
                    }
                    cleanMatrix[`${co.code}_${po.code}`] = val;
                });
            });

            await outcomeService.updateMapping(selectedCourseId, cleanMatrix);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (err) {
            console.error('Failed to save mapping matrix:', err);
            setSaveError(err instanceof Error ? err.message : 'Failed to save mapping');
            setTimeout(() => setSaveError(null), 5000);
        } finally {
            setIsSaving(false);
        }
    };

    const currentCourse = courses.find((c) => c.id === selectedCourseId);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        CO-PO Correlation Mapping
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Map Course Outcomes with Program Outcomes using the standard 1, 2, 3 correlation scale
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    {saveError && (
                        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                            <AlertCircle className="h-4 w-4" /> {saveError}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || cos.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-colors text-sm font-medium flex items-center gap-2 shadow-blue-500/20 cursor-pointer"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Saving Matrix...
                            </>
                        ) : isSaved ? (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Mapping Saved
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" /> Save Matrix
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Course Selector */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <BookOpen className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Select Course to Map
                        </label>
                        <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="text-sm font-medium border-0 text-gray-900 bg-transparent focus:ring-0 cursor-pointer p-0 pr-6"
                        >
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.code} - {course.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {currentCourse && (
                    <div className="flex items-center gap-4 text-xs text-gray-500 w-full sm:w-auto justify-end">
                        <span>Faculty: <strong>{currentCourse.facultyName}</strong></span>
                        <span>Program: <strong>B.Tech Computer Science</strong></span>
                    </div>
                )}
            </div>

            {/* Mapping Matrix Component */}
            <MappingTable cos={cos} pos={pos} mappings={mappings} onCellClick={handleCellClick} />

            {/* Primary Workflow Guidance Callout */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                        Step 3 of 5 in Outcome Lifecycle
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1">Correlation Matrix Established</h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                        Proceed to inspect student assessment performance and calculate Course Outcome attainment.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/course-outcomes"
                        className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to COs
                    </Link>
                    <Link
                        href="/co-attainment"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
                    >
                        Proceed to CO Attainment <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
