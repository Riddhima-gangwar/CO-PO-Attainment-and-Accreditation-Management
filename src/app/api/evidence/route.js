import { NextResponse } from 'next/server';
import { EvidenceDocument } from '@/models/EvidenceDocument';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');
        const criterionId = searchParams.get('criterionId');
        const category = searchParams.get('category');

        await ensureDatabaseSeeded();
        const query = {};
        if (courseId && courseId !== 'All') query.courseId = courseId;
        if (criterionId && criterionId !== 'All') query.criterionId = criterionId;
        if (category && category !== 'All') query.category = category;

        const docs = await EvidenceDocument.find(query).sort({ createdAt: -1 });
        return NextResponse.json({
            success: true,
            count: docs.length,
            data: docs.map((d) => ({
                id: d._id.toString(),
                criterionId: d.criterionId,
                courseId: d.courseId,
                title: d.title,
                category: d.category,
                uploadedBy: d.uploadedBy,
                academicYear: d.academicYear,
                fileSize: d.fileSize,
                status: d.status,
                complianceScore: d.complianceScore,
            })),
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error fetching evidence';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const auth = authenticateRequest(request, ['Faculty', 'HOD', 'Accreditation', 'Admin']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const body = await request.json();
        const {
            criterionId = 'crit-3',
            courseId = 'crs-1',
            title,
            category = 'Course File',
            fileSize = '2.4 MB',
            complianceScore = 90,
            academicYear = '2025-2026',
        } = body;

        if (!title || !title.trim()) {
            return NextResponse.json({ success: false, error: 'Evidence title is required' }, { status: 400 });
        }

        await ensureDatabaseSeeded();
        const newEvidence = await EvidenceDocument.create({
            criterionId,
            courseId,
            title: title.trim(),
            category,
            uploadedBy: auth.user?.name || 'Dr. Sarah Jenkins',
            academicYear,
            fileSize,
            status: 'Verified',
            complianceScore: Number(complianceScore) || 90,
        });

        return NextResponse.json({
            success: true,
            message: 'Evidence document record registered in MongoDB',
            data: {
                id: newEvidence._id.toString(),
                criterionId: newEvidence.criterionId,
                courseId: newEvidence.courseId,
                title: newEvidence.title,
                category: newEvidence.category,
                uploadedBy: newEvidence.uploadedBy,
                academicYear: newEvidence.academicYear,
                fileSize: newEvidence.fileSize,
                status: newEvidence.status,
                complianceScore: newEvidence.complianceScore,
            },
        }, { status: 201 });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error recording evidence';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const auth = authenticateRequest(request, ['Faculty', 'HOD', 'Accreditation', 'Admin']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ success: false, error: 'Evidence id is required' }, { status: 400 });
        }
        await ensureDatabaseSeeded();
        const deleted = await EvidenceDocument.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Evidence document not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: `Evidence document '${deleted.title}' deleted successfully`,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error deleting evidence';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
