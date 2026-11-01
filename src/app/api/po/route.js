import { NextResponse } from 'next/server';
import { PO } from '@/models/PO';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { mockProgramOutcomes } from '@/data/mockData';
function naturalSortPOs(list) {
    return [...list].sort((a, b) => {
        const numA = parseInt(a.code.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.code.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
    });
}

export async function GET() {
    try {
        let posList = [];
        try {
            await ensureDatabaseSeeded();
            const docs = await PO.find();
            const sortedDocs = naturalSortPOs(docs);
            posList = sortedDocs.map((d) => ({
                id: d._id.toString(),
                code: d.code,
                title: d.title,
                statement: d.statement,
                targetScore: d.targetScore,
            }));
        }
        catch {
            posList = naturalSortPOs(mockProgramOutcomes);
        }
        return NextResponse.json({
            success: true,
            count: posList.length,
            data: posList,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error fetching POs';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
