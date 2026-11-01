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
    const count = await COPOMap.countDocuments();
    if (count === 0) {
        const courseId = 'crs-1';
        for (const [key, level] of Object.entries(initialCourseMapping)) {
            const [coId, poId] = key.split('_');
            if (coId && poId) {
                await COPOMap.create({
                    courseId,
                    coId,
                    poId,
                    correlationLevel: level,
                });
            }
        }
        console.log('[Seed] Seeded initial CO-PO mappings into MongoDB');
    }
}
