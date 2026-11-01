import { NextResponse } from 'next/server';
import { PSO } from '@/models/PSO';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';
export async function GET() {
    try {
        let psoList = [];
        try {
            await ensureDatabaseSeeded();
            const docs = await PSO.find().sort({ code: 1 });
            psoList = docs.map((d) => ({
                id: d._id.toString(),
                code: d.code,
                title: d.title,
                statement: d.statement,
                targetScore: d.targetScore,
                programId: d.programId,
            }));
        }
        catch {
            psoList = [
                {
                    id: 'pso-1',
                    code: 'PSO1',
                    title: 'System Software & Architecture',
                    statement: 'Apply standard software engineering principles, algorithms, and system architectures to construct robust and scalable computing applications.',
                    targetScore: 2.4,
                    programId: 'prog-btech-cse',
                },
                {
                    id: 'pso-2',
                    code: 'PSO2',
                    title: 'Data Intelligence & Cloud Computing',
                    statement: 'Utilize machine learning, data engineering, and modern cloud deployment pipelines to extract actionable insights and automate institutional workflows.',
                    targetScore: 2.3,
                    programId: 'prog-btech-cse',
                },
            ];
        }
        return NextResponse.json({
            success: true,
            count: psoList.length,
            data: psoList,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error fetching PSOs';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
export async function POST(request) {
    try {
        const auth = authenticateRequest(request, ['HOD', 'Admin']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const body = await request.json();
        const { code, title, statement, targetScore = 2.5, programId = 'prog-btech-cse' } = body;
        if (!code || !title || !statement) {
            return NextResponse.json({ success: false, error: 'Code, title, and statement are required' }, { status: 400 });
        }
        await ensureDatabaseSeeded();
        const cleanCode = code.trim().toUpperCase();
        const existing = await PSO.findOne({ programId, code: cleanCode });
        if (existing) {
            return NextResponse.json({ success: false, error: `${cleanCode} already exists for this program` }, { status: 409 });
        }
        const newPSO = await PSO.create({
            code: cleanCode,
            title: title.trim(),
            statement: statement.trim(),
            targetScore: Number(targetScore),
            programId,
        });
        return NextResponse.json({
            success: true,
            message: 'Program Specific Outcome formulated successfully',
            data: {
                id: newPSO._id.toString(),
                code: newPSO.code,
                title: newPSO.title,
                statement: newPSO.statement,
                targetScore: newPSO.targetScore,
                programId: newPSO.programId,
            },
        }, { status: 201 });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error creating PSO';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
