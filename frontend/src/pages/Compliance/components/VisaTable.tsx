import { useState } from 'react';
import { IdentificationCard, MagnifyingGlass, Funnel, Plus } from '@phosphor-icons/react';
import { Person } from '../../../types';
import StatusPill from './ui/StatusPill';
import FlagDot from './ui/FlagDot';

interface Props {
    people: Person[];
    onAddUser: () => void;
    onUserClick: (p: Person) => void;
}

export default function VisaTable({ people, onAddUser, onUserClick }: Props) {
    const [search, setSearch] = useState('');

    const filtered = people.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.visa.toLowerCase().includes(search.toLowerCase()) ||
        p.loc.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="glass-card h-full flex flex-col p-0 overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-bg)]/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                        <IdentificationCard size={18} weight="fill" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-[var(--color-text)]">Authorization Status</h3>
                        <p className="text-[10px] opacity-60 uppercase font-bold text-[var(--color-text-muted)]">{filtered.length} Records found</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 text-[var(--color-text)]" size={14} />
                        <input 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-primary)] transition w-32 focus:w-48 text-[var(--color-text)]"
                        />
                    </div>
                    <button 
                        onClick={onAddUser}
                        className="p-1.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white transition shadow-lg flex items-center gap-1 px-3"
                    >
                        <Plus size={14} weight="bold" /> <span className="text-xs font-bold">Add</span>
                    </button>
                </div>
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-[var(--color-surface)] z-10 shadow-sm">
                        <tr className="text-left text-[10px] uppercase font-bold tracking-wider opacity-50 text-[var(--color-text)]">
                            <th className="py-3 px-4">Employee</th>
                            <th className="py-3 px-4">Location</th>
                            <th className="py-3 px-4">Visa Type</th>
                            <th className="py-3 px-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {filtered.map(p => (
                            <tr 
                                key={p.id} 
                                onClick={() => onUserClick(p)} 
                                className="group hover:bg-[var(--color-primary)]/5 transition cursor-pointer"
                            >
                                <td className="py-3 px-4">
                                    <div className="font-bold text-xs text-[var(--color-text)]">{p.name}</div>
                                    <div className="text-[10px] opacity-50 font-mono text-[var(--color-text-muted)]">{p.id}</div>
                                </td>
                                <td className="py-3 px-4 text-xs font-medium text-[var(--color-text)]">
                                    <div className="flex items-center gap-2">
                                        <FlagDot country={p.loc} />
                                        {p.loc}
                                    </div>
                                </td>
                                <td className="py-3 px-4 opacity-70 text-xs font-mono text-[var(--color-text)]">
                                    <span className="bg-[var(--color-bg)] px-1.5 py-0.5 rounded text-[10px] border border-[var(--color-border)]">{p.visa}</span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <StatusPill 
                                        status={p.visa === 'Citizen' ? 'Authorized' : 'Review Needed'} 
                                        type={p.visa === 'Citizen' ? 'success' : 'warning'} 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}