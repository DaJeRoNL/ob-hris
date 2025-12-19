import { useState } from 'react';
import { X, CheckCircle, Clock, Briefcase, CaretRight } from '@phosphor-icons/react';
import { Person } from '../../../types';
import VisaResolutionModal from './VisaResolutionModal';
import FlagDot from './ui/FlagDot';

interface Props {
    items: Person[];
    onClose: () => void;
}

export default function PendingReviewsModal({ items, onClose }: Props) {
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    return (
        <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
                <div className="bg-[var(--color-surface)] w-full max-w-4xl rounded-2xl shadow-2xl p-0 border border-[var(--color-border)] overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]/50 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--color-warning)]/20 text-[var(--color-warning)] flex items-center justify-center shadow-inner">
                                <Clock size={28} weight="duotone" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold font-['Montserrat'] text-[var(--color-text)]">Pending Actions</h2>
                                <div className="flex items-center gap-2 text-xs opacity-60 text-[var(--color-text)]">
                                    <span className="font-bold text-[var(--color-warning)]">{items.length} Requires Attention</span>
                                    <span>•</span>
                                    <span>Compliance Audit Queue</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="hover:text-[var(--color-danger)] transition p-2 bg-[var(--color-bg)] rounded-lg text-[var(--color-text)]"><X size={20} /></button>
                    </div>

                    {/* List Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--color-bg)]/80 text-[10px] font-bold uppercase opacity-50 border-b border-[var(--color-border)] shrink-0 text-[var(--color-text)]">
                        <div className="col-span-4">Employee / ID</div>
                        <div className="col-span-3">Role & Dept</div>
                        <div className="col-span-3">Issue / Due Date</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* List Content */}
                    <div className="overflow-y-auto flex-1 custom-scrollbar bg-[var(--color-bg)]/20">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 opacity-50">
                                <CheckCircle size={48} className="text-[var(--color-success)] mb-4" />
                                <div className="text-sm font-bold text-[var(--color-text)]">All clear! No pending reviews.</div>
                            </div>
                        ) : (
                            items.map((person) => (
                                <div key={person.id} className="grid grid-cols-12 gap-4 p-4 border-b border-[var(--color-border)] hover:bg-[var(--color-surface)] transition items-center group text-[var(--color-text)]">
                                    
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shadow-md">
                                            {person.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{person.name}</div>
                                            <div className="text-xs opacity-50 flex items-center gap-1 mt-0.5">
                                                <FlagDot country={person.loc} /> {person.loc}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="flex items-center gap-1.5 text-xs font-medium">
                                            <Briefcase size={12} className="opacity-50" /> {person.role}
                                        </div>
                                        <div className="text-[10px] opacity-50 mt-0.5">Engineering Dept</div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="inline-flex items-center gap-1 bg-[var(--color-warning)]/10 text-[var(--color-warning)] px-2 py-1 rounded text-[10px] font-bold border border-[var(--color-warning)]/20">
                                            Visa Review
                                        </div>
                                        <div className="text-[10px] text-[var(--color-danger)] font-mono mt-1 font-bold">Due in {Math.floor(Math.random() * 10) + 2} days</div>
                                    </div>
                                    
                                    <div className="col-span-2 flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition">
                                        <button 
                                            onClick={() => setSelectedPerson(person)}
                                            className="px-3 py-1.5 rounded-lg bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90 transition shadow-sm text-xs font-bold flex items-center gap-1"
                                        >
                                            Resolve <CaretRight weight="bold" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] text-center shrink-0">
                        <button onClick={onClose} className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition uppercase tracking-wide">
                            Close Action Center
                        </button>
                    </div>
                </div>
            </div>

            {selectedPerson && (
                <VisaResolutionModal 
                    person={selectedPerson} 
                    onClose={() => setSelectedPerson(null)}
                    onSave={() => { setSelectedPerson(null); onClose(); }}
                />
            )}
        </>
    );
}