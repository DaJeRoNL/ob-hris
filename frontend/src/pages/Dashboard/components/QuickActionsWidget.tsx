import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus, Clock, FileText, Lightning } from '@phosphor-icons/react';

export default function QuickActionsWidget() {
    const navigate = useNavigate();

    const ACTIONS = [
        { label: 'Start Timer', icon: Clock, to: '/time', color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10' },
        { label: 'Add Candidate', icon: UserPlus, to: '/hiring', color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary)]/10' },
        { label: 'New Invoice', icon: FileText, to: '/finance', color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning)]/10' },
        { label: 'Create Task', icon: Plus, to: '/tasks', color: 'text-[var(--color-info)]', bg: 'bg-[var(--color-info)]/10' },
    ];

    return (
        <div className="glass-card flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold flex items-center gap-2 text-lg text-[var(--color-text)]">
                    <Lightning weight="duotone" className="text-[var(--color-warning)]" /> Quick Actions
                </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 flex-1">
                {ACTIONS.map((action, i) => (
                    <button 
                        key={i}
                        onClick={() => navigate(action.to)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg)] hover:border-[var(--color-primary)]/30 transition-all group"
                    >
                        <div className={`w-8 h-8 rounded-full ${action.bg} ${action.color} flex items-center justify-center mb-2 transition-transform group-hover:scale-110`}>
                            <action.icon weight="bold" />
                        </div>
                        <span className="text-xs font-bold text-[var(--color-text)]">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}