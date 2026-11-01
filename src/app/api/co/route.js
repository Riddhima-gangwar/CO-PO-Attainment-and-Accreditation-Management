import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { CO } from '@/models/CO';
import { Course } from '@/models/Course';
import { COPOMap } from '@/models/COPOMap';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';
import { mockCourseOutcomes } from '@/data/mockData';

const VALID_BLOOM_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

function naturalSortCOs(list) {
    return [...list].sort((a, b) => {
        const numA = parseInt(a.code.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.code.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
    });
}

export async function GET(request) {
    let possibleCourseIds = [];
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');
        let cosList = [];

        if (courseId) {
            possibleCourseIds.push(courseId);
        }

        try {
            await ensureDatabaseSeeded();
            await connectToDatabase();

            if (courseId) {
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
            }

            const query = courseId ? { courseId: { $in: possibleCourseIds } } : {};
            let docs = await CO.find(query);

            // If this course has no COs in DB yet, auto-seed from mockCourseOutcomes into MongoDB
            if (courseId && docs.length === 0) {
                const matchMocks = mockCourseOutcomes.filter(co => possibleCourseIds.includes(co.courseId));
                if (matchMocks.length > 0) {
                    for (const m of matchMocks) {
                        try {
                            const created = await CO.create({
                                courseId: courseId,
                                code: m.code,
                                statement: m.statement,
                                bloomLevel: m.bloomLevel,
                                targetAttainment: m.targetAttainment,
                                actualAttainment: m.actualAttainment,
                            });
                            docs.push(created);
                        } catch {
                            // Ignore race conditions
                        }
                    }
                }
            }

            // Deduplicate by code so each CO (CO1, CO2, etc.) appears exactly once
            const seenCodes = new Set();
            const uniqueDocs = [];
            for (const doc of docs) {
                const norm = doc.code.toUpperCase();
                if (!seenCodes.has(norm)) {
                    seenCodes.add(norm);
                    uniqueDocs.push(doc);
                }
            }

            cosList = naturalSortCOs(uniqueDocs).map((d) => ({
                id: d._id.toString(),
                courseId: d.courseId,
                code: d.code,
                statement: d.statement,
                bloomLevel: d.bloomLevel,
                targetAttainment: d.targetAttainment,
                actualAttainment: d.actualAttainment,
            }));
        }
        catch {
            // Fallback to mock
            const fallbackList = courseId
                ? mockCourseOutcomes.filter((co) => possibleCourseIds.includes(co.courseId))
                : mockCourseOutcomes;
            const seenMockCodes = new Set();
            const uniqueMocks = [];
            for (const m of fallbackList) {
                const norm = m.code.toUpperCase();
                if (!seenMockCodes.has(norm)) {
                    seenMockCodes.add(norm);
                    uniqueMocks.push(m);
                }
            }
            cosList = naturalSortCOs(uniqueMocks);
        }

        return NextResponse.json({
            success: true,
            count: cosList.length,
            data: cosList,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error fetching COs';
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
        const { courseId, code, statement, bloomLevel = 'Apply', targetAttainment = 70 } = body;
        if (!courseId || !code || !statement) {
            return NextResponse.json({ success: false, error: 'courseId, code, and statement are required fields' }, { status: 400 });
        }
        if (!VALID_BLOOM_LEVELS.includes(bloomLevel)) {
            return NextResponse.json({
                success: false,
                error: `Invalid bloomLevel. Must be one of: ${VALID_BLOOM_LEVELS.join(', ')}`,
            }, { status: 400 });
        }
        await connectToDatabase();
        const cleanCode = code.trim().toUpperCase();
        // Check for duplicate CO code on the same course
        const existing = await CO.findOne({ courseId, code: cleanCode });
        if (existing) {
            return NextResponse.json({ success: false, error: `${cleanCode} is already defined for this course` }, { status: 409 });
        }
        const newCO = await CO.create({
            courseId,
            code: cleanCode,
            statement: statement.trim(),
            bloomLevel,
            targetAttainment: Number(targetAttainment),
        });

        // Update coCount on the corresponding course
        try {
            const courseQuery = mongoose.Types.ObjectId.isValid(courseId)
                ? { _id: courseId }
                : { $or: [{ code: courseId.toUpperCase() }, { id: courseId }] };
            await Course.updateOne(courseQuery, { $inc: { coCount: 1 } });
        } catch {
            // Non-critical
        }

        return NextResponse.json({
            success: true,
            message: 'Course outcome formulated and persisted successfully',
            data: {
                id: newCO._id.toString(),
                courseId: newCO.courseId,
                code: newCO.code,
                statement: newCO.statement,
                bloomLevel: newCO.bloomLevel,
                targetAttainment: newCO.targetAttainment,
            },
        }, { status: 201 });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error creating CO';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
export async function DELETE(request) {
    try {
        const auth = authenticateRequest(request, ['Faculty', 'HOD', 'Admin']);
        if (!auth.authenticated) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ success: false, error: 'CO id parameter required' }, { status: 400 });
        }
        await connectToDatabase();
        const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id };
        const deleted = await CO.findOneAndDelete(query);
        if (!deleted) {
            return NextResponse.json({ success: false, error: 'CO not found' }, { status: 404 });
        }

        // Clean up mappings associated with this CO
        try {
            await COPOMap.deleteMany({
                $or: [{ coId: deleted._id.toString() }, { coId: deleted.code }, { coId: id }]
            });
            const courseQuery = mongoose.Types.ObjectId.isValid(deleted.courseId)
                ? { _id: deleted.courseId }
                : { $or: [{ code: deleted.courseId.toUpperCase() }, { id: deleted.courseId }] };
            await Course.updateOne(courseQuery, { $inc: { coCount: -1 } });
        } catch {
            // Non-critical
        }

        return NextResponse.json({
            success: true,
            message: `Course Outcome ${deleted.code} deleted successfully`,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Error deleting CO';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
