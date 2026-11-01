import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { COPOMap } from '@/models/COPOMap';
import { Course } from '@/models/Course';
import { CO } from '@/models/CO';
import { PO } from '@/models/PO';
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

            let possibleCourseIds = [courseId];
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

            const docs = await COPOMap.find({ courseId: { $in: possibleCourseIds } });

            // Fetch COs and POs to enable bi-directional mapping (by ID and by Code)
            const [courseCOs, allPOs] = await Promise.all([
                CO.find({ courseId: { $in: possibleCourseIds } }),
                PO.find({}),
            ]);

            const coIdMap = new Map(); // id -> code and code -> id
            courseCOs.forEach((c) => {
                coIdMap.set(c._id.toString(), c.code);
                coIdMap.set(c.code, c._id.toString());
            });

            const poIdMap = new Map(); // id -> code and code -> id
            allPOs.forEach((p) => {
                poIdMap.set(p._id.toString(), p.code);
                poIdMap.set(p.code, p._id.toString());
            });

            if (docs.length > 0) {
                docs.forEach((d) => {
                    const rawKey = `${d.coId}_${d.poId}`;
                    mappingDict[rawKey] = d.correlationLevel;

                    // Also provide cross-referenced keys (ID <-> Code)
                    const coCode = coIdMap.get(d.coId) || d.coId;
                    const poCode = poIdMap.get(d.poId) || d.poId;
                    const coId = coIdMap.get(coCode) || d.coId;
                    const poId = poIdMap.get(poCode) || d.poId;

                    mappingDict[`${coCode}_${poCode}`] = d.correlationLevel;
                    mappingDict[`${coId}_${poId}`] = d.correlationLevel;
                });
            } else {
                // Populate from initialCourseMapping
                Object.entries(initialCourseMapping).forEach(([key, level]) => {
                    mappingDict[key] = level;
                    const [cKey, pKey] = key.split('_');
                    if (cKey && pKey) {
                        const cId = coIdMap.get(cKey);
                        const pId = poIdMap.get(pKey);
                        if (cId && pId) {
                            mappingDict[`${cId}_${pId}`] = level;
                        }
                    }
                });
            }
        }
        catch {
            mappingDict = { ...initialCourseMapping };
        }

        return NextResponse.json({
            success: true,
            courseId,
            count: Object.keys(mappingDict).length,
            data: mappingDict,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error retrieving mappings';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const auth = authenticateRequest(request, ['Faculty', 'HOD', 'Admin', 'Accreditation']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const body = await request.json();
        const { courseId, mappings } = body;
        if (!courseId || !mappings) {
            return NextResponse.json({ success: false, error: 'courseId and mappings object are required' }, { status: 400 });
        }
        await connectToDatabase();

        // Bulk upsert mappings in MongoDB
        const operations = Object.entries(mappings).map(([key, level]) => {
            const [coId, poId] = key.split('_');
            const correlationLevel = Math.max(0, Math.min(3, Number(level) || 0));
            return {
                updateOne: {
                    filter: { courseId, coId, poId },
                    update: {
                        $set: {
                            correlationLevel,
                            updatedAt: new Date(),
                        },
                    },
                    upsert: true,
                },
            };
        });
        if (operations.length > 0) {
            await COPOMap.bulkWrite(operations);
        }
        return NextResponse.json({
            success: true,
            message: `Updated ${operations.length} correlation mappings for course ${courseId}`,
            courseId,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error updating mapping matrix';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
