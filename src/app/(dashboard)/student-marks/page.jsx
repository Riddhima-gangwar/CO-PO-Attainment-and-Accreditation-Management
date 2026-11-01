'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { courseService } from '@/services/courseService';
import { attainmentService } from '@/services/attainmentService';
import { CheckCircle2, BookOpen, ArrowRight, Calculator, RefreshCw, } from 'lucide-react';
const DEFAULT_ROSTER = [
    { roll: 'CS23B101', name: 'Aarav Mehta', marks: { CO1: 22, CO2: 20, CO3: 21, CO4: 18, CO5: 23 } },
    { roll: 'CS23B102', name: 'Diya Sharma', marks: { CO1: 24, CO2: 22, CO3: 23, CO4: 17, CO5: 25 } },
    { roll: 'CS23B103', name: 'Rohan Iyer', marks: { CO1: 19, CO2: 18, CO3: 20, CO4: 14, CO5: 20 } },
    { roll: 'CS23B104', name: 'Pooja Reddy', marks: { CO1: 23, CO2: 21, CO3: 22, CO4: 19, CO5: 24 } },
    { roll: 'CS23B105', name: 'Vikram Joshi', marks: { CO1: 17, CO2: 16, CO3: 18, CO4: 12, CO5: 18 } },
    { roll: 'CS23B106', name: 'Neha Chawla', marks: { CO1: 25, CO2: 24, CO3: 24, CO4: 21, CO5: 25 } },
    { roll: 'CS23B107', name: 'Anil Sengupta', marks: { CO1: 18, CO2: 19, CO3: 17, CO4: 13, CO5: 19 } },
    { roll: 'CS23B108', name: 'Kavya Nair', marks: { CO1: 22, CO2: 21, CO3: 20, CO4: 16, CO5: 22 } },
];
export default function StudentMarksPage() {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('crs-1');
    const [roster, setRoster] = useState(DEFAULT_ROSTER);
    const [saving, setSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [recalcSummary, setRecalcSummary] = useState(null);
    useEffect(() => {
        courseService.getCourses().then((cList) => {
            setCourses(cList);
            if (cList.length > 0)
                setSelectedCourseId(cList[0].id);
        });
    }, []);
    // Handle Mark Input
    const handleMarkChange = (roll, co, val) => {
        const num = Math.max(0, Math.min(25, Number(val) || 0));
        setRoster((prev) => prev.map((row) => row.roll === roll
            ? { ...row, marks: { ...row.marks, [co]: num } }
            : row));
        setSavedSuccess(false);
    };
    const handleSaveAndCalculate = async () => {
        setSaving(true);
        setRecalcSummary(null);
        const markItems = [];
        const coKeys = ['CO1', 'CO2', 'CO3', 'CO4', 'CO5'];
        roster.forEach((student) => {
            coKeys.forEach((co) => {
                markItems.push({
                    studentRoll: student.roll,
                    studentName: student.name,
                    courseId: selectedCourseId,
                    assessmentId: 'asm-cie1',
                    coCode: co,
                    marksObtained: student.marks[co] || 0,
                    maxMarks: 25,
                });
            });
        });
        try {
            const res = await attainmentService.recordStudentMarks(selectedCourseId, 'asm-cie1', markItems);
            if (res.success) {
                setSavedSuccess(true);
                setRecalcSummary('Real-time Direct CO Attainment computed & saved to MongoDB.');
                setTimeout(() => setSavedSuccess(false), 4000);
            }
        }
        catch (err) {
            alert('Error calculating attainment');
        }
        finally {
            setSaving(false);
        }
    };
    const currentCourse = courses.find((c) => c.id === selectedCourseId);
    return (<div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Student Marks Ingestion</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Live Attainment Engine
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Record continuous evaluation marks mapped to Course Outcomes with automated attainment derivation
          </p>
        </div>

        <button onClick={handleSaveAndCalculate} disabled={saving} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm flex items-center gap-2 shadow-blue-500/20 disabled:opacity-50">
          {saving ? (<>
              <RefreshCw className="w-4 h-4 animate-spin"/> Computing...
            </>) : savedSuccess ? (<>
              <CheckCircle2 className="w-4 h-4 text-emerald-300"/> Attainment Computed
            </>) : (<>
              <Calculator className="w-4 h-4"/> Save & Compute Attainment
            </>)}
        </button>
      </div>

      {recalcSummary && (<div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600"/>
            <span>{recalcSummary}</span>
          </div>
          <Link href="/co-attainment" className="font-bold underline hover:text-emerald-900">
            View CO Attainment &rarr;
          </Link>
        </div>)}

      {/* Course Context Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <BookOpen className="h-5 w-5 text-blue-600 shrink-0"/>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Course Context
            </label>
            <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="text-sm font-semibold border-0 text-gray-900 bg-transparent focus:ring-0 cursor-pointer p-0 pr-6">
              {courses.map((course) => (<option key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </option>))}
            </select>
          </div>
        </div>

        {currentCourse && (<div className="text-xs text-gray-500 flex items-center gap-4">
            <span>Assessment: <strong>Continuous Internal Evaluation 1</strong></span>
            <span>Scale: <strong>Max 25 Marks per CO</strong></span>
            <span>Threshold: <strong>&ge; 60%</strong></span>
          </div>)}
      </div>

      {/* Marks Ingestion Grid Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Roll Number</th>
              <th className="px-6 py-3.5">Student Name</th>
              <th className="px-4 py-3.5 text-center">CO1 (25m)</th>
              <th className="px-4 py-3.5 text-center">CO2 (25m)</th>
              <th className="px-4 py-3.5 text-center">CO3 (25m)</th>
              <th className="px-4 py-3.5 text-center">CO4 (25m)</th>
              <th className="px-4 py-3.5 text-center">CO5 (25m)</th>
              <th className="px-6 py-3.5 text-center">Average</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {roster.map((s) => {
            const marksValues = Object.values(s.marks);
            const avg = marksValues.length > 0
                ? Math.round((marksValues.reduce((a, b) => a + b, 0) / marksValues.length) * 10) / 10
                : 0;
            return (<tr key={s.roll} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs font-bold text-gray-900">{s.roll}</td>
                  <td className="px-6 py-3.5 text-xs font-medium text-gray-800">{s.name}</td>
                  {['CO1', 'CO2', 'CO3', 'CO4', 'CO5'].map((co) => (<td key={co} className="px-4 py-3.5 text-center">
                      <input type="number" min="0" max="25" value={s.marks[co] ?? ''} onChange={(e) => handleMarkChange(s.roll, co, e.target.value)} className="w-16 text-center py-1 px-2 border border-gray-200 rounded-md text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </td>))}
                  <td className="px-6 py-3.5 text-center font-bold text-xs text-blue-700">
                    {avg} / 25
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>

      {/* Primary Workflow Callout */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
            Step 3 of 5 in Outcome Lifecycle
          </span>
          <h3 className="text-sm font-bold text-gray-900 mt-1">Marks Ingestion Connected</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Student marks evaluate direct CO attainment. Once recorded, proceed to inspect attainment percentages and NBA rubric levels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/co-attainment" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm flex items-center gap-1.5">
            Compute CO Attainment <ArrowRight className="w-3.5 h-3.5"/>
          </Link>
        </div>
      </div>
    </div>);
}
