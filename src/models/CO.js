import mongoose, { Schema } from 'mongoose';
import { mockCourseOutcomes } from '@/data/mockData';
const COSchema = new Schema({
    courseId: {
        type: String,
        required: [true, 'Course ID is required'],
        index: true,
    },
    code: {
        type: String,
        required: [true, 'CO code is required'],
        uppercase: true,
        trim: true,
    },
    statement: {
        type: String,
        required: [true, 'CO statement is required'],
        trim: true,
    },
    bloomLevel: {
        type: String,
        enum: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
        required: true,
        default: 'Apply',
    },
    targetAttainment: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 70,
    },
    actualAttainment: {
        type: Number,
        min: 0,
        max: 100,
    },
}, {
    timestamps: true,
});
COSchema.index({ courseId: 1, code: 1 }, { unique: true });
export const CO = mongoose.models.CO || mongoose.model('CO', COSchema);
export async function seedInitialCOs() {
    for (const co of mockCourseOutcomes) {
        const existing = await CO.findOne({ courseId: co.courseId, code: co.code });
        if (!existing) {
            await CO.create({
                courseId: co.courseId,
                code: co.code,
                statement: co.statement,
                bloomLevel: co.bloomLevel,
                targetAttainment: co.targetAttainment,
                actualAttainment: co.actualAttainment,
            });
        }
    }
    console.log('[Seed] Verified and seeded initial Course Outcomes into MongoDB');
}
