import { NextResponse } from 'next/server';
import { AccreditationCriterion, seedInitialCriteria } from '@/models/AccreditationCriterion';
import { Report } from '@/models/Report';
import { ensureDatabaseSeeded } from '@/lib/dbSeeder';
import { authenticateRequest } from '@/lib/auth';

/**
 * GET /api/accreditation
 * Retrieves all 9 NBA Tier-I criteria, sub-criteria breakdowns, and aggregate readiness summary
 */
export async function GET() {
    try {
        await ensureDatabaseSeeded();
        await seedInitialCriteria();

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
                readinessStatus:
                    overallPercentage >= 75
                        ? 'Ready for NBA Tier-I Evaluation'
                        : overallPercentage >= 60
                        ? 'Substantially Compliant (Minor Gaps)'
                        : 'Remediation Required',
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
                subCriteria: c.subCriteria || [],
                updatedAt: c.updatedAt,
            })),
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error fetching criteria';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

/**
 * PUT /api/accreditation
 * Updates an accreditation criterion's attained marks, status, and sub-criteria scores
 */
export async function PUT(request) {
    try {
        await ensureDatabaseSeeded();

        const body = await request.json();
        const { id, criterionNumber, attainedMarks, status, description, subCriteria } = body;

        let query = {};
        if (id) {
            query._id = id;
        } else if (criterionNumber != null) {
            query.criterionNumber = Number(criterionNumber);
        } else {
            return NextResponse.json(
                { success: false, error: 'Criterion ID or criterionNumber is required' },
                { status: 400 }
            );
        }

        const criterion = await AccreditationCriterion.findOne(query);
        if (!criterion) {
            return NextResponse.json(
                { success: false, error: 'Accreditation criterion not found' },
                { status: 404 }
            );
        }

        // Validate attained marks
        let newAttained = Number(attainedMarks);
        if (isNaN(newAttained) || newAttained < 0) {
            newAttained = criterion.attainedMarks;
        }
        if (newAttained > criterion.maxMarks) {
            newAttained = criterion.maxMarks;
        }

        const percentageScore =
            criterion.maxMarks > 0 ? Math.round((newAttained / criterion.maxMarks) * 1000) / 10 : 0;

        // Auto-derive status if not explicitly provided
        let newStatus = status;
        if (!newStatus) {
            if (percentageScore >= 75) newStatus = 'Compliant';
            else if (percentageScore >= 60) newStatus = 'Substantially Compliant';
            else newStatus = 'Remediation Required';
        }

        criterion.attainedMarks = newAttained;
        criterion.percentageScore = percentageScore;
        criterion.status = newStatus;
        if (description !== undefined) criterion.description = description;
        if (Array.isArray(subCriteria)) criterion.subCriteria = subCriteria;

        await criterion.save();

        // Recalculate global summary
        const allCriteria = await AccreditationCriterion.find().sort({ criterionNumber: 1 });
        const totalMax = allCriteria.reduce((sum, c) => sum + (c.maxMarks || 0), 0);
        const totalAttained = allCriteria.reduce((sum, c) => sum + (c.attainedMarks || 0), 0);
        const overallPercentage = totalMax > 0 ? Math.round((totalAttained / totalMax) * 1000) / 10 : 0;

        return NextResponse.json({
            success: true,
            message: `Criterion ${criterion.code} updated successfully`,
            data: {
                id: criterion._id.toString(),
                criterionNumber: criterion.criterionNumber,
                code: criterion.code,
                name: criterion.name,
                maxMarks: criterion.maxMarks,
                attainedMarks: criterion.attainedMarks,
                percentageScore: criterion.percentageScore,
                description: criterion.description,
                status: criterion.status,
                subCriteria: criterion.subCriteria,
                updatedAt: criterion.updatedAt,
            },
            summary: {
                totalMaxMarks: totalMax,
                totalAttainedMarks: totalAttained,
                overallPercentage,
                readinessStatus:
                    overallPercentage >= 75
                        ? 'Ready for NBA Tier-I Evaluation'
                        : overallPercentage >= 60
                        ? 'Substantially Compliant (Minor Gaps)'
                        : 'Remediation Required',
            },
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error updating criterion';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

/**
 * POST /api/accreditation
 * Generates an official Self-Study Report (SSR) document bundle and registers it into Reports
 */
export async function POST(request) {
    try {
        await ensureDatabaseSeeded();

        const body = await request.json().catch(() => ({}));
        const academicYear = body.academicYear || '2024-2025';
        const department = body.department || 'Computer Science & Engineering';

        const criteria = await AccreditationCriterion.find().sort({ criterionNumber: 1 });
        const totalMax = criteria.reduce((sum, c) => sum + (c.maxMarks || 0), 0);
        const totalAttained = criteria.reduce((sum, c) => sum + (c.attainedMarks || 0), 0);
        const overallPercentage = totalMax > 0 ? Math.round((totalAttained / totalMax) * 1000) / 10 : 0;

        const reportTitle = `NBA Tier-I Self-Study Report (SSR) - ${department} (${academicYear})`;

        // Register or update in Reports collection
        const existingReport = await Report.findOne({ title: reportTitle });
        let reportDoc = existingReport;
        if (!existingReport) {
            reportDoc = await Report.create({
                title: reportTitle,
                type: 'NBA SSR',
                department,
                academicYear,
                status: 'Ready',
                fileSize: '3.8 MB',
                generatedBy: 'NBA Steering Committee',
            });
        }

        return NextResponse.json({
            success: true,
            message: 'NBA Tier-I SSR Document compiled successfully',
            report: {
                id: reportDoc._id.toString(),
                title: reportDoc.title,
                type: reportDoc.type,
                academicYear: reportDoc.academicYear,
                department: reportDoc.department,
                status: reportDoc.status,
                fileSize: reportDoc.fileSize,
            },
            summary: {
                totalMaxMarks: totalMax,
                totalAttainedMarks: totalAttained,
                overallPercentage,
                readinessStatus:
                    overallPercentage >= 75
                        ? 'Ready for NBA Tier-I Evaluation'
                        : 'Substantially Compliant',
            },
            criteria: criteria.map((c) => ({
                criterionNumber: c.criterionNumber,
                code: c.code,
                name: c.name,
                maxMarks: c.maxMarks,
                attainedMarks: c.attainedMarks,
                percentageScore: c.percentageScore,
                status: c.status,
            })),
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Error generating SSR document';
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
