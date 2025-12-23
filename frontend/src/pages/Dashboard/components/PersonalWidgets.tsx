import { useState, useEffect } from 'react';
import { Note, PushPin, CalendarCheck, CheckSquare, Plus, Clock, Play } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export function StickyNotesWidget() {
    const [note, setNote] = useState(() => localStorage.getItem('dash_sticky_note') || '');
    useEffect(() => { localStorage.setItem('dash_sticky_note', note); }, [note]);

    return (
        <div className="glass-card flex flex-col h-full bg-[#fef3c7] dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition"><PushPin weight="fill" className="text-amber-600 dark:text-amber-400" /></div>
            <div className="flex items-center gap-2 mb-2 opacity-60"><Note weight="bold" className="text-amber-700 dark:text-amber-300" /><span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-200">Scratchpad</span></div>
            <textarea className="flex-1 bg-transparent resize-none outline-none text-sm font-medium text-amber-900 dark:text-amber-100 placeholder-amber-800/40" placeholder="Type a quick note..." value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
    );
}

export function MyTodayWidget() {
    const today = new Date();
    return (
        <div className="glass-card h-full flex flex-col justify-between bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="z-10">
                <h3 className="text-3xl font-black font-['Montserrat'] text-[var(--color-text)] tracking-tight">{today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
                <p className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-wide mt-1">{today.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="mt-4 space-y-2 z-10">
                <div className="flex items-center gap-3 p-2 bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)]">
                    <div className="w-1 h-8 rounded-full bg-[var(--color-warning)]"></div>
                    <div><div className="text-xs font-bold text-[var(--color-text)]">Team Sync</div><div className="text-[10px] opacity-60 text-[var(--color-text-muted)]">10:00 AM • Zoom</div></div>
                </div>
            </div>
        </div>
    );
}

export function TimeSnapshotWidget() {
    const navigate = useNavigate();
    return (
        <div className="glass-card flex flex-col justify-between h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold flex items-center gap-2 text-[var(--color-text)]"><Clock weight="duotone" className="text-[var(--color-success)]" /> Time Log</h3>
            </div>
            <div className="text-center">
                <div className="text-3xl font-black text-[var(--color-text)] font-mono">04:12</div>
                <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] opacity-60">Hours Today</div>
            </div>
            <button onClick={() => navigate('/time')} className="w-full py-2 bg-[var(--color-success)]/10 text-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"><Play weight="fill" /> Resume Timer</button>
        </div>
    );
}

export function MyTasksWidget({ tasks }: { tasks: any[] }) {
    const navigate = useNavigate();
    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]"><CheckSquare weight="duotone" className="text-[var(--color-primary)]" /> My Tasks</h3>
                <button onClick={() => navigate('/tasks')} className="p-1.5 hover:bg-[var(--color-bg)] rounded text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition"><Plus weight="bold" /></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                {tasks.map(t => (
                    <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition cursor-pointer">
                        <div className="mt-0.5 w-4 h-4 rounded border-2 border-[var(--color-text-muted)]"></div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-[var(--color-text)] truncate">{t.title}</div>
                            <div className="flex items-center gap-2 mt-1"><span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-red-100 text-red-600">{t.due}</span><span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-bg)] text-[var(--color-text-muted)]">{t.tag}</span></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}