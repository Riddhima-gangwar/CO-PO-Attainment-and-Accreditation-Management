'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Course, CourseOutcome } from '@/data/mockData';
import { courseService } from '@/services/courseService';
import { outcomeService } from '@/services/outcomeService';
import { COCard } from '@/components/outcomes/COCard';
import {
  ArrowLeft,
  BookOpen,
  Users,
  Award,
  Calendar,
  Target,
  PieChart,
  BarChart4,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [cos, setCOs] = useState<CourseOutcome[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    Promise.all([courseService.getCourseById(id), outcomeService.getCOs(id)])
      .then(([courseData, coData]) => {
        if (!courseData) {
          setError(`Course with ID "${id}" was not found.`);
        } else {
          setCourse(courseData);
          setCOs(coData);
        }
      })
      .catch((err) => {
        setError('Failed to load course details. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Loading Course Details from API...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-8 max-w-xl mx-auto bg-white rounded-xl border border-gray-200 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Course Not Found</h2>
        <p className="text-sm text-gray-500 mt-1">{error || 'Requested course does not exist.'}</p>
        <Link
          href="/courses"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Course Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/courses" className="hover:text-blue-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Course Catalog
        </Link>
        <ChevronRight className="h-3 w-3 text-gray-400" />
        <span className="font-semibold text-gray-800">{course.code}</span>
      </div>

      {/* Main Course Header Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {course.code}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  course.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                {course.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{course.title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{course.departmentName}</p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/course-outcomes"
              className="px-3.5 py-2 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Target className="h-4 w-4" /> Manage COs
            </Link>
            <Link
              href="/co-po-mapping"
              className="px-3.5 py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <PieChart className="h-4 w-4" /> Map to POs
            </Link>
            <Link
              href="/co-attainment"
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <BarChart4 className="h-4 w-4" /> View Attainment
            </Link>
          </div>
        </div>

        {/* Academic Specs Metrics */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <BookOpen className="h-4 w-4 text-blue-600" /> Course Credits
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">{course.credits} Credits</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users className="h-4 w-4 text-indigo-600" /> Student Enrollment
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">{course.studentsEnrolled} Students</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-4 w-4 text-emerald-600" /> Academic Term
            </div>
            <p className="text-xl font-bold text-gray-900 mt-1">Semester {course.semester}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Award className="h-4 w-4 text-amber-600" /> Course Incharge
            </div>
            <p className="text-sm font-bold text-gray-900 mt-1.5 truncate">{course.facultyName}</p>
          </div>
        </div>
      </div>

      {/* Formulated Course Outcomes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Formulated Course Outcomes (CO)</h2>
            <p className="text-xs text-gray-500">
              Learning outcomes measured for accreditation and attainment derivation
            </p>
          </div>
          <Link
            href="/course-outcomes"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            Edit All Outcomes <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {cos.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
            <Target className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">No Course Outcomes configured</p>
            <Link
              href="/course-outcomes"
              className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline"
            >
              Click here to define CO1 through CO5
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cos.map((co) => (
              <COCard key={co.id} co={co} />
            ))}
          </div>
        )}
      </div>

      {/* Primary Workflow Guidance Callout */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Next Step in OBE Workflow</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Proceed to map these Course Outcomes against Program Outcomes (PO1–PO12).
          </p>
        </div>
        <Link
          href="/co-po-mapping"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0"
        >
          Proceed to CO-PO Mapping &rarr;
        </Link>
      </div>
    </div>
  );
}
