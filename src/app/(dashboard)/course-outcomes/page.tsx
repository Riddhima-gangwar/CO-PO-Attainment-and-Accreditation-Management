'use client';

import React, { useState, useEffect } from 'react';
import { Course, CourseOutcome } from '@/data/mockData';
import { courseService } from '@/services/courseService';
import { outcomeService } from '@/services/outcomeService';
import { COList } from '@/components/outcomes/COList';
import { COForm } from '@/components/outcomes/COForm';
import { Plus, Target, BookOpen } from 'lucide-react';

export default function CourseOutcomesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [outcomes, setOutcomes] = useState<CourseOutcome[]>([]);
  const [isAddingCO, setIsAddingCO] = useState(false);

  useEffect(() => {
    courseService.getCourses().then((data) => {
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourseId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      outcomeService.getCOs(selectedCourseId).then((data) => {
        setOutcomes(data);
      });
    }
  }, [selectedCourseId]);

  // Immutable state update: Adding a Course Outcome
  const handleAddCO = (newCoData: Omit<CourseOutcome, 'id'>) => {
    const created: CourseOutcome = {
      ...newCoData,
      id: `co-${Date.now()}`,
    };
    setOutcomes((prev) => [...prev, created]);
    setIsAddingCO(false);
  };

  // Immutable state update: Deleting a Course Outcome
  const handleDeleteCO = (id: string) => {
    setOutcomes((prev) => prev.filter((co) => co.id !== id));
  };

  const currentCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Course Outcomes (CO) Management
          </h1>
          <p className="text-gray-500 mt-1">
            Formulate measurable outcomes aligned with Bloom’s Taxonomy and set attainment benchmarks
          </p>
        </div>

        {!isAddingCO && (
          <button
            onClick={() => setIsAddingCO(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium flex items-center gap-2 shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" /> Define Course Outcome
          </button>
        )}
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
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setIsAddingCO(false);
              }}
              className="text-sm font-medium border-0 text-gray-900 bg-transparent focus:ring-0 cursor-pointer p-0 pr-6"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title} ({course.departmentName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentCourse && (
          <div className="flex items-center gap-4 text-xs text-gray-500 w-full sm:w-auto justify-end">
            <span>Faculty: <strong>{currentCourse.facultyName}</strong></span>
            <span>Total COs: <strong>{outcomes.length}</strong></span>
          </div>
        )}
      </div>

      {/* Add CO Form */}
      {isAddingCO && (
        <COForm
          courseId={selectedCourseId}
          nextCoNumber={outcomes.length + 1}
          onSubmit={handleAddCO}
          onCancel={() => setIsAddingCO(false)}
        />
      )}

      {/* Outcomes Grid */}
      <COList cos={outcomes} onDeleteCO={handleDeleteCO} />
    </div>
  );
}
