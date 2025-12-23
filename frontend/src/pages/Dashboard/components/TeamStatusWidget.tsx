import { Circle, User, UsersThree } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
    status: 'Online' | 'In Meeting' | 'Offline';
}

export default function TeamStatusWidget({ members }: { members: TeamMember[] }) {
    const navigate = useNavigate();

    return (
        <div 
            className="glass-card flex flex-col h-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] group hover:border-[var(--color-primary)]/30 transition-all duration-300"
            onClick={() => navigate('/people')}
        >
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]">
                    <UsersThree weight="duotone" className="text-[var(--color-info)]" /> Team Pulse
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase bg-[var(--color-bg)] px-2 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-muted)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse"></div> Live
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--color-bg)] transition group/item">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                    {m.avatar}
                                </div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--color-surface)] ${
                                    m.status === 'Online' ? 'bg-[var(--color-success)]' : 
                                    m.status === 'In Meeting' ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-text-muted)]'
                                }`}></div>
                            </div>
                            <div>
                                <div className="text-sm font-bold leading-none text-[var(--color-text)]">{m.name}</div>
                                <div className="text-[10px] opacity-60 mt-0.5 text-[var(--color-text-muted)]">{m.role}</div>
                            </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                            m.status === 'Online' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20' : 
                            m.status === 'In Meeting' ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20' : 
                            'bg-[var(--color-bg)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                        }`}>
                            {m.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}