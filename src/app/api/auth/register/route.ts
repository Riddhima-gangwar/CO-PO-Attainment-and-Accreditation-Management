import { NextResponse } from 'next/server';
import { connectToDatabase, getDbConnectionState } from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashPassword, signSessionToken, AUTH_COOKIE_NAME, UserRole, USER_ROLES } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'Faculty', department, designation } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const validRoles = USER_ROLES.map((r) => r.id);
    if (!validRoles.includes(role as UserRole)) {
      return NextResponse.json(
        { success: false, error: `Invalid role specified. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Database error';
      return NextResponse.json(
        {
          success: false,
          error: `Could not connect to MongoDB at localhost:27017: ${msg}. Please ensure MongoDB service is running.`,
        },
        { status: 503 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashPassword(password),
      role,
      department: department?.trim() || 'Computer Science & Engineering',
      designation: designation?.trim() || `${role} Member`,
      isActive: true,
    });

    const userPayload = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      department: newUser.department,
    };

    const token = signSessionToken({
      userId: userPayload.id,
      name: userPayload.name,
      email: userPayload.email,
      role: userPayload.role,
      department: userPayload.department,
    });

    const response = NextResponse.json({
      success: true,
      message: `User created successfully as ${role}`,
      user: userPayload,
      token,
      database: getDbConnectionState(),
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 86400,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

