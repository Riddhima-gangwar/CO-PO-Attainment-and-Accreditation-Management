'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/data/mockData';
import { courseService } from '@/services/courseService';
import { attainmentService, AssessmentItem } from '@/services/attainmentService';
import {
  ClipboardList,
  Plus,
  BookOpen,
  ArrowRight,
  PenTool,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

export default function AssessmentsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('crs-1');
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState('CIE_1');
  const [maxMarks, setMaxMarks] = useState(50);
  const [weightage, setWeightage] = useState(25);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    courseService.getCourses().then((cList) => {
      setCourses(cList);
      if (cList.length > 0) setSelectedCourseId(cList[0].id);
    });
  }, []);

  const fetchAssessments = () => {
    if (!selectedCourseId) return;
    setLoading(true);
    attainmentService
      .getAssessments(selectedCourseId)
      .then((data) => setAssessments(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAssessments();
  }, [selectedCourseId]);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await attainmentService.addAssessment({
        courseId: selectedCourseId,
        type,
        title,
        maxMarks,
        weightage,
      });
      setIsModalOpen(false);
      setTitle('');
      fetchAssessments();
    } catch (err: unknown) {
      alert('Error creating assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const currentCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Assessment Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              Evaluation Instruments
            </span>
          </div>
          <p className="text-gray-500 mt-1">
            Configure Continuous Internal Evaluations (CIE), Assignments, and Semester End Exams
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/student-marks"
            className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 font-semibold text-sm flex items-center gap-1.5"
          >
            <PenTool className="w-4 h-4 text-gray-500" /> Enter Student Marks
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Assessment
          </button>
        </div>
      </div>

      {/* Course Selector */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <BookOpen className="h-5 w-5 text-blue-600 shrink-0" />
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Course Context
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="text-sm font-semibold border-0 text-gray-900 bg-transparent focus:ring-0 cursor-pointer p-0 pr-6"
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
          <div className="text-xs text-gray-500 flex items-center gap-3">
            <span>Semester: <strong>{currentCourse.semester}</strong></span>
            <span>Credits: <strong>{currentCourse.credits}</strong></span>
            <span>Faculty: <strong>{currentCourse.facultyName}</strong></span>
          </div>
        )}
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assessments.map((a) => (
          <div key={a.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase tracking-wider">
                  {a.type.replace(/_/g, ' ')}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2">{a.title}</h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-gray-900">{a.maxMarks}</span>
                <span className="text-xs text-gray-400 block">Max Marks</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1 font-medium">
                <Layers className="w-3.5 h-3.5 text-gray-400" /> Weightage: <strong>{a.weightage}%</strong>
              </span>
              <Link
                href="/student-marks"
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                Input Scores <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assessment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Add Assessment Instrument</h2>
            <p className="text-xs text-gray-500 mb-4">
              Configure exam paper structure and CO threshold parameters
            </p>

            <form onSubmit={handleCreateAssessment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Assessment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Assessment Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="CIE_1">CIE 1 (Midterm 1)</option>
                  <option value="CIE_2">CIE 2 (Midterm 2)</option>
                  <option value="Assignment">Assignment / Problem Set</option>
                  <option value="Quiz">Continuous Quiz</option>
                  <option value="Lab_Exam">Practical Lab Examination</option>
                  <option value="Semester_End_Exam">Semester End Examination (SEE)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Weightage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={weightage}
                    onChange={(e) => setWeightage(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
