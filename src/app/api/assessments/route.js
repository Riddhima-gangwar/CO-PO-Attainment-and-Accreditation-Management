import { NextResponse } from 'next/server';
import { Assessment } from '@/models/Assessment';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId') || 'crs-1';
        await ensureDatabaseSeeded();
        const assessments = await Assessment.find({ courseId }).sort({ createdAt: 1 });
        return NextResponse.json({
            success: true,
            courseId,
            count: assessments.length,
            data: assessments.map((a) => ({
                id: a._id.toString(),
                courseId: a.courseId,
                type: a.type,
                title: a.title,
                maxMarks: a.maxMarks,
                weightage: a.weightage,
                coMappings: a.coMappings || [],
            })),
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error fetching assessments';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
export async function POST(request) {
    try {
        const auth = authenticateRequest(request, ['Faculty', 'HOD', 'Admin']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const body = await request.json();
        const { courseId, type, title, maxMarks = 50, weightage = 20, coMappings } = body;
        if (!courseId || !type || !title) {
            return NextResponse.json({ success: false, error: 'courseId, type, and title are required fields' }, { status: 400 });
        }
        await ensureDatabaseSeeded();
        const newAssessment = await Assessment.create({
            courseId,
            type,
            title: title.trim(),
            maxMarks: Number(maxMarks),
            weightage: Number(weightage),
            coMappings: coMappings || [],
        });
        return NextResponse.json({
            success: true,
            message: 'Assessment configured and saved to MongoDB',
            data: {
                id: newAssessment._id.toString(),
                courseId: newAssessment.courseId,
                type: newAssessment.type,
                title: newAssessment.title,
                maxMarks: newAssessment.maxMarks,
                weightage: newAssessment.weightage,
            },
        }, { status: 201 });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error creating assessment';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
