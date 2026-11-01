import { NextResponse } from 'next/server';
import { connectToDatabase, getDbConnectionState } from '@/lib/mongodb';
import { User, DEFAULT_USERS, seedDefaultUsers } from '@/models/User';
export async function GET() {
    try {
        let usersList = [];
        try {
            await connectToDatabase();
            await seedDefaultUsers();
            usersList = await User.find({}, '-password').sort({ createdAt: -1 });
        }
        catch {
            // Return default list if database is unreachable
            usersList = DEFAULT_USERS.map((u, i) => ({
                _id: `usr-mock-${i}`,
                name: u.name,
                email: u.email,
                role: u.role,
                department: u.department,
                designation: u.designation,
                isActive: true,
            }));
        }
        return NextResponse.json({
            success: true,
            count: usersList.length,
            data: usersList,
            database: getDbConnectionState(),
        });
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Failed to retrieve users list',
        }, { status: 500 });
    }
}
