'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // 1. Check local storage cache for instant UI render
        const cachedUser = typeof window !== 'undefined' ? localStorage.getItem('outcome360_user') : null;
        if (cachedUser) {
            try {
                setUser(JSON.parse(cachedUser));
            }
            catch {
                // Ignore parse error
            }
        }
        // 2. Validate with backend session endpoint
        async function checkSession() {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.authenticated && data.user) {
                    setUser(data.user);
                    localStorage.setItem('outcome360_user', JSON.stringify(data.user));
                }
                else if (!cachedUser) {
                    setUser(null);
                    localStorage.removeItem('outcome360_user');
                }
            }
            catch (err) {
                console.warn('Session check warning:', err);
            }
            finally {
                setIsLoading(false);
            }
        }
        checkSession();
    }, []);
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
            localStorage.setItem('outcome360_user', JSON.stringify(data.user));
            return { success: true };
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Network error during login';
            return { success: false, error: msg };
        }
        finally {
            setIsLoading(false);
        }
    };
    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        }
        catch (err) {
            console.warn('Logout request warning:', err);
        }
        finally {
            setUser(null);
            localStorage.removeItem('outcome360_user');
            window.location.href = '/login';
        }
    };
    const setUserFromClient = (newUser) => {
        setUser(newUser);
        if (newUser) {
            localStorage.setItem('outcome360_user', JSON.stringify(newUser));
        }
        else {
            localStorage.removeItem('outcome360_user');
        }
    };
    return (<AuthContext.Provider value={{
            user,
            role: user?.role || null,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            setUserFromClient,
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
