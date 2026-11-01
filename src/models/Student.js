import mongoose, { Schema } from 'mongoose';
const StudentSchema = new Schema({
    rollNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    programId: {
        type: String,
        default: 'prog-btech-cse',
    },
    batchYear: {
        type: Number,
        default: 2023,
    },
}, {
    timestamps: true,
});
export const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);
export async function seedInitialStudents() {
    const count = await Student.countDocuments();
    if (count === 0) {
        const defaultRoster = [
            { rollNumber: 'CS23B101', name: 'Aarav Mehta', email: 'aarav.m@institution.edu', batchYear: 2023 },
            { rollNumber: 'CS23B102', name: 'Diya Sharma', email: 'diya.s@institution.edu', batchYear: 2023 },
            { rollNumber: 'CS23B103', name: 'Rohan Iyer', email: 'rohan.i@institution.edu', batchYear: 2023 },
            { rollNumber: 'CS23B104', name: 'Pooja Reddy', email: 'pooja.r@institution.edu', batchYear: 2023 },
            { rollNumber: 'CS23B105', name: 'Vikram Joshi', email: 'vikram.j@institution.edu', batchYear: 2023 },
            { rollNumber: 'CS23B106', name: 'Neha Chawla', email: 'neha.c@institution.edu', batchYear: 2023 },
            { rollNumber: 'CS23B107', name: 'Anil Sengupta', email: 'anil.s@institution.edu', batchYear: 2023 },
            { rollNumber: 'CS23B108', name: 'Kavya Nair', email: 'kavya.n@institution.edu', batchYear: 2023 },
            { rollNumber: 'CS23B109', name: 'Manish Bhatia', email: 'manish.b@institution.edu', batchYear: 2023 },
            { rollNumber: 'CS23B110', name: 'Sneha Kulkarni', email: 'sneha.k@institution.edu', batchYear: 2023 },
        ];
        for (const s of defaultRoster) {
            await Student.create(s);
        }
        console.log('[Seed] Seeded student roster into MongoDB');
    }
}
