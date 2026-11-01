import mongoose, { Schema } from 'mongoose';
import { hashPassword } from '@/lib/auth';
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['Admin', 'Faculty', 'HOD', 'Accreditation'],
        default: 'Faculty',
        required: true,
    },
    department: {
        type: String,
        default: 'Computer Science & Engineering',
    },
    designation: {
        type: String,
        default: 'Faculty Member',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Prevent compiling model multiple times in Next.js development hot-reloading
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const DEFAULT_USERS = [
    {
        name: 'Prof. Alex Richardson',
        email: 'admin@outcome360.edu',
        passwordRaw: 'Admin@123',
        role: 'Admin',
        department: 'Institutional Administration',
        designation: 'System Administrator',
    },
    {
        name: 'Dr. Sarah Jenkins',
        email: 'faculty@outcome360.edu',
        passwordRaw: 'Faculty@123',
        role: 'Faculty',
        department: 'Computer Science & Engineering',
        designation: 'Assistant Professor (Course Coordinator)',
    },
    {
        name: 'Dr. Robert Vance',
        email: 'hod@outcome360.edu',
        passwordRaw: 'Hod@123',
        role: 'HOD',
        department: 'Computer Science & Engineering',
        designation: 'Head of Department',
    },
    {
        name: 'Dr. Elena Torres',
        email: 'accreditation@outcome360.edu',
        passwordRaw: 'Accred@123',
        role: 'Accreditation',
        department: 'Internal Quality Assurance Cell (IQAC)',
        designation: 'Accreditation Committee Lead',
    },
];
/**
 * Ensures default users exist in the MongoDB database
 */
export async function seedDefaultUsers() {
    for (const u of DEFAULT_USERS) {
        const existing = await User.findOne({ email: u.email.toLowerCase() });
        if (!existing) {
            await User.create({
                name: u.name,
                email: u.email.toLowerCase(),
                password: hashPassword(u.passwordRaw),
                role: u.role,
                department: u.department,
                designation: u.designation,
                isActive: true,
            });
            console.log(`[Seed] Seeded default ${u.role} user: ${u.email}`);
        }
    }
}
