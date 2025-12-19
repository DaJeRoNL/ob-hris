import { useState } from 'react';
import { X, UserPlus, Briefcase, MapPin, Envelope, Phone, User, Steps } from '@phosphor-icons/react';

interface Props {
    onClose: () => void;
    onAdd: (candidate: any) => void;
}

const STAGES = ['Screening', 'Interview', 'Offer'];

export default function AddCandidateModal({ onClose, onAdd }: Props) {
    const [form, setForm] = useState({
        name: '',
        role: '',
        stage: 'Screening', // Default stage
        email: '',
        phone: '',
        location: '',
        summary: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.role) return;

        const newCandidate = {
            id: `new-${Date.now()}`,
            name: form.name,
            role: form.role,
            stage: form.stage,
            tags: ['New'],
            notes: [],
            files: [],
            email: form.email,
            phone: form.phone,
            location: form.location,
            lastUpdated: new Date().toISOString(),
            summary: form.summary
        };

        onAdd(newCandidate);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                
                {/* Header with Dynamic Gradient */}
                <div 
                    className="p-6 text-white flex justify-between items-center backdrop-blur-md relative"
                    style={{ background: 'var(--color-header-bg)' }}
                >
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 bg-white/20 rounded-lg"><UserPlus size={24} weight="fill" /></div>
                        <div>
                            <h2 className="text-xl font-bold font-['Montserrat']">Add Candidate</h2>
                            <p className="text-xs opacity-80">Add manual entry to Pipeline</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition relative z-10"><X size={20} /></button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                    <div>
                        <label className="text-xs font-bold uppercase opacity-50 mb-1 flex items-center gap-1 text-[var(--color-text)]"><User /> Full Name</label>
                        <input autoFocus required className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[var(--color-primary)] font-bold text-[var(--color-text)]" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase opacity-50 mb-1 flex items-center gap-1 text-[var(--color-text)]"><Briefcase /> Role</label>
                            <input required className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[var(--color-primary)] text-[var(--color-text)]" placeholder="e.g. Designer" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase opacity-50 mb-1 flex items-center gap-1 text-[var(--color-text)]"><Steps /> Initial Stage</label>
                            <select 
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[var(--color-primary)] cursor-pointer text-[var(--color-text)]"
                                value={form.stage}
                                onChange={e => setForm({...form, stage: e.target.value})}
                            >
                                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase opacity-50 mb-1 flex items-center gap-1 text-[var(--color-text)]"><MapPin /> Location</label>
                        <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[var(--color-primary)] text-[var(--color-text)]" placeholder="e.g. Remote" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase opacity-50 mb-1 flex items-center gap-1 text-[var(--color-text)]"><Envelope /> Email</label>
                            <input type="email" className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[var(--color-primary)] text-[var(--color-text)]" placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase opacity-50 mb-1 flex items-center gap-1 text-[var(--color-text)]"><Phone /> Phone</label>
                            <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[var(--color-primary)] text-[var(--color-text)]" placeholder="+1..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase opacity-50 mb-1 text-[var(--color-text)]">Summary / Notes</label>
                        <textarea className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[var(--color-primary)] h-24 resize-none text-[var(--color-text)]" placeholder="Brief background..." value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)]">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-sm hover:bg-[var(--color-bg)] transition text-[var(--color-text)]">Cancel</button>
                        <button type="submit" className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm hover:bg-[var(--color-primary-hover)] shadow-lg shadow-[var(--color-primary)]/20 transition transform active:scale-95">Add Candidate</button>
                    </div>
                </form>
            </div>
        </div>
    );
}