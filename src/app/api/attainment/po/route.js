import { NextResponse } from 'next/server';
import { POAttainment } from '@/models/POAttainment';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const programId = searchParams.get('programId') || 'prog-btech-cse';
        await ensureDatabaseSeeded();
        const poList = await POAttainment.find({ programId }).sort({ poCode: 1 });
        return NextResponse.json({
            success: true,
            programId,
            count: poList.length,
            data: poList.map((p) => ({
                id: p._id.toString(),
                programId: p.programId,
                poCode: p.poCode,
                title: p.title,
                targetScore: p.targetScore,
                directAttainment: p.directAttainment,
                indirectAttainment: p.indirectAttainment,
                overallAttainment: p.overallAttainment,
                status: p.status,
                academicYear: p.academicYear,
            })),
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error retrieving PO attainment';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
