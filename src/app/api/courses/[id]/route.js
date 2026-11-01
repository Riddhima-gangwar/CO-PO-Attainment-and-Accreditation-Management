import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';
import { CO } from '@/models/CO';
import { COPOMap } from '@/models/COPOMap';
import { authenticateRequest } from '@/lib/auth';
import { mockCourses } from '@/data/mockData';
export async function GET(request, context) {
    try {
        const { id } = await context.params;
        let foundCourse = null;
        try {
            await connectToDatabase();
            if (mongoose.Types.ObjectId.isValid(id)) {
                foundCourse = await Course.findById(id);
            }
            if (!foundCourse) {
                foundCourse = await Course.findOne({
                    $or: [{ code: id.toUpperCase() }, { id: id }],
                });
            }
        }
        catch {
            // Ignore db error
        }
        if (!foundCourse) {
            const mock = mockCourses.find((c) => c.id === id || c.code.toLowerCase() === id.toLowerCase());
            if (mock)
                foundCourse = mock;
        }
        if (!foundCourse) {
            return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
        }
        const data = {
            id: foundCourse._id ? foundCourse._id.toString() : foundCourse.id,
            code: foundCourse.code,
            title: foundCourse.title,
            departmentId: foundCourse.departmentId,
            departmentName: foundCourse.departmentName,
            semester: foundCourse.semester,
            credits: foundCourse.credits,
            academicYear: foundCourse.academicYear,
            facultyName: foundCourse.facultyName,
            studentsEnrolled: foundCourse.studentsEnrolled,
            coCount: foundCourse.coCount,
            status: foundCourse.status,
        };
        return NextResponse.json({ success: true, data });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error retrieving course';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
export async function PUT(request, context) {
    try {
        // Role Authorization: Admin, HOD, Faculty can update courses
        const auth = authenticateRequest(request, ['Admin', 'HOD', 'Faculty']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const { id } = await context.params;
        const body = await request.json();
        await connectToDatabase();
        const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { code: id.toUpperCase() };
        const updated = await Course.findOneAndUpdate(query, {
            $set: {
                ...(body.title && { title: body.title.trim() }),
                ...(body.credits && { credits: Number(body.credits) }),
                ...(body.semester && { semester: Number(body.semester) }),
                ...(body.academicYear && { academicYear: body.academicYear }),
                ...(body.facultyName && { facultyName: body.facultyName }),
                ...(body.studentsEnrolled && { studentsEnrolled: Number(body.studentsEnrolled) }),
                ...(body.coCount && { coCount: Number(body.coCount) }),
                ...(body.status && { status: body.status }),
            },
        }, { new: true });
        if (!updated) {
            return NextResponse.json({ success: false, error: 'Course not found to update' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: 'Course updated successfully',
            data: {
                id: updated._id.toString(),
                code: updated.code,
                title: updated.title,
                departmentId: updated.departmentId,
                departmentName: updated.departmentName,
                semester: updated.semester,
                credits: updated.credits,
                academicYear: updated.academicYear,
                facultyName: updated.facultyName,
                studentsEnrolled: updated.studentsEnrolled,
                coCount: updated.coCount,
                status: updated.status,
            },
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error updating course';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
export async function DELETE(request, context) {
    try {
        // Only Admin and HOD can delete courses
        const auth = authenticateRequest(request, ['Admin', 'HOD']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const { id } = await context.params;
        await connectToDatabase();
        const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { code: id.toUpperCase() };
        const deleted = await Course.findOneAndDelete(query);
        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Course not found to delete' }, { status: 404 });
        }
        // Cascade delete associated Course Outcomes and Mappings
        const courseIdentifier = deleted.code;
        await CO.deleteMany({ $or: [{ courseId: deleted._id.toString() }, { courseId: courseIdentifier }] });
        await COPOMap.deleteMany({ $or: [{ courseId: deleted._id.toString() }, { courseId: courseIdentifier }] });
        return NextResponse.json({
            success: true,
            message: `Course ${deleted.code} and associated outcomes deleted successfully`,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error deleting course';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
