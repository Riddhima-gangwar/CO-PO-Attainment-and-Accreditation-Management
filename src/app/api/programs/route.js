import { NextResponse } from 'next/server';
import { Program } from '@/models/Program';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';
export async function GET() {
    try {
        await ensureDatabaseSeeded();
        const programs = await Program.find().sort({ code: 1 });
        return NextResponse.json({
            success: true,
            count: programs.length,
            data: programs.map((p) => ({
                id: p._id.toString(),
                code: p.code,
                name: p.name,
                degree: p.degree,
                departmentId: p.departmentId,
                departmentName: p.departmentName,
                intake: p.intake,
                durationYears: p.durationYears,
                accreditationStatus: p.accreditationStatus,
                nbaCycleExpiry: p.nbaCycleExpiry,
            })),
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error fetching programs';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
export async function POST(request) {
    try {
        const auth = authenticateRequest(request, ['Admin', 'HOD']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const body = await request.json();
        const { code, name, degree = 'B.Tech', departmentName = 'Computer Science & Engineering', intake = 120 } = body;
        if (!code || !name) {
            return NextResponse.json({ success: false, error: 'code and name are required' }, { status: 400 });
        }
        await ensureDatabaseSeeded();
        const cleanCode = code.trim().toUpperCase();
        const existing = await Program.findOne({ code: cleanCode });
        if (existing) {
            return NextResponse.json({ success: false, error: `Program ${cleanCode} already exists` }, { status: 409 });
        }
        const newProg = await Program.create({
            code: cleanCode,
            name: name.trim(),
            degree,
            departmentName,
            intake: Number(intake),
            durationYears: 4,
            accreditationStatus: 'Eligible',
        });
        return NextResponse.json({
            success: true,
            message: 'Degree program registered successfully in MongoDB',
            data: {
                id: newProg._id.toString(),
                code: newProg.code,
                name: newProg.name,
                degree: newProg.degree,
                departmentName: newProg.departmentName,
                intake: newProg.intake,
                accreditationStatus: newProg.accreditationStatus,
            },
        }, { status: 201 });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error creating program';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
