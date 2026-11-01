import { NextResponse } from 'next/server';
import { connectToDatabase, getDbConnectionState } from '@/lib/mongodb';
import { DEFAULT_USERS, seedDefaultUsers } from '@/models/User';
import { USER_ROLES } from '@/lib/auth';

export async function GET() {
  let dbStatus = getDbConnectionState();
  let dbError: string | null = null;

  try {
    await connectToDatabase();
    await seedDefaultUsers();
    dbStatus = getDbConnectionState();
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : 'Failed to connect to MongoDB';
  }

  return NextResponse.json({
    status: 'online',
    system: 'Outcome360 OBE & Accreditation Management System',
    database: {
      ...dbStatus,
      error: dbError,
    },
    roles: USER_ROLES,
    demoAccounts: DEFAULT_USERS.map((u) => ({
      role: u.role,
      name: u.name,
      email: u.email,
      password: u.passwordRaw,
      department: u.department,
      designation: u.designation,
    })),
  });
}
