import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Define the Expanded Color Interface
interface ThemeColors {
    // Core Layout
    primary: string;
    secondary: string;
    primaryHover: string;
    bg: string;       
    island: string;   
    sidebar: string;  
    surface: string;  
    glass: string;    
    border: string;   
    
    // NEW: Specifically for large headers/panels
    headerBg: string; 

    // Typography
    text: string;      
    textMuted: string; 

    // Semantic Status Colors
    success: string;
    successBg: string;
    info: string;
    infoBg: string;
    warning: string;
    warningBg: string;
    danger: string;
    dangerBg: string;

    // Component Specific
    mapBg: string;
    mapDot: string;
    shadow: string;
}

interface ThemeDefinition {
    name: string;
    type: string;
    colors: {
        light: ThemeColors;
        dark: ThemeColors;
    };
}

// 2. Define Themes
export const THEMES: Record<string, ThemeDefinition> = {
    nexus: {
        name: 'Nexus (Default)',
        type: 'Modern SaaS',
        colors: {
            light: { 
                primary: '#4f46e5', 
                secondary: '#818cf8', 
                primaryHover: '#4338ca',
                bg: '#f3f4f6',      
                island: '#ffffff',
                sidebar: '#f8fafc',
                surface: '#ffffff',
                glass: 'rgba(255, 255, 255, 0.95)',
                border: 'rgba(0,0,0,0.1)',
                headerBg: '#4f46e5', // Standard solid primary
                text: '#111827',
                textMuted: '#6b7280',
                success: '#10b981',
                successBg: 'rgba(16, 185, 129, 0.15)',
                info: '#3b82f6',
                infoBg: 'rgba(59, 130, 246, 0.15)',
                warning: '#f59e0b',
                warningBg: 'rgba(245, 158, 11, 0.15)',
                danger: '#ef4444',
                dangerBg: 'rgba(239, 68, 68, 0.15)',
                mapBg: '#1e1b4b',
                mapDot: '#60a5fa',
                shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            },
            dark: { 
                primary: '#6366f1', 
                secondary: '#4f46e5', 
                primaryHover: '#818cf8',
                bg: '#0f172a',      
                island: '#111827',
                sidebar: '#0f172a',
                surface: '#1f2937',
                glass: 'rgba(30, 41, 59, 0.7)',
                border: 'rgba(255, 255, 255, 0.08)',
                headerBg: '#6366f1', // Standard solid primary
                text: '#f3f4f6',
                textMuted: '#9ca3af',
                success: '#34d399', 
                successBg: 'rgba(16, 185, 129, 0.25)',
                info: '#60a5fa',
                infoBg: 'rgba(59, 130, 246, 0.25)',
                warning: '#fbbf24',
                warningBg: 'rgba(245, 158, 11, 0.25)',
                danger: '#f87171',
                dangerBg: 'rgba(239, 68, 68, 0.25)',
                mapBg: '#020617',
                mapDot: '#38bdf8',
                shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }
        }
    },
    executive: {
        name: 'Executive Suite',
        type: 'Corporate',
        colors: {
            light: { 
                primary: '#334155', 
                secondary: '#475569', 
                primaryHover: '#1e293b',
                bg: '#f1f5f9',      
                island: '#ffffff',
                sidebar: '#f8fafc',
                surface: '#ffffff', 
                glass: 'rgba(255, 255, 255, 0.98)',
                border: 'rgba(0,0,0,0.15)',
                headerBg: '#334155',
                text: '#020617', 
                textMuted: '#64748b',
                success: '#059669',
                successBg: 'rgba(5, 150, 105, 0.1)',
                info: '#0369a1',
                infoBg: 'rgba(3, 105, 161, 0.1)',
                warning: '#d97706',
                warningBg: 'rgba(217, 119, 6, 0.1)',
                danger: '#dc2626',
                dangerBg: 'rgba(220, 38, 38, 0.1)',
                mapBg: '#0f172a',
                mapDot: '#e2e8f0',
                shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            },
            dark: { 
                primary: '#38bdf8', 
                secondary: '#0ea5e9', 
                primaryHover: '#7dd3fc',
                bg: '#020617',      
                island: '#0f172a',
                sidebar: '#020617',
                surface: '#0f172a', 
                glass: 'rgba(15, 23, 42, 0.8)',
                border: 'rgba(255, 255, 255, 0.1)',
                headerBg: '#0284c7', // Slight variation for header
                text: '#f8fafc',
                textMuted: '#94a3b8',
                success: '#4ade80',
                successBg: 'rgba(74, 222, 128, 0.2)',
                info: '#7dd3fc',
                infoBg: 'rgba(125, 211, 252, 0.2)',
                warning: '#fcd34d',
                warningBg: 'rgba(252, 211, 77, 0.2)',
                danger: '#fca5a5',
                dangerBg: 'rgba(252, 165, 165, 0.2)',
                mapBg: '#020617',
                mapDot: '#bae6fd',
                shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
            }
        }
    },
    zen: {
        name: 'Zen Garden',
        type: 'Focus & Calm',
        colors: {
            light: { 
                primary: '#059669', 
                secondary: '#10b981', 
                primaryHover: '#047857',
                bg: '#f5f5f4',
                island: '#fafaf9',
                sidebar: '#e7e5e4',
                surface: '#ffffff', 
                glass: 'rgba(255, 255, 255, 0.9)',
                border: 'rgba(87, 83, 78, 0.1)',
                headerBg: '#059669',
                text: '#1c1917', 
                textMuted: '#78716c',
                success: '#059669',
                successBg: 'rgba(5, 150, 105, 0.15)',
                info: '#0891b2',
                infoBg: 'rgba(8, 145, 178, 0.15)',
                warning: '#d97706',
                warningBg: 'rgba(217, 119, 6, 0.15)',
                danger: '#be123c',
                dangerBg: 'rgba(190, 18, 60, 0.15)',
                mapBg: '#44403c',
                mapDot: '#a7f3d0',
                shadow: 'none'
            },
            dark: { 
                primary: '#34d399', 
                secondary: '#10b981', 
                primaryHover: '#6ee7b7',
                bg: '#1c1917',
                island: '#292524',
                sidebar: '#1c1917',
                surface: '#292524', 
                glass: 'rgba(41, 37, 36, 0.8)',
                border: 'rgba(255, 255, 255, 0.05)',
                headerBg: '#34d399',
                text: '#f5f5f4', 
                textMuted: '#a8a29e',
                success: '#6ee7b7',
                successBg: 'rgba(110, 231, 183, 0.2)',
                info: '#67e8f9',
                infoBg: 'rgba(103, 232, 249, 0.2)',
                warning: '#fde047',
                warningBg: 'rgba(253, 224, 71, 0.2)',
                danger: '#fda4af',
                dangerBg: 'rgba(253, 164, 175, 0.2)',
                mapBg: '#0c0a09',
                mapDot: '#d1fae5',
                shadow: 'none'
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
                primaryHover: '#c2410c',
                bg: '#fff7ed',      
                island: '#ffffff',
                sidebar: '#ffedd5',
                surface: '#ffffff', 
                glass: 'rgba(255, 255, 255, 0.95)',
                border: 'rgba(234, 88, 12, 0.15)',
                // FROSTED CHARCOAL GRADIENT FOR HEADERS
                headerBg: 'linear-gradient(135deg, rgba(28, 25, 23, 0.95) 0%, rgba(67, 20, 7, 0.9) 100%)', 
                text: '#431407', 
                textMuted: '#9a3412',
                success: '#16a34a',
                successBg: 'rgba(22, 163, 74, 0.15)',
                info: '#0284c7',
                infoBg: 'rgba(2, 132, 199, 0.15)',
                warning: '#ea580c',
                warningBg: 'rgba(234, 88, 12, 0.15)',
                danger: '#dc2626',
                dangerBg: 'rgba(220, 38, 38, 0.15)',
                mapBg: '#431407',
                mapDot: '#fdba74',
                shadow: '0 4px 15px rgba(234, 88, 12, 0.2)'
            },
            dark: { 
                primary: '#f97316', // Orange 500
                secondary: '#ea580c', 
                primaryHover: '#fb923c',
                bg: '#18181b',      
                island: '#27272a',
                sidebar: '#18181b',
                surface: '#27272a', 
                glass: 'rgba(39, 39, 42, 0.8)',
                border: 'rgba(249, 115, 22, 0.2)',
                // DEEP STEALTH GRADIENT FOR HEADERS
                headerBg: 'linear-gradient(135deg, rgba(24, 24, 27, 0.8) 0%, rgba(124, 45, 18, 0.2) 100%)',
                text: '#fafafa', 
                textMuted: '#a1a1aa',
                success: '#4ade80',
                successBg: 'rgba(74, 222, 128, 0.2)',
                info: '#38bdf8',
                infoBg: 'rgba(56, 189, 248, 0.2)',
                warning: '#fb923c',
                warningBg: 'rgba(251, 146, 60, 0.2)',
                danger: '#f87171',
                dangerBg: 'rgba(248, 113, 113, 0.2)',
                mapBg: '#09090b',
                mapDot: '#fed7aa',
                shadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
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
    // 1. INITIALIZE FROM LOCALSTORAGE
    const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
        const saved = localStorage.getItem('ob_theme_preference');
        return (saved && THEMES[saved]) ? (saved as ThemeKey) : 'nexus';
    });
    
    // 2. INITIALIZE DARK MODE FROM LOCALSTORAGE
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('ob_theme_mode');
        if (savedMode) return savedMode === 'dark';
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    useEffect(() => {
        const mode = isDarkMode ? 'dark' : 'light';
        const colors = THEMES[currentTheme].colors[mode];
        const root = document.documentElement;

        Object.entries(colors).forEach(([key, value]) => {
            const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVarName, value);
        });

        document.body.style.backgroundColor = colors.bg;
        document.body.style.color = colors.text;

        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // 3. SAVE PREFERENCES
        localStorage.setItem('ob_theme_preference', currentTheme);
        localStorage.setItem('ob_theme_mode', isDarkMode ? 'dark' : 'light');

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