import mongoose, { Schema, Document, Model } from 'mongoose';
import { mockCourses } from '@/data/mockData';

export interface ICourse extends Document {
  code: string;
  title: string;
  departmentId: string;
  departmentName: string;
  semester: number;
  credits: number;
  academicYear: string;
  facultyName: string;
  facultyId?: string;
  studentsEnrolled: number;
  coCount: number;
  status: 'In Progress' | 'Completed' | 'Pending Review';
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    departmentId: {
      type: String,
      default: 'dept-cse',
      index: true,
    },
    departmentName: {
      type: String,
      default: 'Computer Science & Engineering',
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 8,
      default: 1,
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: 1,
      max: 10,
      default: 3,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
    },
    facultyName: {
      type: String,
      default: 'Dr. Sarah Jenkins',
    },
    facultyId: {
      type: String,
    },
    studentsEnrolled: {
      type: Number,
      default: 60,
    },
    coCount: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Pending Review'],
      default: 'In Progress',
    },
  },
  {
    timestamps: true,
  }
);

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

/**
 * Seed initial courses into MongoDB if empty
 */
export async function seedInitialCourses() {
  const count = await Course.countDocuments();
  if (count === 0) {
    for (const c of mockCourses) {
      await Course.create({
        code: c.code,
        title: c.title,
        departmentId: c.departmentId,
        departmentName: c.departmentName,
        semester: c.semester,
        credits: c.credits,
        academicYear: c.academicYear,
        facultyName: c.facultyName,
        studentsEnrolled: c.studentsEnrolled,
        coCount: c.coCount,
        status: c.status,
      });
    }
    console.log('[Seed] Seeded initial courses into MongoDB');
  }
}
