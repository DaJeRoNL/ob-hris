import { CurrencyDollar, TrendDown, TrendUp } from '@phosphor-icons/react';

export function PayrollSnapshotWidget({ data }: { data: any }) {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-6"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><CurrencyDollar weight="duotone" className="text-[var(--color-success)]" /> Payroll</h3></div>
            <div className="mb-6">
                <div className="text-4xl font-black text-[var(--color-text)] tracking-tight">${data.total.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-2 text-xs font-bold text-[var(--color-success)]"><TrendUp weight="bold" /> +{data.change}% vs last month</div>
            </div>
            <div className="flex items-end gap-1 h-12 opacity-50">
                {data.history.map((h: number, i: number) => (
                    <div key={i} className="bg-[var(--color-primary)] flex-1 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
            </div>
        </div>
    );
}

export function AttritionWidget({ data }: { data: any }) {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-6"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><TrendDown weight="duotone" className="text-[var(--color-danger)]" /> Attrition</h3></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] text-center">
                    <div className="text-2xl font-bold text-[var(--color-text)]">{data.monthly}%</div>
                    <div className="text-[10px] opacity-50 uppercase font-bold text-[var(--color-text-muted)]">Monthly</div>
                </div>
                <div className="p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] text-center">
                    <div className="text-2xl font-bold text-[var(--color-text)]">{data.quarterly}%</div>
                    <div className="text-[10px] opacity-50 uppercase font-bold text-[var(--color-text-muted)]">Quarterly</div>
                </div>
            </div>
            <div className="mt-4 text-center text-xs font-bold text-[var(--color-success)] bg-[var(--color-success)]/10 py-2 rounded-lg">Trend is Stabilizing</div>
        </div>
    );
}