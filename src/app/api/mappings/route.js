import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { COPOMap } from '@/models/COPOMap';
import { Course } from '@/models/Course';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';
import { initialCourseMapping } from '@/data/mockData';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId') || 'crs-1';
        let mappingDict = {};

        try {
            await ensureDatabaseSeeded();
            await connectToDatabase();

            let course = null;
            if (mongoose.Types.ObjectId.isValid(courseId)) {
                course = await Course.findById(courseId);
            }
            if (!course) {
                course = await Course.findOne({
                    $or: [{ code: courseId.toUpperCase() }, { id: courseId }],
                });
            }

            const legacyMap = { CS301: 'crs-1', CS302: 'crs-2', CS401: 'crs-3', EC305: 'crs-4' };
            const legacyReverse = { 'crs-1': 'CS301', 'crs-2': 'CS302', 'crs-3': 'CS401', 'crs-4': 'EC305' };

            const possibleCourseIds = [courseId];
            if (course) {
                possibleCourseIds.push(course._id.toString(), course.code, course.code.toUpperCase());
                if (legacyMap[course.code]) possibleCourseIds.push(legacyMap[course.code]);
            } else {
                if (legacyReverse[courseId]) possibleCourseIds.push(legacyReverse[courseId]);
            }

            const docs = await COPOMap.find({ courseId: { $in: possibleCourseIds } });

            if (docs.length > 0) {
                docs.forEach((d) => {
                    const rawKey = `${d.coId}_${d.poId}`;
                    mappingDict[rawKey] = d.correlationLevel;

                    const coNum = parseInt(d.coId.replace(/\D/g, ''), 10);
                    const poNum = parseInt(d.poId.replace(/\D/g, ''), 10);
                    if (coNum && poNum) {
                        mappingDict[`CO${coNum}_PO${poNum}`] = d.correlationLevel;
                        mappingDict[`co-${coNum}_po-${poNum}`] = d.correlationLevel;
                    }
                });
            } else {
                mappingDict = { ...initialCourseMapping };
            }
        } catch {
            mappingDict = { ...initialCourseMapping };
        }

        return NextResponse.json({
            success: true,
            courseId,
            count: Object.keys(mappingDict).length,
            data: mappingDict,
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error retrieving mappings';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const auth = authenticateRequest(request, ['Faculty', 'HOD', 'Admin', 'Accreditation']);
        if (!auth.authenticated && process.env.NODE_ENV === 'production') {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const body = await request.json();
        const { courseId, mappings } = body;
        if (!courseId || !mappings) {
            return NextResponse.json(
                { success: false, error: 'courseId and mappings object are required' },
                { status: 400 }
            );
        }
        await connectToDatabase();

        // 1. Resolve Course and Target Course IDs
        let course = null;
        if (mongoose.Types.ObjectId.isValid(courseId)) {
            course = await Course.findById(courseId);
        }
        if (!course) {
            course = await Course.findOne({
                $or: [{ code: courseId.toUpperCase() }, { id: courseId }],
            });
        }

        const legacyMap = { CS301: 'crs-1', CS302: 'crs-2', CS401: 'crs-3', EC305: 'crs-4' };
        const legacyReverse = { 'crs-1': 'CS301', 'crs-2': 'CS302', 'crs-3': 'CS401', 'crs-4': 'EC305' };

        const courseCode = course ? course.code : (legacyReverse[courseId] || courseId);
        const legacyCourseId = legacyMap[courseCode] || (courseId.startsWith('crs-') ? courseId : 'crs-1');
        const mongoCourseId = course ? course._id.toString() : courseId;

        const targetCourseIds = Array.from(new Set([courseCode, legacyCourseId, mongoCourseId]));

        // 2. Build fast, targeted operations
        const bulkOps = [];
        const now = new Date();

        for (const [key, level] of Object.entries(mappings)) {
            const parts = key.split('_');
            if (parts.length !== 2) continue;

            const coNum = parseInt(parts[0].replace(/\D/g, ''), 10);
            const poNum = parseInt(parts[1].replace(/\D/g, ''), 10);
            if (!coNum || !poNum) continue;

            const correlationLevel = Math.max(0, Math.min(3, Number(level) || 0));

            let legacyCoId = `co-${coNum}`;
            if (legacyCourseId === 'crs-2') legacyCoId = `co-${coNum + 5}`;
            else if (legacyCourseId === 'crs-3') legacyCoId = `co-${coNum + 10}`;
            else if (legacyCourseId === 'crs-4') legacyCoId = `co-${coNum + 14}`;

            const legacyPoId = `po-${poNum}`;
            const codeCo = `CO${coNum}`;
            const codePo = `PO${poNum}`;

            for (const cId of targetCourseIds) {
                // 1. Compass legacy document: courseId: "crs-1", coId: "co-1", poId: "po-1"
                bulkOps.push({
                    updateOne: {
                        filter: { courseId: cId, coId: legacyCoId, poId: legacyPoId },
                        update: { $set: { correlationLevel, updatedAt: now } },
                        upsert: true,
                    },
                });

                // 2. Standard code document: courseId: "CS301", coId: "CO1", poId: "PO1"
                bulkOps.push({
                    updateOne: {
                        filter: { courseId: cId, coId: codeCo, poId: codePo },
                        update: { $set: { correlationLevel, updatedAt: now } },
                        upsert: true,
                    },
                });
            }
        }

        if (bulkOps.length > 0) {
            await COPOMap.bulkWrite(bulkOps, { ordered: false });
        }

        return NextResponse.json({
            success: true,
            message: `Updated correlation mappings for ${courseCode} in MongoDB`,
            courseId,
            updatedAt: now.toISOString(),
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error updating mapping matrix';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
