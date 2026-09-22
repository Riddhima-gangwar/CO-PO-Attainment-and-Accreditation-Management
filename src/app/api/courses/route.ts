import { NextResponse } from 'next/server';
import { mockCourses } from '@/data/mockData';

/**
 * GET /api/courses
 * Minimal representative API endpoint for Week 5 Foundation Checkpoint.
 * Returns the institutional course catalog with outcome metadata.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');

    let courses = [...mockCourses];

    if (department && department !== 'All') {
      courses = courses.filter((c) =>
        c.departmentName.toLowerCase().includes(department.toLowerCase())
      );
    }

    if (status && status !== 'All') {
      courses = courses.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve academic courses',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/courses
 * Creates a new course entry in the catalog.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.code || !body.title) {
      return NextResponse.json(
        { success: false, error: 'Course code and title are required' },
        { status: 400 }
      );
    }

    const newCourse = {
      id: `crs-${Date.now()}`,
      code: body.code.toUpperCase(),
      title: body.title,
      departmentId: body.departmentId || 'dept-cse',
      departmentName: body.departmentName || 'Computer Science & Engineering',
      semester: Number(body.semester) || 1,
      credits: Number(body.credits) || 3,
      academicYear: body.academicYear || '2025-2026',
      facultyName: body.facultyName || 'Unassigned Faculty',
      studentsEnrolled: Number(body.studentsEnrolled) || 60,
      coCount: Number(body.coCount) || 0,
      status: body.status || 'In Progress',
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Course registered successfully',
        data: newCourse,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Malformed course payload' },
      { status: 500 }
    );
  }
}
