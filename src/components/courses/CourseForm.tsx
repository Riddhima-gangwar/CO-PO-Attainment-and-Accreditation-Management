'use client';

import React, { useState } from 'react';
import { Course } from '@/data/mockData';
import { Plus, X } from 'lucide-react';

interface CourseFormProps {
  onSubmit: (course: Omit<Course, 'id'>) => void;
  onCancel: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, onCancel }) => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [departmentName, setDepartmentName] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState(3);
  const [credits, setCredits] = useState(4);
  const [facultyName, setFacultyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    onSubmit({
      code: code.trim().toUpperCase(),
      title: title.trim(),
      departmentId: 'dept-cse',
      departmentName,
      semester: Number(semester),
      credits: Number(credits),
      academicYear: '2025-2026',
      facultyName: facultyName.trim() || 'Unassigned Faculty',
      studentsEnrolled: 60,
      coCount: 5,
      status: 'In Progress',
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Add New Academic Course</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Course Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CS305"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Course Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Computer Science & Engineering</option>
              <option>Electronics & Communication</option>
              <option>Mechanical Engineering</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Semester
            </label>
            <input
              type="number"
              min={1}
              max={8}
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Credits
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Course Incharge / Faculty
          </label>
          <input
            type="text"
            placeholder="e.g. Dr. Rajesh Khanna"
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add Course
          </button>
        </div>
      </form>
    </div>
  );
};
