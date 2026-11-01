import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { CO } from '@/models/CO';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';
import { mockCourseOutcomes } from '@/data/mockData';

const VALID_BLOOM_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    let cosList: any[] = [];

    try {
      await ensureDatabaseSeeded();
      const query = courseId ? { courseId } : {};
      const docs = await CO.find(query).sort({ code: 1 });
      cosList = docs.map((d) => ({
        id: d._id.toString(),
        courseId: d.courseId,
        code: d.code,
        statement: d.statement,
        bloomLevel: d.bloomLevel,
        targetAttainment: d.targetAttainment,
        actualAttainment: d.actualAttainment,
      }));
    } catch {
      // Fallback to mock
      cosList = courseId
        ? mockCourseOutcomes.filter((co) => co.courseId === courseId)
        : mockCourseOutcomes;
    }

    return NextResponse.json({
      success: true,
      count: cosList.length,
      data: cosList,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error fetching COs';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = authenticateRequest(request, ['Faculty', 'HOD', 'Admin']);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { courseId, code, statement, bloomLevel = 'Apply', targetAttainment = 70 } = body;

    if (!courseId || !code || !statement) {
      return NextResponse.json(
        { success: false, error: 'courseId, code, and statement are required fields' },
        { status: 400 }
      );
    }

    if (!VALID_BLOOM_LEVELS.includes(bloomLevel)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid bloomLevel. Must be one of: ${VALID_BLOOM_LEVELS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const cleanCode = code.trim().toUpperCase();

    // Check for duplicate CO code on the same course
    const existing = await CO.findOne({ courseId, code: cleanCode });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `${cleanCode} is already defined for this course` },
        { status: 409 }
      );
    }

    const newCO = await CO.create({
      courseId,
      code: cleanCode,
      statement: statement.trim(),
      bloomLevel,
      targetAttainment: Number(targetAttainment),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Course outcome formulated and persisted successfully',
        data: {
          id: newCO._id.toString(),
          courseId: newCO.courseId,
          code: newCO.code,
          statement: newCO.statement,
          bloomLevel: newCO.bloomLevel,
          targetAttainment: newCO.targetAttainment,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error creating CO';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = authenticateRequest(request, ['Faculty', 'HOD', 'Admin']);
    if (!auth.authenticated) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'CO id parameter required' }, { status: 400 });
    }

    await connectToDatabase();

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
    const deleted = await CO.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'CO not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Course Outcome ${deleted.code} deleted successfully`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error deleting CO';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
