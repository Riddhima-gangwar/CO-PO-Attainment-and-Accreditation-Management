import { NextResponse } from 'next/server';
import { COAttainment } from '@/models/COAttainment';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { mockCOAttainmentList } from '@/data/mockData';
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId') || 'crs-1';
        let attainmentList = [];
        try {
            await ensureDatabaseSeeded();
            const docs = await COAttainment.find({ courseId }).sort({ coCode: 1 });
            if (docs.length > 0) {
                attainmentList = docs.map((d) => ({
                    id: d._id.toString(),
                    courseId: d.courseId,
                    coCode: d.coCode,
                    statement: d.statement,
                    targetPercent: d.targetPercent,
                    directScore: d.directScore,
                    indirectScore: d.indirectScore,
                    overallAttainment: d.overallAttainment,
                    attainmentLevel: d.attainmentLevel,
                    status: d.status,
                }));
            }
            else {
                attainmentList = mockCOAttainmentList;
            }
        }
        catch {
            attainmentList = mockCOAttainmentList;
        }
        return NextResponse.json({
            success: true,
            courseId,
            count: attainmentList.length,
            data: attainmentList,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error retrieving CO attainment';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
