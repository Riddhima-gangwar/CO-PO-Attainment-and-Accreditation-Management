import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { COPOMap } from '@/models/COPOMap';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';
import { initialCourseMapping } from '@/data/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId') || 'crs-1';

    let mappingDict: Record<string, number> = {};

    try {
      await ensureDatabaseSeeded();
      const docs = await COPOMap.find({ courseId });
      if (docs.length > 0) {
        docs.forEach((d) => {
          mappingDict[`${d.coId}_${d.poId}`] = d.correlationLevel;
        });
      } else {
        mappingDict = { ...initialCourseMapping };
      }
    } catch {
      mappingDict = { ...initialCourseMapping };
    }

    return NextResponse.json({
      success: true,
      courseId,
      count: Object.keys(mappingDict).length,
      data: mappingDict,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error retrieving mappings';
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
    const { courseId, mappings } = body;

    if (!courseId || !mappings) {
      return NextResponse.json(
        { success: false, error: 'courseId and mappings object are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Bulk upsert mappings in MongoDB
    const operations = Object.entries(mappings).map(([key, level]) => {
      const [coId, poId] = key.split('_');
      const correlationLevel = Math.max(0, Math.min(3, Number(level) || 0));

      return {
        updateOne: {
          filter: { courseId, coId, poId },
          update: {
            $set: {
              correlationLevel,
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    if (operations.length > 0) {
      await COPOMap.bulkWrite(operations);
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${operations.length} correlation mappings for course ${courseId}`,
      courseId,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error updating mapping matrix';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
