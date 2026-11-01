import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { COAttainment } from '@/models/COAttainment';
import { Course } from '@/models/Course';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { mockCOAttainmentList } from '@/data/mockData';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId') || 'crs-1';
        let attainmentList = [];
        let possibleCourseIds = [courseId];

        try {
            await ensureDatabaseSeeded();

            let course = null;
            if (mongoose.Types.ObjectId.isValid(courseId)) {
                course = await Course.findById(courseId);
            }
            if (!course) {
                course = await Course.findOne({
                    $or: [{ code: courseId.toUpperCase() }, { id: courseId }]
                });
            }
            if (course) {
                possibleCourseIds.push(course._id.toString(), course.code, course.code.toUpperCase());
                const legacyMap = { 'CS301': 'crs-1', 'CS302': 'crs-2', 'CS401': 'crs-3', 'EC305': 'crs-4' };
                if (legacyMap[course.code]) possibleCourseIds.push(legacyMap[course.code]);
            } else {
                const legacyReverse = { 'crs-1': 'CS301', 'crs-2': 'CS302', 'crs-3': 'CS401', 'crs-4': 'EC305' };
                if (legacyReverse[courseId]) possibleCourseIds.push(legacyReverse[courseId]);
            }

            const docs = await COAttainment.find({ courseId: { $in: possibleCourseIds } }).sort({ coCode: 1 });
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
                const filtered = mockCOAttainmentList.filter((a) => possibleCourseIds.includes(a.courseId));
                attainmentList = filtered.length > 0 ? filtered : mockCOAttainmentList;
            }
        }
        catch {
            const filtered = mockCOAttainmentList.filter((a) => possibleCourseIds.includes(a.courseId));
            attainmentList = filtered.length > 0 ? filtered : mockCOAttainmentList;
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
