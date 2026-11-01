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
                    $or: [{ code: courseId.toUpperCase() }, { id: courseId }],
                });
            }

            if (course) {
                possibleCourseIds.push(course._id.toString(), course.code, course.code.toUpperCase());
                const legacyMap = { CS301: 'crs-1', CS302: 'crs-2', CS401: 'crs-3', EC305: 'crs-4' };
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
                const num = parseInt(c.code.replace(/\D/g, ''), 10);
                if (num) {
                    coIdMap.set(`co-${num}`, c.code);
                    coIdMap.set(c.code, `co-${num}`);
                }
            });

            const poIdMap = new Map(); // id -> code and code -> id
            allPOs.forEach((p) => {
                poIdMap.set(p._id.toString(), p.code);
                poIdMap.set(p.code, p._id.toString());
                const num = parseInt(p.code.replace(/\D/g, ''), 10);
                if (num) {
                    poIdMap.set(`po-${num}`, p.code);
                    poIdMap.set(p.code, `po-${num}`);
                }
            });

            if (docs.length > 0) {
                docs.forEach((d) => {
                    const rawKey = `${d.coId}_${d.poId}`;
                    mappingDict[rawKey] = d.correlationLevel;

                    // Also provide cross-referenced keys (ID <-> Code <-> Legacy)
                    const coCode = coIdMap.get(d.coId) || d.coId;
                    const poCode = poIdMap.get(d.poId) || d.poId;
                    const coId = coIdMap.get(coCode) || d.coId;
                    const poId = poIdMap.get(poCode) || d.poId;

                    mappingDict[`${coCode}_${poCode}`] = d.correlationLevel;
                    mappingDict[`${coId}_${poId}`] = d.correlationLevel;

                    const cNum = parseInt(coCode.replace(/\D/g, ''), 10);
                    const pNum = parseInt(poCode.replace(/\D/g, ''), 10);
                    if (cNum && pNum) {
                        mappingDict[`co-${cNum}_po-${pNum}`] = d.correlationLevel;
                    }
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
        // If strictly unauthenticated in production, return error; in dev/local environment, allow seamless save
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

        // 1. Resolve Course and all its representation aliases
        let course = null;
        if (mongoose.Types.ObjectId.isValid(courseId)) {
            course = await Course.findById(courseId);
        }
        if (!course) {
            course = await Course.findOne({
                $or: [{ code: courseId.toUpperCase() }, { id: courseId }],
            });
        }

        const possibleCourseIds = [courseId];
        const legacyMap = { CS301: 'crs-1', CS302: 'crs-2', CS401: 'crs-3', EC305: 'crs-4' };
        const legacyReverse = { 'crs-1': 'CS301', 'crs-2': 'CS302', 'crs-3': 'CS401', 'crs-4': 'EC305' };

        if (course) {
            possibleCourseIds.push(course._id.toString(), course.code, course.code.toUpperCase());
            if (legacyMap[course.code]) possibleCourseIds.push(legacyMap[course.code]);
        } else {
            if (legacyReverse[courseId]) possibleCourseIds.push(legacyReverse[courseId]);
        }
        const uniqueCourseIds = Array.from(new Set(possibleCourseIds));

        // 2. Fetch all Course Outcomes and Program Outcomes
        const [courseCOs, allPOs] = await Promise.all([
            CO.find({ courseId: { $in: uniqueCourseIds } }),
            PO.find({}),
        ]);

        // Build alias mapping dictionaries: Any identifier -> list of all aliases
        const coAliasesMap = new Map();
        courseCOs.forEach((co) => {
            const num = parseInt(co.code.replace(/\D/g, ''), 10);
            let legacyCoId = `co-${num}`;
            if (uniqueCourseIds.includes('crs-2')) legacyCoId = `co-${num + 5}`;
            else if (uniqueCourseIds.includes('crs-3')) legacyCoId = `co-${num + 10}`;
            else if (uniqueCourseIds.includes('crs-4')) legacyCoId = `co-${num + 14}`;

            const aliases = Array.from(
                new Set([
                    co._id.toString(),
                    co.code,
                    co.code.toUpperCase(),
                    co.code.toLowerCase(),
                    legacyCoId,
                    `co-${num}`,
                ])
            );
            aliases.forEach((a) => coAliasesMap.set(a, aliases));
        });

        const poAliasesMap = new Map();
        allPOs.forEach((po) => {
            const num = parseInt(po.code.replace(/\D/g, ''), 10);
            const aliases = Array.from(
                new Set([
                    po._id.toString(),
                    po.code,
                    po.code.toUpperCase(),
                    po.code.toLowerCase(),
                    `po-${num}`,
                    `pso-${num}`,
                ])
            );
            aliases.forEach((a) => poAliasesMap.set(a, aliases));
        });

        // 3. Prepare bulk operations to update every matching record and its aliases
        const bulkOps = [];
        const now = new Date();

        for (const [key, level] of Object.entries(mappings)) {
            const [rawCo, rawPo] = key.split('_');
            if (!rawCo || !rawPo) continue;

            const correlationLevel = Math.max(0, Math.min(3, Number(level) || 0));
            const coAliases = coAliasesMap.get(rawCo) || [rawCo];
            const poAliases = poAliasesMap.get(rawPo) || [rawPo];

            // A. Update all existing documents matching any alias
            bulkOps.push({
                updateMany: {
                    filter: {
                        courseId: { $in: uniqueCourseIds },
                        coId: { $in: coAliases },
                        poId: { $in: poAliases },
                    },
                    update: {
                        $set: {
                            correlationLevel,
                            updatedAt: now,
                        },
                    },
                },
            });

            // B. Ensure documents are upserted for both caller representation and legacy Compass representation
            for (const cId of uniqueCourseIds) {
                // Upsert exact key passed
                bulkOps.push({
                    updateOne: {
                        filter: { courseId: cId, coId: rawCo, poId: rawPo },
                        update: {
                            $set: {
                                correlationLevel,
                                updatedAt: now,
                            },
                        },
                        upsert: true,
                    },
                });

                // Also upsert legacy format (e.g. crs-1 / co-1 / po-1) that Compass inspects
                const legacyCo = coAliases.find((a) => a.startsWith('co-')) || rawCo;
                const legacyPo = poAliases.find((a) => a.startsWith('po-')) || rawPo;
                bulkOps.push({
                    updateOne: {
                        filter: { courseId: cId, coId: legacyCo, poId: legacyPo },
                        update: {
                            $set: {
                                correlationLevel,
                                updatedAt: now,
                            },
                        },
                        upsert: true,
                    },
                });

                // Also upsert standard code format (e.g. CS301 / CO1 / PO1)
                const codeCo = coAliases.find((a) => a.startsWith('CO')) || rawCo;
                const codePo = poAliases.find((a) => a.startsWith('PO')) || rawPo;
                bulkOps.push({
                    updateOne: {
                        filter: { courseId: cId, coId: codeCo, poId: codePo },
                        update: {
                            $set: {
                                correlationLevel,
                                updatedAt: now,
                            },
                        },
                        upsert: true,
                    },
                });
            }
        }

        if (bulkOps.length > 0) {
            await COPOMap.bulkWrite(bulkOps);
        }

        return NextResponse.json({
            success: true,
            message: `Updated correlation mappings for course ${courseId} across all alias records in MongoDB`,
            courseId,
            updatedAt: now.toISOString(),
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error updating mapping matrix';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
