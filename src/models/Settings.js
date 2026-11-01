import mongoose, { Schema } from 'mongoose';

const SettingsSchema = new Schema(
    {
        key: {
            type: String,
            default: 'institutional_parameters',
            unique: true,
            index: true,
        },
        // Attainment Weightage Formulas
        directAssessmentWeightage: {
            type: Number,
            required: true,
            default: 80,
            min: 0,
            max: 100,
        },
        indirectSurveyWeightage: {
            type: Number,
            required: true,
            default: 20,
            min: 0,
            max: 100,
        },
        passingBenchmark: {
            type: Number,
            required: true,
            default: 60,
            min: 0,
            max: 100,
        },
        // NBA Rubric Thresholds
        level3Threshold: {
            type: Number,
            required: true,
            default: 70,
            min: 0,
            max: 100,
        },
        level2Threshold: {
            type: Number,
            required: true,
            default: 60,
            min: 0,
            max: 100,
        },
        level1Threshold: {
            type: Number,
            required: true,
            default: 50,
            min: 0,
            max: 100,
        },
        // Academic Calendar Cycle
        academicYear: {
            type: String,
            required: true,
            default: '2024-2025',
        },
        currentTerm: {
            type: String,
            required: true,
            default: 'Even Semester (Spring: Semesters 2, 4, 6, 8)',
        },
        // Institutional Info
        institutionName: {
            type: String,
            default: 'National Institute of Engineering & Technology',
        },
        department: {
            type: String,
            default: 'Computer Science & Engineering',
        },
        // Audit details
        updatedBy: {
            type: String,
            default: 'System Administrator',
        },
    },
    {
        timestamps: true,
    }
);

export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

/**
 * Ensures default institutional settings exist in MongoDB
 */
export async function seedInitialSettings() {
    const existing = await Settings.findOne({ key: 'institutional_parameters' });
    if (!existing) {
        await Settings.create({
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
            updatedBy: 'System Initializer',
        });
        console.log('[Seed] Seeded default Institutional Settings into MongoDB');
    }
}

