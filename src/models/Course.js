import mongoose, { Schema } from 'mongoose';
import { mockCourses } from '@/data/mockData';
const CourseSchema = new Schema({
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
}, {
    timestamps: true,
});
export const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
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
