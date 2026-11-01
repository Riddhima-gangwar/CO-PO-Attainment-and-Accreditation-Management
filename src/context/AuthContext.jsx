'use client';
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionExpiresAt, setSessionExpiresAt] = useState(null);
    const logoutTimerRef = useRef(null);

    const logout = useCallback(async (isAutoExpired = false) => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
            console.warn('Logout request warning:', err);
        } finally {
            setUser(null);
            setSessionExpiresAt(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('outcome360_user');
                localStorage.removeItem('outcome360_expires_at');
                if (isAutoExpired) {
                    window.location.href = '/login?expired=true';
                } else {
                    window.location.href = '/login';
                }
            }
        }
    }, []);

    // Schedules client-side auto-logout timer for the remaining session time
    const scheduleAutoLogout = useCallback((expiresAtMs) => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
        }
        if (!expiresAtMs) return;

        const remainingMs = expiresAtMs - Date.now();
        if (remainingMs <= 0) {
            console.warn('[Session] Session has reached 15-minute expiration. Auto-logging out.');
            logout(true);
            return;
        }

        console.log(`[Session] Auto-logout timer set: ${Math.round(remainingMs / 1000)}s remaining (15m window)`);
        logoutTimerRef.current = setTimeout(() => {
            console.warn('[Session] 15-minute session expired. Performing automatic logout.');
            logout(true);
        }, remainingMs);
    }, [logout]);

    const checkSession = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.authenticated && data.user) {
                setUser(data.user);
                const expMs = data.expiresAt || (Date.now() + (data.expiresIn || 900) * 1000);
                setSessionExpiresAt(expMs);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('outcome360_user', JSON.stringify(data.user));
                    localStorage.setItem('outcome360_expires_at', String(expMs));
                }
                scheduleAutoLogout(expMs);
            } else {
                // If previously cached user exists but session on server is dead/expired
                const wasCached = typeof window !== 'undefined' && localStorage.getItem('outcome360_user');
                if (wasCached && data.reason === 'expired_or_invalid') {
                    logout(true);
                } else {
                    setUser(null);
                    setSessionExpiresAt(null);
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('outcome360_user');
                        localStorage.removeItem('outcome360_expires_at');
                    }
                }
            }
        } catch (err) {
            console.warn('Session check warning:', err);
        } finally {
            setIsLoading(false);
        }
    }, [logout, scheduleAutoLogout]);

    useEffect(() => {
        // 1. Check local storage cache for instant UI render
        if (typeof window !== 'undefined') {
            const cachedUser = localStorage.getItem('outcome360_user');
            const cachedExp = localStorage.getItem('outcome360_expires_at');
            if (cachedUser && cachedExp) {
                const expMs = Number(cachedExp);
                if (Date.now() >= expMs) {
                    // Cached session already expired
                    localStorage.removeItem('outcome360_user');
                    localStorage.removeItem('outcome360_expires_at');
                    logout(true);
                    return;
                } else {
                    try {
                        setUser(JSON.parse(cachedUser));
                        setSessionExpiresAt(expMs);
                        scheduleAutoLogout(expMs);
                    } catch {
                        // ignore parse error
                    }
                }
            }
        }

        // 2. Validate with backend session endpoint
        checkSession();

        // 3. Auto-check session when user switches back to browser tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkSession();
            }
        };
        window.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', checkSession);

        // 4. Periodic background health-check (every 60s)
        const pollInterval = setInterval(() => {
            checkSession();
        }, 60000);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', checkSession);
            clearInterval(pollInterval);
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
            }
        };
    }, [checkSession, logout, scheduleAutoLogout]);

    const login = async (email, password, role) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                return { success: false, error: data.error || 'Login failed' };
            }
            setUser(data.user);
            const expMs = data.expiresAt || (Date.now() + 15 * 60 * 1000);
            setSessionExpiresAt(expMs);
            if (typeof window !== 'undefined') {
                localStorage.setItem('outcome360_user', JSON.stringify(data.user));
                localStorage.setItem('outcome360_expires_at', String(expMs));
            }
            scheduleAutoLogout(expMs);
            return { success: true };
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Network error during login';
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async ({ name, email, password, role, department, designation }) => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role, department, designation }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                return { success: false, error: data.error || 'Registration failed' };
            }
            setUser(data.user);
            const expMs = data.expiresAt || (Date.now() + 15 * 60 * 1000);
            setSessionExpiresAt(expMs);
            if (typeof window !== 'undefined') {
                localStorage.setItem('outcome360_user', JSON.stringify(data.user));
                localStorage.setItem('outcome360_expires_at', String(expMs));
            }
            scheduleAutoLogout(expMs);
            return { success: true, user: data.user };
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Network error during registration';
            return { success: false, error: msg };
        } finally {
            setIsLoading(false);
        }
    };

    const setUserFromClient = (newUser) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem('outcome360_user', JSON.stringify(newUser));
        } else {
            localStorage.removeItem('outcome360_user');
            localStorage.removeItem('outcome360_expires_at');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                role: user?.role || null,
                isAuthenticated: !!user,
                isLoading,
                sessionExpiresAt,
                login,
                register,
                logout,
                setUserFromClient,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
