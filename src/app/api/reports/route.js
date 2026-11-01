import { NextResponse } from 'next/server';
import { Report } from '@/models/Report';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';
import { mockReports } from '@/data/mockData';
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        let reportsList = [];
        try {
            await ensureDatabaseSeeded();
            const query = type && type !== 'All' ? { type } : {};
            const docs = await Report.find(query).sort({ createdAt: -1 });
            reportsList = docs.map((d) => ({
                id: d._id.toString(),
                title: d.title,
                type: d.type,
                department: d.department,
                academicYear: d.academicYear,
                generatedDate: d.generatedDate,
                status: d.status,
                fileSize: d.fileSize,
                generatedBy: d.generatedBy,
            }));
        }
        catch {
            reportsList = mockReports;
        }
        return NextResponse.json({
            success: true,
            count: reportsList.length,
            data: reportsList,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error retrieving reports';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
export async function POST(request) {
    try {
        const auth = authenticateRequest(request, ['Accreditation', 'HOD', 'Admin', 'Faculty']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const body = await request.json();
        const { title, type = 'NBA SSR', department = 'Computer Science & Engineering', academicYear = '2025-2026' } = body;
        if (!title) {
            return NextResponse.json({ success: false, error: 'Report title is required' }, { status: 400 });
        }
        await ensureDatabaseSeeded();
        const newReport = await Report.create({
            title: title.trim(),
            type,
            department,
            academicYear,
            generatedDate: new Date().toISOString().split('T')[0],
            status: 'Ready',
            fileSize: '3.1 MB',
            generatedBy: auth.user?.name || 'Dr. Elena Torres',
        });
        return NextResponse.json({
            success: true,
            message: 'Accreditation report generated and stored in MongoDB',
            data: {
                id: newReport._id.toString(),
                title: newReport.title,
                type: newReport.type,
                department: newReport.department,
                academicYear: newReport.academicYear,
                generatedDate: newReport.generatedDate,
                status: newReport.status,
                fileSize: newReport.fileSize,
            },
        }, { status: 201 });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error generating report';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const auth = authenticateRequest(request, ['Accreditation', 'HOD', 'Admin', 'Faculty']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ success: false, error: 'Report id is required' }, { status: 400 });
        }
        await ensureDatabaseSeeded();
        const deleted = await Report.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: `Report '${deleted.title}' deleted successfully`,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error deleting report';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
