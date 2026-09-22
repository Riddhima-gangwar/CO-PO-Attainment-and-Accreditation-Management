'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/data/mockData';
import { courseService } from '@/services/courseService';
import { CourseList } from '@/components/courses/CourseList';
import { CourseForm } from '@/components/courses/CourseForm';
import { CourseDetails } from '@/components/courses/CourseDetails';
import {
  Plus,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  Inbox,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = () => {
    setIsLoading(true);
    setError(null);
    courseService
      .getCourses(departmentFilter)
      .then((data) => {
        setCourses(data);
        if (data.length > 0 && !selectedCourse) {
          setSelectedCourse(data[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load courses from API. Click Retry to reload.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, [departmentFilter]);

  // Immutable state update: Adding a new course
  const handleAddCourse = async (newCourseData: Omit<Course, 'id'>) => {
    try {
      const created = await courseService.addCourse(newCourseData);
      setCourses((prevCourses) => [...prevCourses, created]);
      setSelectedCourse(created);
      setIsAddingCourse(false);
    } catch (err) {
      alert('Error creating course. Please try again.');
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.facultyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Course Management</h1>
          <p className="text-gray-500 mt-1">
            Maintain course catalog, assign faculty, and configure outcome associations
          </p>
        </div>
        {!isAddingCourse && (
          <button
            onClick={() => setIsAddingCourse(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium flex items-center gap-2 shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" /> Add Course
          </button>
        )}
      </div>

      {/* Conditionally rendered Add Course Form */}
      {isAddingCourse && (
        <CourseForm
          onSubmit={handleAddCourse}
          onCancel={() => setIsAddingCourse(false)}
        />
      )}

      {/* Selected Course Details Drawer / Card */}
      {selectedCourse && !isAddingCourse && (
        <CourseDetails
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code, title, faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science & Eng.</option>
            <option value="Electronics">Electronics & Comm.</option>
            <option value="Mechanical">Mechanical Engineering</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="p-5 bg-white rounded-xl border border-gray-200 animate-pulse space-y-4"
            >
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
                <div className="h-3 bg-gray-100 rounded"></div>
                <div className="h-3 bg-gray-100 rounded"></div>
                <div className="h-3 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-sm text-rose-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <p>{error}</p>
          </div>
          <button
            onClick={fetchCourses}
            className="px-3 py-1.5 bg-white border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCourses.length === 0 && (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
          <Inbox className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">No Courses Found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            No courses match your current search query or department filter. Try adjusting your
            filters or adding a new course.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDepartmentFilter('All');
            }}
            className="mt-4 px-3.5 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Course Cards Grid Component */}
      {!isLoading && !error && filteredCourses.length > 0 && (
        <CourseList
          courses={filteredCourses}
          selectedCourseId={selectedCourse?.id}
          onSelectCourse={(course) => setSelectedCourse(course)}
        />
      )}

      {/* Primary Workflow Guidance Callout */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
            Step 1 of 5 in Outcome Lifecycle
          </span>
          <h3 className="text-sm font-bold text-gray-900 mt-1">Course Catalog Configured</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Next, formulate Course Outcomes (CO1–CO5) aligned with Bloom’s Taxonomy for the selected course.
          </p>
        </div>
        <Link
          href="/course-outcomes"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
        >
          Proceed to Course Outcomes <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
