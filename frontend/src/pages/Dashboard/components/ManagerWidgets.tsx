import { Users, Briefcase, WarningCircle, Cake, Confetti } from '@phosphor-icons/react';

export function TeamAvailabilityWidget({ members }: { members: any[] }) {
    const online = members.filter(m => m.status === 'Online').length;
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><Users weight="duotone" className="text-[var(--color-info)]" /> Availability</h3>
            </div>
            <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-[var(--color-bg)] p-2 rounded-lg text-center border border-[var(--color-border)]">
                    <div className="text-xl font-bold text-[var(--color-success)]">{online}</div>
                    <div className="text-[9px] uppercase font-bold text-[var(--color-text-muted)]">Online</div>
                </div>
                <div className="flex-1 bg-[var(--color-bg)] p-2 rounded-lg text-center border border-[var(--color-border)]"><div className="text-xl font-bold text-[var(--color-warning)]">{members.length - online}</div><div className="text-[9px] uppercase font-bold text-[var(--color-text-muted)]">Away</div></div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 hover:bg-[var(--color-bg)] rounded-lg transition">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">{m.avatar}</div>
                            <span className="text-sm font-bold text-[var(--color-text)]">{m.name}</span>
                        </div>
                        <div className={`w-2.5 h-2.5 rounded-full ${m.status === 'Online' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-text-muted)]'}`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TeamWorkloadWidget({ workload }: { workload: any[] }) {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-4"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><Briefcase weight="duotone" className="text-[var(--color-primary)]" /> Workload</h3></div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {workload.map(w => (
                    <div key={w.id} className="group">
                        <div className="flex justify-between items-center mb-1 text-xs"><span className="font-bold text-[var(--color-text)]">{w.name}</span><span className="font-mono opacity-60 text-[var(--color-text-muted)]">{w.hours}h</span></div>
                        <div className="w-full h-2 bg-[var(--color-bg)] rounded-full overflow-hidden"><div className="h-full bg-[var(--color-primary)]" style={{ width: `${Math.min((w.hours / w.capacity) * 100, 100)}%` }}></div></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TeamAlertsWidget() {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-4 flex items-center justify-between"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><WarningCircle weight="duotone" className="text-[var(--color-danger)]" /> Alerts</h3></div>
            <div className="flex-1 space-y-2">
                <div className="p-3 bg-[var(--color-danger)]/10 rounded-lg border border-[var(--color-danger)]/20 flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-danger)] mt-1.5"></div><div><div className="text-xs font-bold text-[var(--color-text)]">Missing Timesheets</div><div className="text-[10px] opacity-60 text-[var(--color-text-muted)]">3 Employees (Yesterday)</div></div></div>
                <div className="p-3 bg-[var(--color-warning)]/10 rounded-lg border border-[var(--color-warning)]/20 flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] mt-1.5"></div><div><div className="text-xs font-bold text-[var(--color-text)]">Probation Ending</div><div className="text-[10px] opacity-60 text-[var(--color-text-muted)]">Alice Johnson (5 days)</div></div></div>
            </div>
        </div>
    );
}

export function UpcomingEventsWidget({ events }: { events: any[] }) {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-4"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><Confetti weight="duotone" className="text-[var(--color-secondary)]" /> Events</h3></div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                {events.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-bg)] transition">
                        <div className={`p-2 rounded-lg ${ev.type === 'Birthday' ? 'bg-pink-500/10 text-pink-500' : 'bg-purple-500/10 text-purple-500'}`}>{ev.type === 'Birthday' ? <Cake weight="fill" /> : <Confetti weight="fill" />}</div>
                        <div><div className="text-sm font-bold text-[var(--color-text)]">{ev.name}</div><div className="text-[10px] opacity-60 text-[var(--color-text-muted)]">{ev.type} • {ev.date}</div></div>
                    </div>
                ))}
            </div>
        </div>
    );
}