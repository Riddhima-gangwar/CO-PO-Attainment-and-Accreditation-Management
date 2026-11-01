import { NextResponse } from 'next/server';
import { StudentMark } from '@/models/StudentMark';
import { COAttainment } from '@/models/COAttainment';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId') || 'crs-1';
        const coCode = searchParams.get('coCode');
        await ensureDatabaseSeeded();
        const query = { courseId };
        if (coCode)
            query.coCode = coCode;
        const marks = await StudentMark.find(query).sort({ studentRoll: 1, coCode: 1 });
        return NextResponse.json({
            success: true,
            courseId,
            count: marks.length,
            data: marks.map((m) => ({
                id: m._id.toString(),
                studentId: m.studentId,
                studentRoll: m.studentRoll,
                studentName: m.studentName,
                courseId: m.courseId,
                assessmentId: m.assessmentId,
                coCode: m.coCode,
                marksObtained: m.marksObtained,
                maxMarks: m.maxMarks,
                percentage: m.percentage,
            })),
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error retrieving marks';
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
        const { courseId, assessmentId = 'asm-manual', marks } = body;
        if (!courseId || !marks || !Array.isArray(marks) || marks.length === 0) {
            return NextResponse.json({ success: false, error: 'courseId and non-empty marks array are required' }, { status: 400 });
        }
        await ensureDatabaseSeeded();
        // 1. Ingest marks into MongoDB
        for (const m of marks) {
            const percentage = m.maxMarks > 0 ? (m.marksObtained / m.maxMarks) * 100 : 0;
            await StudentMark.findOneAndUpdate({
                courseId,
                studentRoll: m.studentRoll,
                coCode: m.coCode,
                assessmentId,
            }, {
                $set: {
                    studentId: m.studentId || `std-${m.studentRoll.toLowerCase()}`,
                    studentName: m.studentName,
                    marksObtained: Number(m.marksObtained),
                    maxMarks: Number(m.maxMarks),
                    percentage,
                },
            }, { upsert: true, new: true });
        }
        // 2. Real-time Attainment Recalculation Engine for Course Outcomes
        // NBA Rubric Threshold: calculate % of students scoring >= 60% of marks for each CO
        const coCodes = Array.from(new Set(marks.map((m) => m.coCode)));
        for (const co of coCodes) {
            const allCoMarks = await StudentMark.find({ courseId, coCode: co });
            if (allCoMarks.length > 0) {
                const thresholdMarksCount = allCoMarks.filter((record) => (record.percentage || 0) >= 60).length;
                const directPercent = Math.round((thresholdMarksCount / allCoMarks.length) * 1000) / 10;
                // Composite calculation: 80% Direct + 20% Indirect survey (default 75% for indirect)
                const indirectScore = 78.0;
                const totalAttainment = Math.round((0.8 * directPercent + 0.2 * indirectScore) * 10) / 10;
                // Level derivation: Level 3 (>=70%), Level 2 (60-69%), Level 1 (50-59%), Level 0 (<50%)
                let level = 0;
                if (totalAttainment >= 70)
                    level = 3;
                else if (totalAttainment >= 60)
                    level = 2;
                else if (totalAttainment >= 50)
                    level = 1;
                const targetPercent = 65;
                const status = totalAttainment >= targetPercent ? 'Met' : 'Unmet';
                await COAttainment.findOneAndUpdate({ courseId, coCode: co }, {
                    $set: {
                        directScore: directPercent,
                        indirectScore,
                        overallAttainment: totalAttainment,
                        attainmentLevel: level,
                        status,
                        targetPercent,
                    },
                }, { upsert: true });
            }
        }
        return NextResponse.json({
            success: true,
            message: `Successfully recorded ${marks.length} marks and recalculated CO attainment`,
            courseId,
            recalculatedCOs: coCodes,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error ingesting student marks';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
