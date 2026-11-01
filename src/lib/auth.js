import crypto from 'crypto';
import bcrypt from 'bcryptjs';
export const USER_ROLES = [
    {
        id: 'Admin',
        label: 'System Administrator',
        description: 'Configure departments, degree programs, user roles, and institutional thresholds',
        defaultRoute: '/users',
    },
    {
        id: 'Faculty',
        label: 'Faculty / Course Instructor',
        description: 'Manage course outcomes (COs), Bloom’s taxonomy levels, assessments, and marks',
        defaultRoute: '/courses',
    },
    {
        id: 'HOD',
        label: 'Head of Department / Coordinator',
        description: 'Review departmental CO-PO matrices, analyze attainment gaps, and audit OBE status',
        defaultRoute: '/dashboard',
    },
    {
        id: 'Accreditation',
        label: 'Accreditation / SSR Lead',
        description: 'Prepare NBA Criteria 2 & 3 compliance, upload evidence, and generate SSR reports',
        defaultRoute: '/reports',
    },
];
export const AUTH_COOKIE_NAME = 'outcome360_session';
export const SESSION_EXPIRATION_SECONDS = 15 * 60; // 15 minutes in seconds (900s)
const JWT_SECRET = process.env.JWT_SECRET || 'outcome360_super_secret_jwt_key_2026_accreditation_management';
/**
 * Hash a plain password using bcrypt with salt (10 rounds)
 */
export function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}
/**
 * Verify plain password against stored bcrypt hash (with PBKDF2 fallback)
 */
export function verifyPassword(password, storedHash) {
    try {
        if (!storedHash) return false;
        // Standard bcrypt format ($2a$, $2b$, $2y$)
        if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
            return bcrypt.compareSync(password, storedHash);
        }
        // Fallback for legacy salt:hash format
        const [salt, key] = storedHash.split(':');
        if (salt && key) {
            const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
            return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(key, 'hex'));
        }
        return false;
    }
    catch {
        return false;
    }
}
function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf8');
}
/**
 * Sign a lightweight HMAC-SHA256 JWT session token with a 15-minute expiration
 */
export function signSessionToken(payload, expiresInSeconds = SESSION_EXPIRATION_SECONDS) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expiresInSeconds;
    const fullPayload = { ...payload, iat, exp };
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
    const signature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}
/**
 * Verify and decode a JWT session token. Rejects expired or tampered tokens.
 */
export function verifySessionToken(token) {
    try {
        if (!token || typeof token !== 'string')
            return null;
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        const [header, payload, signature] = parts;
        const expectedSig = crypto
            .createHmac('sha256', JWT_SECRET)
            .update(`${header}.${payload}`)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
        if (signature !== expectedSig) {
            return null; // Signature mismatch / tampered token
        }
        const decoded = JSON.parse(base64UrlDecode(payload));
        // Strict expiration verification
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return null; // Expired (past 15-minute validity window)
        }
        return decoded;
    }
    catch {
        return null;
    }
}
/**
 * Server-side Request Authenticator & Role Authorizer
 * Enforces authentication and RBAC permissions on API route handlers.
 */
export function authenticateRequest(request, allowedRoles) {
    let token;
    // 1. Check Bearer Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    // 2. Check Cookie header
    if (!token) {
        const cookieHeader = request.headers.get('cookie') || '';
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]+)`));
        if (match) {
            token = match[1];
        }
    }
    if (!token) {
        return {
            authenticated: false,
            user: null,
            status: 401,
            error: 'Unauthorized: Authentication session required. Please sign in.',
        };
    }
    const session = verifySessionToken(token);
    if (!session) {
        return {
            authenticated: false,
            user: null,
            status: 401,
            error: 'Unauthorized: Session is invalid or has expired. Please sign in again.',
        };
    }
    // 3. Enforce Role Permissions if restricted
    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(session.role)) {
            return {
                authenticated: false,
                user: session,
                status: 403,
                error: `Forbidden: Role '${session.role}' is not authorized. Required: ${allowedRoles.join(', ')}`,
            };
        }
    }
    return {
        authenticated: true,
        user: session,
        status: 200,
        error: null,
    };
}
