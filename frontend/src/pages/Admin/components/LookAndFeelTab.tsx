import { Palette, CheckCircle, Moon, Sun, Desktop } from '@phosphor-icons/react';
import { useTheme, THEMES } from '../../../context/ThemeContext';

export default function LookAndFeelTab() {
    const { currentTheme, setTheme, isDarkMode, setMode } = useTheme();

    return (
        <div className="animate-fade-in space-y-10 max-w-5xl">
            
            {/* 1. MODE SELECTOR */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-lg">Interface Mode</h3>
                        <p className="text-sm opacity-60">Select your preferred brightness level.</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setMode('light')} 
                        className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all duration-300 ${!isDarkMode ? 'border-[var(--color-primary)] bg-[var(--color-surface)] shadow-lg' : 'border-transparent bg-gray-100 dark:bg-[var(--color-surface)]/50 opacity-60 hover:opacity-100'}`}
                    >
                        <Sun weight={!isDarkMode ? "fill" : "duotone"} size={24} className={!isDarkMode ? "text-[var(--color-primary)]" : ""} />
                        <span className="font-bold">Light Mode</span>
                    </button>

                    <button 
                        onClick={() => setMode('dark')} 
                        className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all duration-300 ${isDarkMode ? 'border-[var(--color-primary)] bg-[var(--color-surface)] shadow-lg' : 'border-transparent bg-gray-100 dark:bg-[var(--color-surface)]/50 opacity-60 hover:opacity-100'}`}
                    >
                        <Moon weight={isDarkMode ? "fill" : "duotone"} size={24} className={isDarkMode ? "text-[var(--color-primary)]" : ""} />
                        <span className="font-bold">Dark Mode</span>
                    </button>
                </div>
            </section>

            {/* 2. THEME PRESETS */}
            <section>
                <h3 className="font-bold text-lg mb-6">Visual Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(THEMES).map(([key, theme]) => {
                        const isSelected = currentTheme === key;
                        const colors = theme.colors[isDarkMode ? 'dark' : 'light'];

                        return (
                            <button 
                                key={key}
                                onClick={() => setTheme(key as any)}
                                className={`
                                    relative p-5 rounded-3xl text-left transition-all duration-500 group
                                    ${isSelected 
                                        ? 'ring-4 ring-[var(--color-primary)]/30 scale-[1.02] shadow-2xl bg-[var(--color-surface)]' 
                                        : 'bg-gray-50 dark:bg-[var(--color-surface)]/50 hover:bg-gray-100 dark:hover:bg-white/10 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 scale-100'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="font-bold text-lg flex items-center gap-2">
                                            {theme.name}
                                            {isSelected && <CheckCircle weight="fill" className="text-[var(--color-primary)] animate-scale-in" />}
                                        </h4>
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-50 mt-1">{theme.type}</p>
                                    </div>
                                    
                                    {/* Color Dots */}
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-black" style={{ backgroundColor: colors.bg }} />
                                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-black" style={{ backgroundColor: colors.surface }} />
                                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-black" style={{ backgroundColor: colors.primary }} />
                                    </div>
                                </div>

                                {/* MOCK WINDOW PREVIEW */}
                                <div 
                                    className="w-full h-32 rounded-xl overflow-hidden shadow-inner relative transition-colors duration-500 flex"
                                    style={{ backgroundColor: colors.bg }}
                                >
                                    {/* Mock Sidebar */}
                                    <div className="w-16 h-full flex flex-col items-center py-3 gap-2" style={{ backgroundColor: colors.surface }}>
                                        <div className="w-8 h-8 rounded-lg opacity-20" style={{ backgroundColor: colors.primary }}></div>
                                        <div className="w-8 h-1 rounded-full opacity-10 mt-auto" style={{ backgroundColor: colors.text }}></div>
                                    </div>
                                    
                                    {/* Mock Content */}
                                    <div className="flex-1 p-3 flex flex-col gap-2">
                                        <div className="w-24 h-2 rounded-full opacity-10" style={{ backgroundColor: colors.text }}></div>
                                        
                                        <div className="flex gap-2 mt-1">
                                            <div className="flex-1 h-16 rounded-lg shadow-sm opacity-50" style={{ backgroundColor: colors.surface }}></div>
                                            <div className="flex-1 h-16 rounded-lg shadow-sm opacity-50" style={{ backgroundColor: colors.surface }}></div>
                                        </div>
                                    </div>

                                    {/* Mock Floating Action Button */}
                                    <div 
                                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white"
                                        style={{ backgroundColor: colors.primary }}
                                    >
                                        <PlusIcon />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

// Simple internal icon for the mock
const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);
