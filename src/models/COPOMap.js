import mongoose, { Schema } from 'mongoose';
import { initialCourseMapping } from '@/data/mockData';
const COPOMapSchema = new Schema({
    courseId: {
        type: String,
        required: true,
        index: true,
    },
    coId: {
        type: String,
        required: true,
        index: true,
    },
    poId: {
        type: String,
        required: true,
        index: true,
    },
    correlationLevel: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0,
        required: true,
    },
    justification: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});
COPOMapSchema.index({ courseId: 1, coId: 1, poId: 1 }, { unique: true });
export const COPOMap = mongoose.models.COPOMap || mongoose.model('COPOMap', COPOMapSchema);
export async function seedInitialMappings() {
    for (const [key, level] of Object.entries(initialCourseMapping)) {
        const [coId, poId] = key.split('_');
        if (coId && poId && level > 0) {
            // Determine corresponding courseId
            let courseId = 'crs-1';
            const coNum = parseInt(coId.replace(/\D/g, ''), 10);
            if (coNum >= 6 && coNum <= 10) courseId = 'crs-2';
            else if (coNum >= 11 && coNum <= 14) courseId = 'crs-3';
            else if (coNum >= 15 && coNum <= 19) courseId = 'crs-4';

            const existing = await COPOMap.findOne({ courseId, coId, poId });
            if (!existing) {
                await COPOMap.create({
                    courseId,
                    coId,
                    poId,
                    correlationLevel: level,
                });
            }
        }
    }
    console.log('[Seed] Verified and seeded initial CO-PO mappings into MongoDB');
}
