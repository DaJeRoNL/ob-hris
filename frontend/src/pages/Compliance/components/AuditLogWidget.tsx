import { FileText, CheckCircle, Warning, XCircle, Clock } from '@phosphor-icons/react';
import { AuditEvent } from '../types';

interface Props {
    logs: AuditEvent[];
    onViewReport: () => void;
}

export default function AuditLogWidget({ logs, onViewReport }: Props) {
    
    const getIcon = (status: string) => {
        switch(status) {
            case 'Success': return <CheckCircle weight="fill" className="text-[var(--color-success)]" />;
            case 'Warning': return <Warning weight="fill" className="text-[var(--color-warning)]" />;
            case 'Error': return <XCircle weight="fill" className="text-[var(--color-danger)]" />;
            default: return <Clock weight="fill" className="text-[var(--color-text-muted)]" />;
        }
    };

    return (
        <div className="glass-card flex-1 flex flex-col p-0 overflow-hidden min-h-[300px] bg-[var(--color-surface)] border border-[var(--color-border)]">
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/50 flex justify-between items-center shrink-0">
                <h3 className="font-bold flex items-center gap-2 text-sm text-[var(--color-text)]">
                    <FileText size={18} className="text-[var(--color-info)]" /> Audit Stream
                </h3>
                <div className="text-[10px] font-bold uppercase opacity-40 text-[var(--color-text-muted)]">
                    Real-time
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                {logs.map(log => (
                    <div key={log.id} className="group p-3 rounded-lg hover:bg-[var(--color-bg)] transition flex items-start gap-3 border border-transparent hover:border-[var(--color-border)]">
                        <div className="mt-0.5 shrink-0">{getIcon(log.status)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-[var(--color-text)]">{log.action}</span>
                                <span className="text-[10px] font-mono opacity-50 text-[var(--color-text-muted)]">{log.timestamp}</span>
                            </div>
                            <div className="text-[11px] opacity-70 truncate text-[var(--color-text)]" title={log.details}>
                                {log.details}
                            </div>
                            <div className="mt-1 text-[10px] opacity-40 font-bold uppercase flex items-center gap-1 text-[var(--color-text-muted)]">
                                <div className="w-1 h-1 rounded-full bg-current"></div> {log.user}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Action */}
            <div className="p-3 border-t border-[var(--color-border)] shrink-0">
                <button 
                    onClick={onViewReport}
                    className="w-full py-2 text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-lg transition font-bold flex justify-center items-center gap-2 group"
                >
                    View Full Report <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </div>
    );
}