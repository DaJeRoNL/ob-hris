import { FileText, TrendUp, Users, ShieldCheck, Check } from '@phosphor-icons/react';

export function OnboardingProgressWidget({ data }: { data: any[] }) {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-4 flex justify-between"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><Users weight="duotone" className="text-[var(--color-primary)]" /> Onboarding</h3></div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {data.map(p => (
                    <div key={p.id}>
                        <div className="flex justify-between text-xs mb-1"><span className="font-bold text-[var(--color-text)]">{p.name}</span><span className="opacity-60 text-[var(--color-text-muted)]">{p.progress}%</span></div>
                        <div className="w-full h-1.5 bg-[var(--color-bg)] rounded-full"><div className="h-full bg-[var(--color-success)] rounded-full" style={{ width: `${p.progress}%` }}></div></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function DocExpiryWidget({ data }: { data: any[] }) {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-4"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><FileText weight="duotone" className="text-[var(--color-warning)]" /> Expiry Tracker</h3></div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                {data.map((doc: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-[var(--color-bg)]/50 rounded-lg border border-[var(--color-border)]">
                        <div><div className="text-xs font-bold text-[var(--color-text)]">{doc.name}</div><div className="text-[10px] opacity-60 text-[var(--color-text-muted)]">{doc.docType}</div></div>
                        <span className="text-[10px] font-bold text-[var(--color-danger)] bg-[var(--color-danger)]/10 px-2 py-1 rounded">{doc.daysLeft} days</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function HeadcountBreakdownWidget({ data }: { data: any[] }) {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-4"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><TrendUp weight="duotone" className="text-[var(--color-info)]" /> Headcount</h3></div>
            <div className="flex-1 space-y-3">
                {data.map((d: any, i: number) => (
                    <div key={i} className="flex justify-between items-center">
                        <span className="text-xs font-bold opacity-70 text-[var(--color-text)]">{d.dept}</span>
                        <div className="flex items-center gap-2 w-1/2"><div className="h-2 bg-[var(--color-primary)] rounded-full" style={{ width: `${d.count * 10}%` }}></div><span className="text-[10px] font-mono text-[var(--color-text-muted)]">{d.count}</span></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ComplianceStatusWidget({ data }: { data: any }) {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-4"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><ShieldCheck weight="duotone" className="text-[var(--color-success)]" /> Compliance</h3></div>
            <div className="flex flex-col items-center justify-center flex-1">
                <div className="text-5xl font-black text-[var(--color-success)] mb-2">{data.score}%</div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-50 text-[var(--color-text-muted)]">Audit Score</div>
                {data.pending > 0 && <div className="mt-4 px-3 py-1 bg-[var(--color-warning)]/10 text-[var(--color-warning)] text-[10px] font-bold rounded-full border border-[var(--color-warning)]/20">{data.pending} Pending Reviews</div>}
            </div>
        </div>
    );
}