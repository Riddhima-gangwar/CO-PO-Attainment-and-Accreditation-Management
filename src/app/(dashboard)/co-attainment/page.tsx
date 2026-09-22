'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course, COAttainmentData } from '@/data/mockData';
import { courseService } from '@/services/courseService';
import { attainmentService } from '@/services/attainmentService';
import { AttainmentTable } from '@/components/attainment/AttainmentTable';
import { AttainmentChart } from '@/components/attainment/AttainmentChart';
import { BookOpen, BarChart4, ArrowRight, ArrowLeft } from 'lucide-react';

export default function COAttainmentPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [attainmentData, setAttainmentData] = useState<COAttainmentData[]>([]);

  useEffect(() => {
    courseService.getCourses().then((data) => {
      setCourses(data);
      if (data.length > 0) setSelectedCourseId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      attainmentService.getCOAttainment(selectedCourseId).then((data) => {
        setAttainmentData(data);
      });
    }
  }, [selectedCourseId]);

  const currentCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Course Outcome Attainment
          </h1>
          <p className="text-gray-500 mt-1">
            Compute and inspect direct assessment and indirect survey attainment per Course Outcome
          </p>
        </div>
      </div>

      {/* Course Context Selector */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <BookOpen className="h-5 w-5 text-blue-600 shrink-0" />
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Selected Course
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
            <span>Batch: <strong>2023-2027</strong></span>
          </div>
        )}
      </div>

      {/* Attainment Visual Progress Chart Component */}
      <AttainmentChart data={attainmentData} />

      {/* Attainment Table Component */}
      <AttainmentTable data={attainmentData} />

      {/* Primary Workflow Guidance Callout */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
            Step 4 of 5 in Outcome Lifecycle
          </span>
          <h3 className="text-sm font-bold text-gray-900 mt-1">Attainment Calculated</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Outcome metrics verified. Review consolidated Self-Study Reports (SSR) and attainment registers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/co-po-mapping"
            className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Mapping
          </Link>
          <Link
            href="/reports"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
          >
            Generate Accreditation Reports <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
