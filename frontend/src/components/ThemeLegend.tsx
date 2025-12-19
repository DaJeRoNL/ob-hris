// Paste this file into your components folder. 
// You can then drop <ThemeLegend /> onto any page (like the Admin tab or Dashboard) to verify your colors are working.

// Clicking on any color block will copy the CSS variable to your clipboard for easy reference.
// This is especially useful when creating custom components or debugging theme issues.
// Each block also includes a small "Aa" text to help you check contrast ratios.

// A debug tool to visualize and copy CSS theme variables!
// To see the legend, temporarily add <ThemeLegend /> to any page component.

import { Copy } from '@phosphor-icons/react';

export default function ThemeLegend() {
    const vars = [
        { name: '--color-primary', label: 'Primary Action' },
        { name: '--color-secondary', label: 'Secondary / Accents' },
        { name: '--color-bg', label: 'App Background' },
        { name: '--color-surface', label: 'Card Surface' },
        { name: '--color-border', label: 'Borders' },
        { name: '--color-text', label: 'Main Text' },
        { name: '--color-text-muted', label: 'Muted Text' },
        { name: '--color-success', label: 'Success State' },
        { name: '--color-warning', label: 'Warning State' },
        { name: '--color-danger', label: 'Danger State' },
        { name: '--color-info', label: 'Info State' },
    ];

    const copyVar = (text: string) => {
        navigator.clipboard.writeText(`var(${text})`);
        alert(`Copied: var(${text})`);
    };

    return (
        <div className="glass-card p-6 border border-[var(--color-border)] max-w-4xl mx-auto my-8 animate-fade-in">
            <h3 className="text-xl font-bold mb-6 text-[var(--color-text)] flex items-center gap-2">
                🎨 Theme Palette Legend
                <span className="text-xs font-normal opacity-50 bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-1 rounded">Debug Tool</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vars.map((v) => (
                    <div 
                        key={v.name} 
                        onClick={() => copyVar(v.name)}
                        className="group cursor-pointer p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] bg-[var(--color-surface)] transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 text-[var(--color-text)]">{v.label}</span>
                            <Copy size={12} className="opacity-0 group-hover:opacity-100 text-[var(--color-primary)]" />
                        </div>
                        
                        <div className="h-10 w-full rounded-lg mb-2 border border-[var(--color-border)] shadow-inner relative overflow-hidden">
                            {/* The Swatch */}
                            <div className="absolute inset-0" style={{ backgroundColor: `var(${v.name})` }}></div>
                            
                            {/* Text Contrast Check */}
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-white mix-blend-difference">
                                Aa
                            </div>
                        </div>

                        <code className="text-[10px] font-mono block bg-[var(--color-bg)] p-1 rounded text-[var(--color-text-muted)] text-center group-hover:text-[var(--color-primary)] transition-colors">
                            {v.name}
                        </code>
                    </div>
                ))}
            </div>
        </div>
    );
}