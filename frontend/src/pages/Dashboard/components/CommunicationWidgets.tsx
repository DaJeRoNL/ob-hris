import { Megaphone, Confetti } from '@phosphor-icons/react';

export function AnnouncementsWidget({ items }: { items: any[] }) {
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="mb-4"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><Megaphone weight="duotone" className="text-[var(--color-primary)]" /> News</h3></div>
            <div className="flex-1 space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-[var(--color-primary)]">{item.author}</span>
                            <span className="text-[10px] opacity-50 text-[var(--color-text-muted)]">{item.date}</span>
                        </div>
                        <div className="text-sm font-medium text-[var(--color-text)]">{item.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CelebrationsWidget({ events }: { events: any[] }) {
    return (
        <div className="glass-card flex flex-col h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] border border-[var(--color-border)]">
            <div className="mb-4"><h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><Confetti weight="duotone" className="text-pink-500" /> Celebrations</h3></div>
            <div className="flex-1 space-y-2">
                {events.slice(0, 2).map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--color-surface)]/50 border border-[var(--color-border)]">
                        <div className="w-8 h-8 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center">🎉</div>
                        <div><div className="text-sm font-bold text-[var(--color-text)]">{ev.name}</div><div className="text-[10px] opacity-60 text-[var(--color-text-muted)]">{ev.type}</div></div>
                    </div>
                ))}
            </div>
        </div>
    );
}