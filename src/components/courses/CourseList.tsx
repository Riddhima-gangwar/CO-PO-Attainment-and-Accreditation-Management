'use client';

import React from 'react';
import Link from 'next/link';
import { Course } from '@/data/mockData';
import { BookOpen, Users, Award, ChevronRight, ExternalLink } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  selectedCourseId?: string;
  onSelectCourse: (course: Course) => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((course) => {
        const isSelected = course.id === selectedCourseId;

        return (
          <div
            key={course.id}
            onClick={() => onSelectCourse(course)}
            className={`p-5 rounded-xl border transition-all cursor-pointer bg-white group ${
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  {course.code}
                </span>
                <h3 className="mt-2 text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{course.departmentName}</p>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  course.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : course.status === 'In Progress'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {course.status}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                <span>{course.credits} Credits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gray-400" />
                <span>{course.studentsEnrolled} Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-gray-400" />
                <span>{course.coCount} COs</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-gray-50">
              <span className="text-gray-500 truncate max-w-[160px]">
                Incharge: {course.facultyName}
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href={`/courses/${course.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1 py-1 px-2 rounded hover:bg-gray-100 transition-colors"
                  title="View full course page"
                >
                  <ExternalLink className="h-3 w-3" /> Full Details
                </Link>
                <span className="flex items-center text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Select <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
