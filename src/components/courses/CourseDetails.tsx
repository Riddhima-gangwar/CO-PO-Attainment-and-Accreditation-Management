'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/data/mockData';
import { Target, PieChart, BarChart4, X } from 'lucide-react';

interface CourseDetailsProps {
  course: Course;
  onClose: () => void;
}

export const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onClose }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-start justify-between pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
              {course.code}
            </span>
            <span className="text-xs text-gray-500">Semester {course.semester}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">{course.title}</h2>
          <p className="text-sm text-gray-500">{course.departmentName}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Credits</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">{course.credits}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Enrolled Students</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">{course.studentsEnrolled}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">COs Formulated</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5">{course.coCount}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Faculty In-Charge</p>
          <p className="text-sm font-bold text-gray-900 mt-1 truncate">{course.facultyName}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
        <Link
          href="/course-outcomes"
          className="px-3.5 py-2 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
        >
          <Target className="h-4 w-4" /> View Course Outcomes
        </Link>
        <Link
          href="/co-po-mapping"
          className="px-3.5 py-2 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
        >
          <PieChart className="h-4 w-4" /> Edit CO-PO Mapping
        </Link>
        <Link
          href="/co-attainment"
          className="px-3.5 py-2 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
        >
          <BarChart4 className="h-4 w-4" /> Calculate Attainment
        </Link>
      </div>
    </div>
  );
};
