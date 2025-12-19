import { X, User, MapPin, Briefcase, IdentificationCard, Trash, Warning, CalendarCheck, ShieldCheck } from '@phosphor-icons/react';
import { Person } from '../types';
import FlagDot from './ui/FlagDot';

interface Props {
    person: Person;
    onClose: () => void;
    onRemove: (id: string) => void;
}

export default function UserDetailModal({ person, onClose, onRemove }: Props) {
    const isCitizen = person.visa === 'Citizen';
    const mockExpiry = new Date();
    mockExpiry.setFullYear(mockExpiry.getFullYear() + 1); 
    const expiryStr = isCitizen ? 'N/A' : mockExpiry.toLocaleDateString();
    
    const canDelete = isCitizen; 
    
    const handleDelete = () => {
        if (!canDelete) {
            alert(`Cannot remove ${person.name}. Active ${person.visa} is valid until ${expiryStr}.`);
            return;
        }
        if(window.confirm(`Permanently remove ${person.name} from compliance tracking?`)) {
            onRemove(person.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[var(--color-border)]" onClick={e => e.stopPropagation()}>
                
                {/* Hero Header */}
                <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-8 text-white relative">
                    <div className="flex justify-between items-start z-10 relative">
                        <div className="flex gap-5 items-center">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl font-bold shadow-xl backdrop-blur-sm">
                                {person.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold font-['Montserrat']">{person.name}</h2>
                                <div className="flex items-center gap-2 mt-1 opacity-80 text-sm">
                                    <Briefcase weight="fill" className="text-indigo-200" /> {person.role}
                                </div>
                                <div className="flex items-center gap-2 mt-1 opacity-60 text-xs font-mono">
                                    ID: {person.id} • <span className="uppercase text-[var(--color-success)] font-bold">{person.status}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"><X size={20} /></button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 bg-[var(--color-bg)] flex-1">
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm text-[var(--color-text)]">
                            <div className="text-xs uppercase font-bold opacity-50 mb-2 flex items-center gap-2 text-[var(--color-text-muted)]">
                                <MapPin className="text-[var(--color-info)]" /> Location
                            </div>
                            <div className="flex items-center gap-2 font-bold text-lg">
                                <FlagDot country={person.loc} size="md" /> {person.loc}
                            </div>
                        </div>
                        <div className="p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm text-[var(--color-text)]">
                            <div className="text-xs uppercase font-bold opacity-50 mb-2 flex items-center gap-2 text-[var(--color-text-muted)]">
                                <IdentificationCard className="text-[var(--color-secondary)]" /> Visa Type
                            </div>
                            <div className="font-bold text-lg">{person.visa}</div>
                        </div>
                    </div>

                    <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 rounded-2xl mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-xs font-bold uppercase text-[var(--color-primary)] flex items-center gap-2">
                                <CalendarCheck weight="fill" /> Authorization Expiry
                            </div>
                            {isCitizen && <span className="text-[10px] bg-[var(--color-success)]/20 text-[var(--color-success)] px-2 py-0.5 rounded font-bold">Permanent</span>}
                        </div>
                        <div className="text-2xl font-mono font-bold text-[var(--color-text)]">{expiryStr}</div>
                        {!isCitizen && <div className="text-xs opacity-60 mt-1 text-[var(--color-text-muted)]">Renewal required 90 days prior.</div>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl font-bold text-sm hover:bg-[var(--color-bg)] transition flex items-center justify-center gap-2 text-[var(--color-text)]">
                            <User /> Edit Profile
                        </button>
                        
                        <button 
                            onClick={handleDelete}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                                canDelete 
                                ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white border border-[var(--color-danger)]/20' 
                                : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] cursor-not-allowed border border-transparent'
                            }`}
                            title={!canDelete ? "Cannot delete active visa holder" : "Remove User"}
                        >
                            {canDelete ? <><Trash weight="fill" /> Remove User</> : <><ShieldCheck weight="fill" /> Protected</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}