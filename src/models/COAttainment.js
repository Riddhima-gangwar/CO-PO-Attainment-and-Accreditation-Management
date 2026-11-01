import mongoose, { Schema } from 'mongoose';
import { mockCOAttainmentList } from '@/data/mockData';
const COAttainmentSchema = new Schema({
    courseId: {
        type: String,
        required: true,
        index: true,
    },
    coCode: {
        type: String,
        required: true,
        index: true,
    },
    statement: {
        type: String,
        default: '',
    },
    targetPercent: {
        type: Number,
        required: true,
        default: 70,
    },
    directScore: {
        type: Number,
        required: true,
        default: 0,
    },
    indirectScore: {
        type: Number,
        required: true,
        default: 0,
    },
    overallAttainment: {
        type: Number,
        required: true,
        default: 0,
    },
    attainmentLevel: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 1,
    },
    status: {
        type: String,
        enum: ['Met', 'Unmet'],
        default: 'Unmet',
    },
}, {
    timestamps: true,
});
COAttainmentSchema.index({ courseId: 1, coCode: 1 }, { unique: true });
export const COAttainment = mongoose.models.COAttainment ||
    mongoose.model('COAttainment', COAttainmentSchema);
export async function seedInitialCOAttainment() {
    const count = await COAttainment.countDocuments();
    if (count === 0) {
        for (const a of mockCOAttainmentList) {
            await COAttainment.create({
                courseId: a.courseId,
                coCode: a.coCode,
                statement: a.statement,
                targetPercent: a.targetPercent,
                directScore: a.directScore,
                indirectScore: a.indirectScore,
                overallAttainment: a.overallAttainment,
                attainmentLevel: a.attainmentLevel,
                status: a.status,
            });
        }
        console.log('[Seed] Seeded initial CO Attainment records into MongoDB');
    }
}
