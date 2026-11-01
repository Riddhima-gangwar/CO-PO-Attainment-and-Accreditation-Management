import { NextResponse } from 'next/server';
import { connectToDatabase, getDbConnectionState } from '@/lib/mongodb';
import { User, DEFAULT_USERS, seedDefaultUsers } from '@/models/User';
import { verifyPassword, signSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRATION_SECONDS } from '@/lib/auth';
export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, role } = body;
        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }
        const cleanEmail = email.trim().toLowerCase();
        let dbConnected = false;
        let foundUser = null;
        // 1. Attempt MongoDB connection and query
        try {
            await connectToDatabase();
            dbConnected = true;
            await seedDefaultUsers();
            const userDoc = await User.findOne({ email: cleanEmail });
            if (userDoc) {
                const isMatch = verifyPassword(password, userDoc.password || '');
                if (isMatch) {
                    foundUser = {
                        id: userDoc._id.toString(),
                        name: userDoc.name,
                        email: userDoc.email,
                        role: userDoc.role,
                        department: userDoc.department,
                        designation: userDoc.designation,
                    };
                }
            }
        }
        catch (dbErr) {
            console.warn('[Auth API] MongoDB connection offline or timed out, evaluating demo fallback:', dbErr);
        }
        // 2. Fallback check for demo accounts if DB is offline or user matches default seed
        if (!foundUser) {
            const demoAccount = DEFAULT_USERS.find((u) => u.email.toLowerCase() === cleanEmail && u.passwordRaw === password);
            if (demoAccount) {
                foundUser = {
                    id: `usr-${demoAccount.role.toLowerCase()}-${Date.now()}`,
                    name: demoAccount.name,
                    email: demoAccount.email,
                    role: demoAccount.role,
                    department: demoAccount.department,
                    designation: demoAccount.designation,
                };
            }
        }
        if (!foundUser) {
            return NextResponse.json({ success: false, error: 'Invalid email address or password' }, { status: 401 });
        }
        // Role check if the user specifically requested a role during login
        if (role && foundUser.role !== role) {
            return NextResponse.json({
                success: false,
                error: `This account is authorized as '${foundUser.role}', not '${role}'. Please switch to the correct role tab.`,
            }, { status: 403 });
        }
        // 3. Issue Session Token
        const sessionToken = signSessionToken({
            userId: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            department: foundUser.department,
        });
        // 4. Return success with HTTP-Only Cookie (15-Minute Expiration)
        const expiresAt = Date.now() + SESSION_EXPIRATION_SECONDS * 1000;
        const response = NextResponse.json({
            success: true,
            message: `Successfully logged in as ${foundUser.name} (${foundUser.role})`,
            user: foundUser,
            token: sessionToken,
            expiresIn: SESSION_EXPIRATION_SECONDS,
            expiresAt,
            databaseStatus: getDbConnectionState(),
        });
        response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
            httpOnly: false, // Accessible to client-side auth state
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_EXPIRATION_SECONDS, // 15 minutes (900s)
            expires: new Date(expiresAt),
        });
        return response;
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Server error occurred during login';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
