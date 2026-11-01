import crypto from 'crypto';

export type UserRole = 'Admin' | 'Faculty' | 'HOD' | 'Accreditation';

export const USER_ROLES: { id: UserRole; label: string; description: string; defaultRoute: string }[] = [
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
const JWT_SECRET = process.env.JWT_SECRET || 'outcome360_super_secret_jwt_key_2026_accreditation_management';

/**
 * Hash a plain password using PBKDF2 with a cryptographic salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify plain password against stored salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(key, 'hex'));
  } catch {
    return false;
  }
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  exp?: number;
  iat?: number;
}

/**
 * Sign a lightweight JWT session token
 */
export function signSessionToken(payload: Omit<SessionPayload, 'exp' | 'iat'>, expiresInHours = 24): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInHours * 3600;
  const fullPayload: SessionPayload = { ...payload, iat, exp };

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
 * Verify and decode a JWT session token
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSig) {
      return null;
    }

    const decoded = JSON.parse(base64UrlDecode(payload)) as SessionPayload;
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return decoded;
  } catch {
    return null;
  }
}

export interface AuthResult {
  authenticated: boolean;
  user: SessionPayload | null;
  status: number;
  error: string | null;
}

/**
 * Server-side Request Authenticator & Role Authorizer
 * Enforces authentication and RBAC permissions on API route handlers.
 */
export function authenticateRequest(
  request: Request,
  allowedRoles?: UserRole[]
): AuthResult {
  let token: string | undefined;

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

