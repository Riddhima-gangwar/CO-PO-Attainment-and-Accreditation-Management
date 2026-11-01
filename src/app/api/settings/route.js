import { NextResponse } from 'next/server';
import { Settings, seedInitialSettings } from '@/models/Settings';
import { connectToDatabase, getDbConnectionState } from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';

/**
 * GET /api/settings
 * Retrieves active institutional parameters, attainment calculation weights, and database health
 */
export async function GET(request) {
    try {
        await connectToDatabase();
        await seedInitialSettings();

        let settings = await Settings.findOne({ key: 'institutional_parameters' });
        if (!settings) {
            settings = await Settings.create({
                key: 'institutional_parameters',
                directAssessmentWeightage: 80,
                indirectSurveyWeightage: 20,
                passingBenchmark: 60,
                level3Threshold: 70,
                level2Threshold: 60,
                level1Threshold: 50,
                academicYear: '2024-2025',
                currentTerm: 'Even Semester (Spring: Semesters 2, 4, 6, 8)',
                institutionName: 'National Institute of Engineering & Technology',
                department: 'Computer Science & Engineering',
                updatedBy: 'System Default',
            });
        }

        const dbState = getDbConnectionState();

        return NextResponse.json({
            success: true,
            data: {
                id: settings._id.toString(),
                key: settings.key,
                directAssessmentWeightage: settings.directAssessmentWeightage,
                indirectSurveyWeightage: settings.indirectSurveyWeightage,
                passingBenchmark: settings.passingBenchmark,
                level3Threshold: settings.level3Threshold ?? 70,
                level2Threshold: settings.level2Threshold ?? 60,
                level1Threshold: settings.level1Threshold ?? 50,
                academicYear: settings.academicYear,
                currentTerm: settings.currentTerm,
                institutionName: settings.institutionName,
                department: settings.department,
                updatedBy: settings.updatedBy,
                updatedAt: settings.updatedAt,
            },
            database: {
                status: dbState.isConnected ? 'Connected' : 'Connecting/Active',
                uri: dbState.uri || 'mongodb://localhost:27017/outcome360',
                sessionSecurity: 'HMAC-SHA256 JWT (15-Minute Expiry & Auto-Logout)',
            },
        });
    } catch (error) {
        console.error('[Settings GET Error]', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Error retrieving settings',
                // Fallback default configuration
                data: {
                    directAssessmentWeightage: 80,
                    indirectSurveyWeightage: 20,
                    passingBenchmark: 60,
                    level3Threshold: 70,
                    level2Threshold: 60,
                    level1Threshold: 50,
                    academicYear: '2024-2025',
                    currentTerm: 'Even Semester (Spring: Semesters 2, 4, 6, 8)',
                    institutionName: 'National Institute of Engineering & Technology',
                    department: 'Computer Science & Engineering',
                },
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/settings
 * Saves and updates institutional parameters in MongoDB
 */
export async function POST(request) {
    try {
        await connectToDatabase();

        // Check authentication if present, but allow settings update for active staff roles
        let updatedBy = 'Administrator';
        const auth = authenticateRequest(request);
        if (auth.authenticated && auth.user?.name) {
            updatedBy = `${auth.user.name} (${auth.user.role || 'Admin'})`;
        }

        const body = await request.json();

        // 1. Parse and sanitize weightage values
        let directWeight = Number(body.directAssessmentWeightage);
        let indirectWeight = Number(body.indirectSurveyWeightage);

        if (isNaN(directWeight) || directWeight < 0 || directWeight > 100) {
            directWeight = 80;
        }

        if (isNaN(indirectWeight) || indirectWeight < 0 || indirectWeight > 100) {
            indirectWeight = 100 - directWeight;
        }

        // Enforce Direct + Indirect = 100%
        if (directWeight + indirectWeight !== 100) {
            indirectWeight = Math.max(0, 100 - directWeight);
        }

        // 2. Passing Benchmark
        let passingBenchmark = Number(body.passingBenchmark);
        if (isNaN(passingBenchmark) || passingBenchmark < 20 || passingBenchmark > 100) {
            passingBenchmark = 60;
        }

        // 3. Rubric Level Thresholds
        let level3Threshold = Number(body.level3Threshold);
        if (isNaN(level3Threshold) || level3Threshold <= 0 || level3Threshold > 100) {
            level3Threshold = 70;
        }

        let level2Threshold = Number(body.level2Threshold);
        if (isNaN(level2Threshold) || level2Threshold <= 0 || level2Threshold > 100) {
            level2Threshold = 60;
        }

        let level1Threshold = Number(body.level1Threshold);
        if (isNaN(level1Threshold) || level1Threshold <= 0 || level1Threshold > 100) {
            level1Threshold = 50;
        }

        // 4. Academic Calendar Cycle
        const academicYear = body.academicYear || '2024-2025';
        const currentTerm = body.currentTerm || 'Even Semester (Spring: Semesters 2, 4, 6, 8)';

        // 5. Institutional Info
        const institutionName = body.institutionName || 'National Institute of Engineering & Technology';
        const department = body.department || 'Computer Science & Engineering';

        // 6. Persist to MongoDB
        const updated = await Settings.findOneAndUpdate(
            { key: 'institutional_parameters' },
            {
                $set: {
                    directAssessmentWeightage: directWeight,
                    indirectSurveyWeightage: indirectWeight,
                    passingBenchmark,
                    level3Threshold,
                    level2Threshold,
                    level1Threshold,
                    academicYear,
                    currentTerm,
                    institutionName,
                    department,
                    updatedBy,
                },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Institutional parameters and OBE calculation formulas updated successfully',
            data: {
                id: updated._id.toString(),
                key: updated.key,
                directAssessmentWeightage: updated.directAssessmentWeightage,
                indirectSurveyWeightage: updated.indirectSurveyWeightage,
                passingBenchmark: updated.passingBenchmark,
                level3Threshold: updated.level3Threshold,
                level2Threshold: updated.level2Threshold,
                level1Threshold: updated.level1Threshold,
                academicYear: updated.academicYear,
                currentTerm: updated.currentTerm,
                institutionName: updated.institutionName,
                department: updated.department,
                updatedBy: updated.updatedBy,
                updatedAt: updated.updatedAt,
            },
        });
    } catch (error) {
        console.error('[Settings POST Error]', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Error updating settings',
            },
            { status: 500 }
        );
    }
}

