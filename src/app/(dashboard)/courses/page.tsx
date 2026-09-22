'use client';

import React, { useState, useEffect } from 'react';
import { Course } from '@/data/mockData';
import { courseService } from '@/services/courseService';
import { CourseList } from '@/components/courses/CourseList';
import { CourseForm } from '@/components/courses/CourseForm';
import { CourseDetails } from '@/components/courses/CourseDetails';
import { Plus, Filter, Search } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    courseService.getCourses().then((data) => {
      setCourses(data);
      if (data.length > 0) setSelectedCourse(data[0]);
    });
  }, []);

  // Immutable state update: Adding a new course
  const handleAddCourse = async (newCourseData: Omit<Course, 'id'>) => {
    const created = await courseService.addCourse(newCourseData);
    setCourses((prevCourses) => [...prevCourses, created]);
    setSelectedCourse(created);
    setIsAddingCourse(false);
  };

  const filteredCourses = courses.filter((c) => {
    const matchesDept =
      departmentFilter === 'All' || c.departmentName.includes(departmentFilter);
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.facultyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
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
          </select>
        </div>
      </div>

      {/* Course Cards Grid Component */}
      <CourseList
        courses={filteredCourses}
        selectedCourseId={selectedCourse?.id}
        onSelectCourse={(course) => setSelectedCourse(course)}
      />
    </div>
  );
}
