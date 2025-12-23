import { useNavigate } from 'react-router-dom';
import { CheckCircle, WarningCircle, ArrowRight, BellRinging } from '@phosphor-icons/react';

interface Task {
    id: string;
    title: string;
    desc: string;
    type: string;
    priority: string;
    actionLink: string;
}

export default function PendingTasksWidget({ tasks }: { tasks: Task[] }) {
    const navigate = useNavigate();

    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]">
                    <BellRinging weight="duotone" className="text-[var(--color-danger)]" /> Pending Actions
                </h3>
                <span className="text-xs font-bold bg-[var(--color-danger)]/10 text-[var(--color-danger)] px-2 py-1 rounded-full border border-[var(--color-danger)]/20">
                    {tasks.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-40 text-[var(--color-text)]">
                        <CheckCircle size={32} />
                        <span className="text-xs font-bold mt-2">All Caught Up</span>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-bg)] transition group cursor-pointer" onClick={() => navigate(task.actionLink)}>
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    {task.priority === 'Critical' && <WarningCircle weight="fill" className="text-[var(--color-danger)]" />}
                                    <span className="text-xs font-bold text-[var(--color-text)]">{task.type}</span>
                                </div>
                                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                    task.priority === 'Critical' ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]' : 
                                    'bg-[var(--color-warning)]/10 text-[var(--color-warning)]'
                                }`}>{task.priority}</span>
                            </div>
                            <div className="font-bold text-sm text-[var(--color-text)] mb-0.5">{task.title}</div>
                            <div className="text-[10px] opacity-60 text-[var(--color-text-muted)] flex justify-between items-center">
                                <span className="truncate max-w-[150px]">{task.desc}</span>
                                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-primary)]" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}