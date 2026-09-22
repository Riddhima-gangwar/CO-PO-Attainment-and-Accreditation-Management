'use client';

import React, { useState, useEffect } from 'react';
import { Course, CourseOutcome, ProgramOutcome } from '@/data/mockData';
import { courseService } from '@/services/courseService';
import { outcomeService } from '@/services/outcomeService';
import { MappingTable } from '@/components/mapping/MappingTable';
import { BookOpen, Save, CheckCircle2 } from 'lucide-react';

export default function COPOMappingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [cos, setCOs] = useState<CourseOutcome[]>([]);
  const [pos, setPOs] = useState<ProgramOutcome[]>([]);
  const [mappings, setMappings] = useState<Record<string, number>>({});
  const [isSaved, setIsSaved] = useState(false);

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
        setMappings(mapData);
      });
      setIsSaved(false);
    }
  }, [selectedCourseId]);

  // Immutable state update: Cycling correlation value 0 -> 1 -> 2 -> 3 -> 0
  const handleCellClick = (coId: string, poId: string) => {
    const key = `${coId}_${poId}`;
    const currentScore = mappings[key] || 0;
    const nextScore = currentScore >= 3 ? 0 : currentScore + 1;

    setMappings((prevMappings) => ({
      ...prevMappings,
      [key]: nextScore,
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    await outcomeService.updateMapping(selectedCourseId, mappings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
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

        <button
          onClick={handleSave}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors text-sm font-medium flex items-center gap-2 shadow-blue-500/20"
        >
          {isSaved ? (
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
      <MappingTable
        cos={cos}
        pos={pos}
        mappings={mappings}
        onCellClick={handleCellClick}
      />
    </div>
  );
}
