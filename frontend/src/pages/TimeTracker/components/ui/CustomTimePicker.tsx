import { useState, useRef, useEffect } from 'react';
import { Clock as ClockIcon, CaretDown } from '@phosphor-icons/react';
import { TIME_OPTIONS } from '../../utils';

export const CustomTimePicker = ({ value, onChange, disabled }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const displayValue = value ? value.substring(0, 5) : '--:--';

    return (
        <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={containerRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[var(--color-bg)]/50 border border-[var(--color-border)] rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[var(--color-bg)] transition text-[var(--color-text)]"
            >
                <div className="flex items-center gap-2">
                    <ClockIcon className="opacity-60" />
                    <span className="text-sm font-mono">{displayValue}</span>
                </div>
                <CaretDown className="opacity-50" size={12} />
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 h-48 overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-50 custom-scrollbar text-[var(--color-text)]">
                    {TIME_OPTIONS.map(t => (
                        <div 
                            key={t}
                            onClick={() => { onChange(t); setIsOpen(false); }}
                            className={`px-4 py-2 text-xs font-mono cursor-pointer hover:bg-[var(--color-bg)]
                                ${value === t ? 'text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10' : 'opacity-80'}`}
                        >
                            {t.substring(0,5)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};