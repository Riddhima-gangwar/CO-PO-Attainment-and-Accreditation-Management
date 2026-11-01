import mongoose, { Schema } from 'mongoose';
const StudentMarkSchema = new Schema({
    studentId: {
        type: String,
        required: true,
        index: true,
    },
    studentRoll: {
        type: String,
        required: true,
        index: true,
    },
    studentName: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
        index: true,
    },
    assessmentId: {
        type: String,
        required: true,
        index: true,
    },
    coCode: {
        type: String,
        required: true,
        index: true,
    },
    marksObtained: {
        type: Number,
        required: true,
        min: 0,
    },
    maxMarks: {
        type: Number,
        required: true,
        min: 1,
    },
    percentage: {
        type: Number,
        min: 0,
        max: 100,
    },
}, {
    timestamps: true,
});
StudentMarkSchema.pre('save', function () {
    if (this.maxMarks > 0) {
        this.percentage = Math.round((this.marksObtained / this.maxMarks) * 1000) / 10;
    }
});
export const StudentMark = mongoose.models.StudentMark || mongoose.model('StudentMark', StudentMarkSchema);
export async function seedInitialMarks() {
    const count = await StudentMark.countDocuments();
    if (count === 0) {
        const students = [
            { roll: 'CS23B101', name: 'Aarav Mehta' },
            { roll: 'CS23B102', name: 'Diya Sharma' },
            { roll: 'CS23B103', name: 'Rohan Iyer' },
            { roll: 'CS23B104', name: 'Pooja Reddy' },
            { roll: 'CS23B105', name: 'Vikram Joshi' },
            { roll: 'CS23B106', name: 'Neha Chawla' },
            { roll: 'CS23B107', name: 'Anil Sengupta' },
            { roll: 'CS23B108', name: 'Kavya Nair' },
        ];
        const courseId = 'crs-1';
        const coList = ['CO1', 'CO2', 'CO3', 'CO4', 'CO5'];
        for (const s of students) {
            for (const co of coList) {
                // Realistic student scoring pattern
                const maxMarks = 25;
                const baseScore = co === 'CO4' ? 14 : 19; // CO4 lower for realistic attainment gap demonstration
                const variation = Math.floor(Math.random() * 6);
                const marksObtained = Math.min(maxMarks, Math.max(8, baseScore + variation - 2));
                await StudentMark.create({
                    studentId: `std-${s.roll.toLowerCase()}`,
                    studentRoll: s.roll,
                    studentName: s.name,
                    courseId,
                    assessmentId: 'asm-cie1',
                    coCode: co,
                    marksObtained,
                    maxMarks,
                    percentage: (marksObtained / maxMarks) * 100,
                });
            }
        }
        console.log('[Seed] Seeded initial student marks into MongoDB');
    }
}
