'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
    isDark: false,
});

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('outcome360_theme');
            if (savedTheme === 'dark') {
                setTheme('dark');
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
        } catch {
            applyTheme('light');
        }
    }, []);

    const applyTheme = (currentTheme) => {
        if (typeof document === 'undefined') return;
        const root = document.documentElement;
        if (currentTheme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
            root.style.colorScheme = 'light';
        }
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        applyTheme(nextTheme);
        try {
            localStorage.setItem('outcome360_theme', nextTheme);
        } catch {
            // Ignore localStorage errors
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

