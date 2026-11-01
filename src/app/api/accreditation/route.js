import { NextResponse } from 'next/server';
import { AccreditationCriterion } from '@/models/AccreditationCriterion';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
export async function GET() {
    try {
        await ensureDatabaseSeeded();
        const criteria = await AccreditationCriterion.find().sort({ criterionNumber: 1 });
        const totalMax = criteria.reduce((sum, c) => sum + (c.maxMarks || 0), 0);
        const totalAttained = criteria.reduce((sum, c) => sum + (c.attainedMarks || 0), 0);
        const overallPercentage = totalMax > 0 ? Math.round((totalAttained / totalMax) * 1000) / 10 : 0;
        return NextResponse.json({
            success: true,
            count: criteria.length,
            summary: {
                totalMaxMarks: totalMax,
                totalAttainedMarks: totalAttained,
                overallPercentage,
                readinessStatus: overallPercentage >= 75 ? 'Ready for NBA Tier-I Evaluation' : 'Remediation Required',
            },
            data: criteria.map((c) => ({
                id: c._id.toString(),
                criterionNumber: c.criterionNumber,
                code: c.code,
                name: c.name,
                maxMarks: c.maxMarks,
                attainedMarks: c.attainedMarks,
                percentageScore: c.percentageScore,
                description: c.description,
                status: c.status,
            })),
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error fetching criteria';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
