import mongoose, { Schema } from 'mongoose';
import { mockReports } from '@/data/mockData';
const ReportSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['NBA SSR', 'Attainment Register', 'Course Exit Survey', 'NAAC Criterion'],
        required: true,
    },
    department: {
        type: String,
        default: 'Computer Science & Engineering',
    },
    academicYear: {
        type: String,
        default: '2025-2026',
    },
    generatedDate: {
        type: String,
        default: () => new Date().toISOString().split('T')[0],
    },
    status: {
        type: String,
        enum: ['Ready', 'Draft', 'Archived'],
        default: 'Ready',
    },
    fileSize: {
        type: String,
        default: '2.4 MB',
    },
    generatedBy: {
        type: String,
        default: 'Dr. Elena Torres',
    },
}, {
    timestamps: true,
});
export const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);
export async function seedInitialReports() {
    for (const r of mockReports) {
        const existing = await Report.findOne({ title: r.title });
        if (!existing) {
            await Report.create({
                title: r.title,
                type: r.type,
                department: r.department,
                academicYear: r.academicYear,
                generatedDate: r.generatedDate,
                status: r.status,
                fileSize: r.fileSize,
            });
        }
    }
    console.log('[Seed] Verified and seeded unique reports into MongoDB');
}
