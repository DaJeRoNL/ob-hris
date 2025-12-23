import { MagnifyingGlass, Link as LinkIcon } from '@phosphor-icons/react';

export function QuickLookupWidget() {
    return (
        <div className="glass-card flex flex-col justify-center h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]" placeholder="Find employee..." />
            </div>
        </div>
    );
}

export function QuickLinksWidget() {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-3 font-bold text-sm text-[var(--color-text)] flex items-center gap-2"><LinkIcon /> Quick Links</div>
            <div className="grid grid-cols-2 gap-2">
                <button className="text-xs p-2 bg-[var(--color-bg)] rounded border border-[var(--color-border)] hover:text-[var(--color-primary)] transition text-[var(--color-text-muted)]">Handbook</button>
                <button className="text-xs p-2 bg-[var(--color-bg)] rounded border border-[var(--color-border)] hover:text-[var(--color-primary)] transition text-[var(--color-text-muted)]">Payroll</button>
                <button className="text-xs p-2 bg-[var(--color-bg)] rounded border border-[var(--color-border)] hover:text-[var(--color-primary)] transition text-[var(--color-text-muted)]">Slack</button>
                <button className="text-xs p-2 bg-[var(--color-bg)] rounded border border-[var(--color-border)] hover:text-[var(--color-primary)] transition text-[var(--color-text-muted)]">Jira</button>
            </div>
        </div>
    );
}