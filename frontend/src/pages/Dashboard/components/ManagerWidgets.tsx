import { User, Users, Clock, Briefcase, Minus } from '@phosphor-icons/react';

// --- TEAM AVAILABILITY ---
export function TeamAvailabilityWidget({ members }: { members: any[] }) {
    const online = members.filter(m => m.status === 'Online').length;
    const meeting = members.filter(m => m.status === 'In Meeting').length;
    const offline = members.filter(m => m.status === 'Offline').length;

    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]">
                        <Users weight="duotone" className="text-[var(--color-info)]" /> Availability
                    </h3>
                    <p className="text-xs opacity-50 text-[var(--color-text-muted)]">Live Status</p>
                </div>
                <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" title="Online"></span>
                    <span className="h-2 w-2 rounded-full bg-[var(--color-warning)]" title="Meeting"></span>
                    <span className="h-2 w-2 rounded-full bg-[var(--color-text-muted)]" title="Offline"></span>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-[var(--color-bg)] p-2 rounded-lg text-center border border-[var(--color-border)]">
                    <div className="text-xl font-bold text-[var(--color-success)]">{online}</div>
                    <div className="text-[9px] uppercase font-bold text-[var(--color-text-muted)]">Online</div>
                </div>
                <div className="flex-1 bg-[var(--color-bg)] p-2 rounded-lg text-center border border-[var(--color-border)]">
                    <div className="text-xl font-bold text-[var(--color-warning)]">{meeting}</div>
                    <div className="text-[9px] uppercase font-bold text-[var(--color-text-muted)]">Busy</div>
                </div>
                <div className="flex-1 bg-[var(--color-bg)] p-2 rounded-lg text-center border border-[var(--color-border)]">
                    <div className="text-xl font-bold text-[var(--color-text-muted)]">{offline}</div>
                    <div className="text-[9px] uppercase font-bold text-[var(--color-text-muted)]">Away</div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 hover:bg-[var(--color-bg)] rounded-lg transition">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
                                    {m.avatar}
                                </div>
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--color-surface)] ${m.status === 'Online' ? 'bg-[var(--color-success)]' : m.status === 'In Meeting' ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-text-muted)]'}`}></div>
                            </div>
                            <span className="text-sm font-bold text-[var(--color-text)]">{m.name}</span>
                        </div>
                        <span className="text-[10px] font-mono opacity-50 text-[var(--color-text-muted)]">{m.status === 'In Meeting' ? '1h 20m' : ''}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- TEAM WORKLOAD ---
export function TeamWorkloadWidget({ workload }: { workload: any[] }) {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-4">
                <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]">
                    <Briefcase weight="duotone" className="text-[var(--color-primary)]" /> Workload
                </h3>
                <p className="text-xs opacity-50 text-[var(--color-text-muted)]">Hours logged this week</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {workload.map(w => {
                    const pct = Math.min((w.hours / w.capacity) * 100, 100);
                    const color = pct > 90 ? 'bg-[var(--color-danger)]' : pct > 75 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-success)]';
                    
                    return (
                        <div key={w.id} className="group">
                            <div className="flex justify-between items-center mb-1 text-xs">
                                <span className="font-bold text-[var(--color-text)]">{w.name}</span>
                                <span className="font-mono opacity-60 text-[var(--color-text-muted)]">{w.hours} / {w.capacity}h</span>
                            </div>
                            <div className="w-full h-2 bg-[var(--color-bg)] rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}