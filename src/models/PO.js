import mongoose, { Schema } from 'mongoose';
import { mockProgramOutcomes } from '@/data/mockData';
const POSchema = new Schema({
    code: {
        type: String,
        required: [true, 'PO code is required'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'PO title is required'],
        trim: true,
    },
    statement: {
        type: String,
        required: [true, 'PO statement is required'],
        trim: true,
    },
    targetScore: {
        type: Number,
        required: true,
        default: 2.5,
    },
    programId: {
        type: String,
        default: 'prog-btech-cse',
    },
}, {
    timestamps: true,
});
export const PO = mongoose.models.PO || mongoose.model('PO', POSchema);
export async function seedInitialPOs() {
    const count = await PO.countDocuments();
    if (count === 0) {
        for (const po of mockProgramOutcomes) {
            await PO.create({
                code: po.code,
                title: po.title,
                statement: po.statement,
                targetScore: po.targetScore,
                programId: 'prog-btech-cse',
            });
        }
        console.log('[Seed] Seeded initial Program Outcomes into MongoDB');
    }
}
