import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { getDbConnectionState } from '@/lib/mongodb';
export async function GET(request) {
    try {
        let token;
        // Check Authorization header
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        // Fall back to cookie
        if (!token) {
            const cookieStore = await cookies();
            token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
        }
        if (!token) {
            return NextResponse.json({
                authenticated: false,
                user: null,
                database: getDbConnectionState(),
            });
        }
        const session = verifySessionToken(token);
        if (!session) {
            return NextResponse.json({
                authenticated: false,
                user: null,
                database: getDbConnectionState(),
            });
        }
        return NextResponse.json({
            authenticated: true,
            user: {
                id: session.userId,
                name: session.name,
                email: session.email,
                role: session.role,
                department: session.department,
            },
            database: getDbConnectionState(),
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Auth verification error';
        return NextResponse.json({ authenticated: false, error: message }, { status: 500 });
    }
}
