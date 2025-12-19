import { X, MapPin, CaretRight, Users } from '@phosphor-icons/react';
import { Person } from '../../../types';

interface Props {
    type: 'Remote' | 'Hybrid';
    people: Person[];
    onClose: () => void;
    onSelectCountry: (country: string) => void;
}

export default function UserDistributionModal({ type, people, onClose, onSelectCountry }: Props) {
    const countryGroups = people.reduce((acc, p) => {
        acc[p.loc] = (acc[p.loc] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--color-surface)] w-full max-w-sm rounded-2xl shadow-2xl p-0 border border-[var(--color-border)] overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg)]/50">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${type === 'Remote' ? 'bg-[var(--color-info)]' : 'bg-[var(--color-primary)]'}`}>
                            <Users size={20} weight="duotone" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold font-['Montserrat'] text-[var(--color-text)]">{type} Workforce</h2>
                            <p className="text-xs opacity-60 uppercase font-bold text-[var(--color-text-muted)]">{people.length} Users total</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:text-[var(--color-danger)] transition text-[var(--color-text)]"><X size={20} /></button>
                </div>
                
                {/* Country List */}
                <div className="p-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] font-bold uppercase opacity-40 mb-2 px-2 text-[var(--color-text)]">Active Regions</div>
                    <div className="space-y-2">
                        {Object.entries(countryGroups).map(([country, count]) => (
                            <div 
                                key={country}
                                onClick={() => {
                                    onSelectCountry(country);
                                    onClose(); 
                                }}
                                className="flex justify-between items-center p-3 rounded-xl bg-[var(--color-bg)] hover:bg-[var(--color-surface)] cursor-pointer border border-transparent hover:border-[var(--color-border)] transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--color-border)] flex items-center justify-center">
                                        <MapPin weight="fill" className="text-[var(--color-text-muted)]" />
                                    </div>
                                    <div className="font-bold text-sm text-[var(--color-text)]">{country}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-bold bg-[var(--color-surface)] px-2 py-0.5 rounded-md text-[var(--color-text)]">{count}</span>
                                    <CaretRight size={14} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[var(--color-text)]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-[var(--color-bg)]/50 border-t border-[var(--color-border)] text-center">
                    <p className="text-[10px] opacity-50 text-[var(--color-text)]">Select a region to view specific compliance policies.</p>
                </div>
            </div>
        </div>
    );
}