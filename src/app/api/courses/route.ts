import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';
import { mockCourses } from '@/data/mockData';

/**
 * GET /api/courses
 * Retrieves courses from MongoDB with filtering support.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let coursesData: any[] = [];
    let isDbLive = false;

    try {
      await ensureDatabaseSeeded();
      const query: any = {};

      if (department && department !== 'All') {
        query.departmentName = { $regex: department, $options: 'i' };
      }

      if (status && status !== 'All') {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { facultyName: { $regex: search, $options: 'i' } },
        ];
      }

      const docs = await Course.find(query).sort({ code: 1 });
      coursesData = docs.map((d) => ({
        id: d._id.toString(),
        code: d.code,
        title: d.title,
        departmentId: d.departmentId,
        departmentName: d.departmentName,
        semester: d.semester,
        credits: d.credits,
        academicYear: d.academicYear,
        facultyName: d.facultyName,
        studentsEnrolled: d.studentsEnrolled,
        coCount: d.coCount,
        status: d.status,
      }));
      isDbLive = true;
    } catch {
      // Graceful fallback to mock courses
      let list = [...mockCourses];
      if (department && department !== 'All') {
        list = list.filter((c) => c.departmentName.toLowerCase().includes(department.toLowerCase()));
      }
      if (status && status !== 'All') {
        list = list.filter((c) => c.status === status);
      }
      coursesData = list;
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: coursesData.length,
      data: coursesData,
      isDbLive,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to retrieve courses';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * POST /api/courses
 * Creates a new academic course.
 * Protected: Admin, HOD, Faculty.
 */
export async function POST(request: Request) {
  try {
    // 1. Enforce Server-Side Role Authorization
    const auth = authenticateRequest(request, ['Admin', 'HOD', 'Faculty']);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();

    if (!body.code || !body.title) {
      return NextResponse.json(
        { success: false, error: 'Course code and course title are required fields' },
        { status: 400 }
      );
    }

    const cleanCode = body.code.trim().toUpperCase();

    await connectToDatabase();

    // 2. Prevent Duplicate Course Records
    const existing = await Course.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Course with code '${cleanCode}' already exists` },
        { status: 409 }
      );
    }

    // 3. Create Course in MongoDB
    const newCourse = await Course.create({
      code: cleanCode,
      title: body.title.trim(),
      departmentId: body.departmentId || 'dept-cse',
      departmentName: body.departmentName || 'Computer Science & Engineering',
      semester: Number(body.semester) || 1,
      credits: Number(body.credits) || 3,
      academicYear: body.academicYear || '2025-2026',
      facultyName: body.facultyName || auth.user?.name || 'Dr. Sarah Jenkins',
      studentsEnrolled: Number(body.studentsEnrolled) || 60,
      coCount: Number(body.coCount) || 5,
      status: body.status || 'In Progress',
    });

    const responseCourse = {
      id: newCourse._id.toString(),
      code: newCourse.code,
      title: newCourse.title,
      departmentId: newCourse.departmentId,
      departmentName: newCourse.departmentName,
      semester: newCourse.semester,
      credits: newCourse.credits,
      academicYear: newCourse.academicYear,
      facultyName: newCourse.facultyName,
      studentsEnrolled: newCourse.studentsEnrolled,
      coCount: newCourse.coCount,
      status: newCourse.status,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Course created and persisted to MongoDB successfully',
        data: responseCourse,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Malformed course payload';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
