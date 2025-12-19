import { useNavigate } from 'react-router-dom';
import { Users, CurrencyDollar, ShieldCheck, Briefcase, TrendUp, TrendDown, CaretRight } from '@phosphor-icons/react';
import { MetricItem } from '../types';

const ICONS: Record<string, any> = { 'indigo': Users, 'emerald': CurrencyDollar, 'rose': ShieldCheck, 'blue': ShieldCheck, 'amber': Briefcase };

// Map generic color names to Theme Context semantic variables
const THEME_MAP: Record<string, { text: string, bg: string, border: string }> = {
    indigo: { text: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary)]/10', border: 'border-[var(--color-primary)]/20' },
    emerald: { text: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10', border: 'border-[var(--color-success)]/20' },
    rose: { text: 'text-[var(--color-danger)]', bg: 'bg-[var(--color-danger)]/10', border: 'border-[var(--color-danger)]/20' },
    blue: { text: 'text-[var(--color-info)]', bg: 'bg-[var(--color-info)]/10', border: 'border-[var(--color-info)]/20' },
    amber: { text: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning)]/10', border: 'border-[var(--color-warning)]/20' },
    purple: { text: 'text-[var(--color-secondary)]', bg: 'bg-[var(--color-secondary)]/10', border: 'border-[var(--color-secondary)]/20' }
};

export default function ExecutiveSummary({ metrics }: { metrics: MetricItem[] }) {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {metrics.map((m, i) => {
                const Icon = ICONS[m.color] || Users;
                const isPositive = m.trend >= 0;
                const theme = THEME_MAP[m.color] || THEME_MAP['indigo'];

                return (
                    <div 
                        key={i} 
                        onClick={() => m.linkTo && navigate(m.linkTo)}
                        className="glass-card relative overflow-hidden group cursor-pointer transition-all duration-500 hover:translate-y-[-4px] border border-[var(--color-border)] hover:border-[var(--color-border)] hover:shadow-lg"
                    >
                        {/* Dynamic Blur Background */}
                        <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full ${theme.bg} blur-[60px] opacity-50 group-hover:opacity-100 transition-all duration-700`} />
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center ${theme.text} text-xl shadow-inner border ${theme.border} transition-transform group-hover:scale-110 duration-500 ease-out`}>
                                <Icon weight="duotone" />
                            </div>
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md transition-colors 
                                ${isPositive 
                                    ? 'bg-[var(--color-success)]/5 text-[var(--color-success)] border-[var(--color-success)]/10 group-hover:bg-[var(--color-success)]/10' 
                                    : 'bg-[var(--color-danger)]/5 text-[var(--color-danger)] border-[var(--color-danger)]/10 group-hover:bg-[var(--color-danger)]/10'
                                }`}>
                                {isPositive ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
                                {Math.abs(m.trend)}%
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-1">
                                <div className="text-3xl font-bold font-['Montserrat'] tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-text)] transition-colors duration-300">
                                    {m.isCurrency && '$'}{m.value}
                                </div>
                            </div>
                            <div className="text-xs font-bold uppercase opacity-50 tracking-widest mb-2 flex items-center gap-2 group-hover:opacity-80 transition-opacity text-[var(--color-text)]">
                                {m.label}
                                <CaretRight className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${theme.text}`} />
                            </div>
                            <div className="text-[10px] opacity-30 font-mono group-hover:opacity-60 transition-opacity text-[var(--color-text)]">
                                {isPositive ? '▲' : '▼'} {m.trendLabel}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}