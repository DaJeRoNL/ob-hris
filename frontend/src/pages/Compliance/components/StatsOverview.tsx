import { Laptop, Buildings, ShieldCheck, ChartLineUp, CaretRight } from '@phosphor-icons/react';

interface Props {
    stats: any;
    onOpenDistribution: (type: 'Remote' | 'Hybrid') => void;
    onOpenPending: () => void;
}

export default function StatsOverview({ stats, onOpenDistribution, onOpenPending }: Props) {
    return (
        <div className="glass-card p-5 relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-success)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="font-bold flex items-center gap-2 text-[var(--color-text)]">
                    <ShieldCheck size={20} className="text-[var(--color-success)]" /> Compliance Score
                </h3>
                <span className="text-2xl font-bold font-mono text-[var(--color-success)]">{stats.complianceScore}%</span>
            </div>

            <div className="mb-6 relative z-10">
                <div className="flex justify-between text-[10px] uppercase font-bold opacity-60 mb-2 text-[var(--color-text)]">
                    <span>Current Risk Level</span>
                    <span className="text-[var(--color-success)]">Low</span>
                </div>
                <div className="w-full bg-[var(--color-border)] h-2 rounded-full overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success)]/80 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                        style={{ width: `${stats.complianceScore}%` }} 
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div 
                    onClick={() => onOpenDistribution('Hybrid')}
                    className="bg-[var(--color-bg)]/50 p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/10 cursor-pointer transition text-center group relative overflow-hidden text-[var(--color-text)]"
                >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CaretRight size={12} className="text-[var(--color-primary)]" />
                    </div>
                    <Buildings className="mx-auto mb-2 opacity-50 group-hover:scale-110 group-hover:text-[var(--color-primary)] transition-all" size={24} />
                    <div className="text-xl font-bold">{stats.hybrid}</div>
                    <div className="text-[10px] uppercase font-bold opacity-50">Hybrid Users</div>
                </div>

                <div 
                    onClick={() => onOpenDistribution('Remote')}
                    className="bg-[var(--color-bg)]/50 p-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-info)]/50 hover:bg-[var(--color-info)]/10 cursor-pointer transition text-center group relative overflow-hidden text-[var(--color-text)]"
                >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CaretRight size={12} className="text-[var(--color-info)]" />
                    </div>
                    <Laptop className="mx-auto mb-2 opacity-50 group-hover:scale-110 group-hover:text-[var(--color-info)] transition-all" size={24} />
                    <div className="text-xl font-bold">{stats.remote}</div>
                    <div className="text-[10px] uppercase font-bold opacity-50">Remote Users</div>
                </div>
            </div>

            {/* Pending Reviews Button */}
            <div 
                onClick={onOpenPending}
                className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-between items-center cursor-pointer group text-[var(--color-text)]"
            >
                <div className="text-[10px] opacity-60 font-bold uppercase group-hover:text-[var(--color-warning)] transition-colors">Pending Reviews</div>
                <div className="flex items-center gap-2">
                     <span className="text-xs font-bold bg-[var(--color-warning)]/10 text-[var(--color-warning)] px-2 py-0.5 rounded border border-[var(--color-warning)]/20 group-hover:bg-[var(--color-warning)] group-hover:text-white transition-all">
                        {stats.pendingReviewsCount} Items
                     </span>
                     <ChartLineUp size={14} className="text-[var(--color-warning)] group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
}