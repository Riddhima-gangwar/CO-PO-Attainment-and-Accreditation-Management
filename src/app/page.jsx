import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
export default async function Home() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (sessionToken) {
        const session = verifySessionToken(sessionToken);
        if (session) {
            redirect('/dashboard');
        }
    }
    // Redirect unauthenticated visitors directly to the Role-Based Login page
    redirect('/login');
}
