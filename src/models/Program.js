import mongoose, { Schema } from 'mongoose';
const ProgramSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    degree: {
        type: String,
        enum: ['B.Tech', 'M.Tech', 'Ph.D.', 'B.Sc', 'MCA'],
        default: 'B.Tech',
    },
    departmentId: {
        type: String,
        default: 'dept-cse',
        index: true,
    },
    departmentName: {
        type: String,
        default: 'Computer Science & Engineering',
    },
    intake: {
        type: Number,
        default: 120,
    },
    durationYears: {
        type: Number,
        default: 4,
    },
    accreditationStatus: {
        type: String,
        enum: ['Accredited (Tier-I)', 'Accredited (Tier-II)', 'Application Pending', 'Eligible'],
        default: 'Accredited (Tier-I)',
    },
    nbaCycleExpiry: {
        type: String,
        default: '2028-06-30',
    },
}, {
    timestamps: true,
});
export const Program = mongoose.models.Program || mongoose.model('Program', ProgramSchema);
export async function seedInitialPrograms() {
    const count = await Program.countDocuments();
    if (count === 0) {
        const defaultPrograms = [
            {
                code: 'BTECH-CSE',
                name: 'Bachelor of Technology in Computer Science & Engineering',
                degree: 'B.Tech',
                departmentId: 'dept-cse',
                departmentName: 'Computer Science & Engineering',
                intake: 180,
                durationYears: 4,
                accreditationStatus: 'Accredited (Tier-I)',
                nbaCycleExpiry: '2028-06-30',
            },
            {
                code: 'BTECH-ECE',
                name: 'Bachelor of Technology in Electronics & Communication Engineering',
                degree: 'B.Tech',
                departmentId: 'dept-ece',
                departmentName: 'Electronics & Communication Engineering',
                intake: 120,
                durationYears: 4,
                accreditationStatus: 'Accredited (Tier-I)',
                nbaCycleExpiry: '2027-06-30',
            },
            {
                code: 'MTECH-AI',
                name: 'Master of Technology in Artificial Intelligence & Data Science',
                degree: 'M.Tech',
                departmentId: 'dept-cse',
                departmentName: 'Computer Science & Engineering',
                intake: 30,
                durationYears: 2,
                accreditationStatus: 'Application Pending',
                nbaCycleExpiry: '2029-06-30',
            },
        ];
        for (const p of defaultPrograms) {
            await Program.create(p);
        }
        console.log('[Seed] Seeded initial academic programs into MongoDB');
    }
}
