import React, { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = {
    nexus: {
        name: 'Nexus (Default)',
        type: 'Modern SaaS',
        colors: {
            light: { 
                primary: '#4f46e5', // Indigo 600
                secondary: '#818cf8', 
                bg: '#f3f4f6',      // Gray 100
                surface: '#ffffff', 
                text: '#0f172a' 
            },
            dark: { 
                primary: '#6366f1', // Indigo 500
                secondary: '#4f46e5', 
                bg: '#0f172a',      // Slate 900
                surface: '#1e293b', // Slate 800
                text: '#f8fafc' 
            }
        }
    },
    executive: {
        name: 'Executive Suite',
        type: 'Corporate',
        colors: {
            light: { 
                primary: '#334155', // Slate 700
                secondary: '#475569', 
                bg: '#f1f5f9',      // Slate 100
                surface: '#ffffff', 
                text: '#020617' 
            },
            dark: { 
                primary: '#38bdf8', // Sky 400
                secondary: '#0ea5e9', 
                bg: '#020617',      // Slate 950
                surface: '#0f172a', // Slate 900
                text: '#f8fafc' 
            }
        }
    },
    zen: {
        name: 'Zen Garden',
        type: 'Focus & Calm',
        colors: {
            light: { 
                primary: '#059669', // Emerald 600
                secondary: '#10b981', 
                bg: '#f5f5f4',      // Stone 100
                surface: '#ffffff', 
                text: '#1c1917' 
            },
            dark: { 
                primary: '#34d399', // Emerald 400
                secondary: '#10b981', 
                bg: '#1c1917',      // Stone 900
                surface: '#292524', // Stone 800
                text: '#f5f5f4' 
            }
        }
    },
    crimson: {
        name: 'Crimson Ops',
        type: 'High Energy',
        colors: {
            light: { 
                primary: '#ea580c', // Orange 600
                secondary: '#f97316', 
                bg: '#fff7ed',      // Orange 50
                surface: '#ffffff', 
                text: '#431407' 
            },
            dark: { 
                primary: '#f97316', // Orange 500
                secondary: '#ea580c', 
                bg: '#18181b',      // Zinc 900
                surface: '#27272a', // Zinc 800
                text: '#fafafa' 
            }
        }
    }
};

type ThemeKey = keyof typeof THEMES;

interface ThemeContextType {
    currentTheme: ThemeKey;
    setTheme: (key: ThemeKey) => void;
    isDarkMode: boolean;
    setMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType>({} as any);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeKey>('nexus');
    
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    useEffect(() => {
        const mode = isDarkMode ? 'dark' : 'light';
        const colors = THEMES[currentTheme].colors[mode];
        const root = document.documentElement;

        // 1. Set CSS Variables
        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-secondary', colors.secondary);
        root.style.setProperty('--color-bg', colors.bg);
        root.style.setProperty('--color-surface', colors.surface);
        root.style.setProperty('--color-text', colors.text);

        // 2. FORCE BODY BACKGROUND (Fixes the "broken layout" issue globally)
        document.body.style.backgroundColor = colors.bg;
        document.body.style.color = colors.text;

        // 3. Handle Tailwind class
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

    }, [currentTheme, isDarkMode]);

    const setMode = (mode: 'light' | 'dark') => {
        setIsDarkMode(mode === 'dark');
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme, isDarkMode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
